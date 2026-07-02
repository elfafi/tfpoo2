const P=window.NikePatterns,localAuth=new P.AuthFacade(),$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],money=n=>`S/ ${Number(n).toFixed(2)}`;
const view=$("#view"),title=$("#title"),toast=$("#toast"),authDialog=$("#authDialog"),adminLogin=$("#adminLogin"),productDialog=$("#productDialog"),editProductDialog=$("#editProductDialog"),entityDialog=$("#entityDialog");
const supabaseClient=window.supabase?.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
const schemas={
    users:{title:"Usuarios",fields:["name","username","role"],labels:["Nombre","Usuario","Rol"],remoteRole:"ADMIN"},
    clients:{title:"Clientes",fields:["name","email","phone"],labels:["Nombre","Correo","Teléfono"]},
    suppliers:{title:"Proveedores",fields:["name","contact","channel"],labels:["Nombre","Contacto","Canal"]}
};
schemas.clients.labels=["Nombre","Correo","Telefono"];
schemas.clients.remoteRole="CLIENTE";
const mediator=new P.MenuMediator();
mediator.subscribe(name=>$$(".admin-side button").forEach(b=>b.classList.toggle("active",b.dataset.view===name)));

function toastMsg(text,type="info"){toast.textContent=text;toast.dataset.type=type;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2300)}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function jsArg(value){return escapeHtml(JSON.stringify(value))}
function isPeopleEntity(entity){return entity==="users"||entity==="clients"}
function roleLabel(role){return role==="ADMIN"?"Administrador":"Cliente"}
function roleValue(value){return String(value||"CLIENTE").toUpperCase()==="ADMIN"?"ADMIN":"CLIENTE"}
function formatDate(value){return value?new Date(value).toLocaleString():"-"}
function roleBadge(role){return `<span class="role-badge ${role==="ADMIN"?"admin":"client"}">${roleLabel(role)}</span>`}
async function fetchProfiles(role,id){
    if(!supabaseClient)return{data:null,error:null};
    let query=supabaseClient.from("usuarios").select("id,nombre,email,rol,creado_en").order("creado_en",{ascending:false});
    if(id)query=query.eq("id",id).maybeSingle();else if(role)query=query.eq("rol",role);
    const{data,error}=await query;
    return{data,error};
}
async function isSupabaseAdmin(){
    if(!supabaseClient)return false;
    const{data:{session}}=await supabaseClient.auth.getSession();
    if(!session)return false;
    const{data}=await supabaseClient.from("usuarios").select("rol").eq("id",session.user.id).maybeSingle();
    return data?.rol==="ADMIN";
}
async function guard(){if(localAuth.isAdmin()||await isSupabaseAdmin())return true;authDialog.showModal();return false}

adminLogin.onsubmit=async e=>{
    e.preventDefault();const f=new FormData(e.target),email=f.get("email"),password=f.get("password");$("#adminAuthMessage").textContent="";
    if(email==="fabian"&&localAuth.login(email,password)){authDialog.close();render("home");return}
    if(!supabaseClient)return $("#adminAuthMessage").textContent="No se pudo conectar con Supabase.";
    const{data,error}=await supabaseClient.auth.signInWithPassword({email,password});
    if(error)return $("#adminAuthMessage").textContent="Credenciales incorrectas.";
    const{data:profile}=await supabaseClient.from("usuarios").select("rol").eq("id",data.user.id).maybeSingle();
    if(profile?.rol!=="ADMIN"){await supabaseClient.auth.signOut();return $("#adminAuthMessage").textContent="Esta cuenta no tiene permisos de administrador."}
    authDialog.close();render("home");
};
$("#logout").onclick=async()=>{sessionStorage.removeItem("user");if(supabaseClient)await supabaseClient.auth.signOut();location.href="index.html"};
$$("[data-view]").forEach(b=>b.onclick=()=>mediator.dispatch(new P.MenuCommand(()=>render(b.dataset.view))));
$$("[data-close-dialog]").forEach(b=>b.onclick=()=>$("#"+b.dataset.closeDialog).close());

function render(name){
    title.textContent=name==="home"?"Dashboard":schemas[name]?.title||({products:"Productos",sales:"Ventas",reports:"Reportes"}[name]);
    if(schemas[name])renderCrud(name);else if(name==="products")renderProducts();else if(name==="sales")renderSales();else if(name==="reports")renderReports();else renderHome();
    return name;
}
function renderHome(){
    const db=new P.DatabaseSingleton().data,r=new P.ReportFacade().generate();
    view.innerHTML=`<div class="stats">${[["Productos",db.products.length],["Clientes",db.clients.length],["Proveedores",db.suppliers.length],["Ventas locales",r.count]].map(x=>`<div class="stat"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("")}</div><div class="admin-grid"><div class="panel admin-welcome"><span class="eyebrow">RESUMEN COMERCIAL</span><h2>Controla la tienda desde un solo lugar.</h2><p>Actualiza catálogo, inventario y ventas. Las nuevas compras también se registran en Supabase.</p><button class="btn-primary" onclick="render('products')">Gestionar productos</button></div><div class="panel"><span class="eyebrow">INGRESOS LOCALES</span><h2>${money(r.total)}</h2><p class="muted">Ventas pagadas acumuladas en este navegador.</p><button class="btn-secondary" onclick="render('sales')">Ver ventas</button></div></div>`;
}
function renderCrud(entity){
    if(isPeopleEntity(entity)&&supabaseClient)return renderPeopleCrud(entity);
    const s=schemas[entity],repo=new P.Repository(entity),rows=repo.all();
    view.innerHTML=`<div class="panel"><div class="panel-heading"><div><span class="eyebrow">GESTION</span><h2>${s.title}</h2></div><button class="btn-primary" onclick="openEntityDialog('${entity}')">+ Anadir</button></div><div class="table-wrap"><table class="table"><thead><tr>${s.labels.map(x=>`<th>${x}</th>`).join("")}<th>Acciones</th></tr></thead><tbody>${rows.map(x=>`<tr>${s.fields.map(f=>`<td>${escapeHtml(x[f])}</td>`).join("")}<td><div class="table-actions"><button class="btn-secondary" onclick="openEntityDialog('${entity}',${jsArg(x.id)})">Editar</button><button class="btn-danger" onclick="removeEntity('${entity}',${jsArg(x.id)})">Eliminar</button></div></td></tr>`).join("")||`<tr><td colspan="${s.labels.length+1}">No hay registros.</td></tr>`}</tbody></table></div></div>`;
}
async function renderPeopleCrud(entity){
    const s=schemas[entity],role=s.remoteRole;
    view.innerHTML=`<div class="panel"><p>Cargando ${s.title.toLowerCase()}...</p></div>`;
    const{data,error}=await fetchProfiles(role);
    if(error){
        view.innerHTML=`<div class="panel"><h2>No se pudieron cargar los perfiles</h2><p class="muted">${escapeHtml(error.message)}</p><p class="muted">Ejecuta el SQL actualizado para permitir que los administradores vean y editen usuarios.</p></div>`;
        return;
    }
    const rows=data||[];
    view.innerHTML=`<div class="panel"><div class="panel-heading"><div><span class="eyebrow">SUPABASE AUTH</span><h2>${s.title}</h2><p class="muted">Los perfiles se crean automaticamente al registrar una cuenta en la tienda.</p></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Registrado</th><th>Acciones</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${escapeHtml(x.nombre||"Sin nombre")}</td><td>${escapeHtml(x.email)}</td><td>${roleBadge(x.rol)}</td><td>${formatDate(x.creado_en)}</td><td><button class="btn-secondary" onclick="openEntityDialog('${entity}',${jsArg(x.id)})">Editar rol</button></td></tr>`).join("")||'<tr><td colspan="5">No hay registros en este rol.</td></tr>'}</tbody></table></div></div>`;
}
async function openEntityDialog(entity,id){
    if(isPeopleEntity(entity)&&supabaseClient){
        const s=schemas[entity];
        if(!id)return toastMsg("Las cuentas nuevas se crean desde el registro de la tienda.","error");
        const{data,error}=await fetchProfiles(null,id);
        if(error||!data)return toastMsg(error?.message||"No se encontro el perfil.","error");
        $("#entityDialogTitle").textContent=`Editar ${s.title.toLowerCase()}`;
        const form=$("#entityDialogForm");form.dataset.entity=entity;form.innerHTML=`<input name="id" type="hidden" value="${escapeHtml(data.id)}"><label>Nombre<input name="nombre" value="${escapeHtml(data.nombre||"")}" required></label><label>Correo<input name="email" value="${escapeHtml(data.email)}" readonly></label><label>Rol<select name="rol" required><option value="CLIENTE" ${roleValue(data.rol)==="CLIENTE"?"selected":""}>Cliente</option><option value="ADMIN" ${roleValue(data.rol)==="ADMIN"?"selected":""}>Administrador</option></select></label><button class="primary">Guardar cambios</button>`;
        entityDialog.showModal();
        return;
    }
    const s=schemas[entity],item=id?new P.Repository(entity).all().find(x=>x.id===id):null;
    $("#entityDialogTitle").textContent=item?`Editar ${s.title.toLowerCase()}`:`Añadir ${s.title.toLowerCase()}`;
    const form=$("#entityDialogForm");form.dataset.entity=entity;form.innerHTML=`<input name="id" type="hidden" value="${item?.id||""}">${s.fields.map((field,i)=>`<label>${s.labels[i]}<input name="${field}" value="${escapeHtml(item?.[field]||"")}" required></label>`).join("")}<button class="primary">${item?"Guardar cambios":"Anadir registro"}</button>`;
    entityDialog.showModal();
}
$("#entityDialogForm").onsubmit=async e=>{
    e.preventDefault();const entity=e.target.dataset.entity,formData=new FormData(e.target);
    if(isPeopleEntity(entity)&&supabaseClient){
        const id=formData.get("id"),rol=roleValue(formData.get("rol"));
        const{error}=await supabaseClient.from("usuarios").update({nombre:formData.get("nombre"),rol}).eq("id",id);
        if(error)return toastMsg(error.message,"error");
        entityDialog.close();renderCrud(entity);toastMsg("Perfil actualizado. Si cambiaste el rol, se movio de apartado.","success");return;
    }
    const id=Number(formData.get("id")),data={};
    schemas[entity].fields.forEach(field=>data[field]=formData.get(field));if(id)data.id=id;else if(entity==="users")Object.assign(data,new P.UserFactory().create(data.name,data.username,data.role));
    new P.Repository(entity).save(data);entityDialog.close();renderCrud(entity);toastMsg(id?"Registro actualizado":"Registro creado","success");
};
function removeEntity(entity,id){new P.Repository(entity).delete(id);renderCrud(entity);toastMsg("Registro eliminado")}

function renderProducts(){
    const products=new P.Repository("products").all();
    view.innerHTML=`<div class="panel-heading page-heading"><div><span class="eyebrow">CATÁLOGO E INVENTARIO</span><h2>${products.length} productos</h2></div><button class="btn-primary" id="addProductBtn">+ Añadir producto</button></div><div class="admin-product-grid">${products.map(p=>`<article class="admin-product-card"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}"><div class="admin-product-info"><span class="product-section">${escapeHtml(p.line)}</span><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.category)} · Talla ${escapeHtml(p.size)}</p><div class="inventory-row"><b>${money(p.price)}</b><span class="${p.stock===0?"stock out":p.stock<=5?"stock low":"stock available"}">${p.stock===0?"Sin stock":p.stock<=5?"Pocas unidades":`${p.stock} unidades`}</span></div><div class="admin-actions"><button class="btn-secondary" onclick="openEditProduct(${p.id})">Editar</button><button class="btn-danger" onclick="removeProduct(${p.id})">Eliminar</button></div></div></article>`).join("")}</div>`;
    $("#addProductBtn").onclick=()=>productDialog.showModal();
}
$("#productForm").onsubmit=e=>{
    e.preventDefault();const data=Object.fromEntries(new FormData(e.target));data.price=+data.price;data.stock=+data.stock;
    const product=Object.entries(data).reduce((builder,[key,value])=>builder.set(key,P.ProductFlyweight.shared(value)),new P.ProductBuilder()).build();
    new P.Repository("products").save(product);e.target.reset();productDialog.close();renderProducts();toastMsg("Producto añadido","success");
};
function openEditProduct(id){
    const p=new P.Repository("products").all().find(x=>x.id===id);if(!p)return;
    $("#editProductName").textContent="Puedes cambiar el nombre, inventario y la ruta de imagen.";const f=$("#editProductForm");f.elements.id.value=p.id;f.elements.name.value=p.name;f.elements.size.value=p.size;f.elements.price.value=p.price;f.elements.stock.value=p.stock;f.elements.image.value=p.image;$("#editImagePreview").src=p.image;editProductDialog.showModal();
}
$("#editProductForm").elements.image.oninput=e=>$("#editImagePreview").src=e.target.value;
$("#editProductForm").onsubmit=e=>{
    e.preventDefault();const f=new FormData(e.target),repo=new P.Repository("products"),p=repo.all().find(x=>x.id===+f.get("id"));if(!p)return;
    p.name=f.get("name");p.size=f.get("size");p.price=+f.get("price");p.stock=+f.get("stock");p.image=f.get("image");repo.save(p);editProductDialog.close();renderProducts();toastMsg("Producto actualizado","success");
};
function removeProduct(id){if(!confirm("¿Eliminar este producto?"))return;new P.Repository("products").delete(id);renderProducts();toastMsg("Producto eliminado")}

async function renderSales(){
    view.innerHTML='<div class="panel"><p>Cargando ventas...</p></div>';
    let sales=[],remote=false;
    if(supabaseClient){const{data,error}=await supabaseClient.from("ventas").select("*").order("creado_en",{ascending:false});if(!error){sales=data;remote=true}}
    if(!remote)sales=new P.Repository("sales").all().map(s=>({...s,cliente_email:s.client,estado:s.status,comprobante:s.receipt,creado_en:s.date}));
    view.innerHTML=`<div class="panel"><div class="panel-heading"><div><span class="eyebrow">${remote?"SUPABASE":"ALMACENAMIENTO LOCAL"}</span><h2>Ventas registradas</h2></div></div><div class="table-wrap"><table class="table"><thead><tr><th>ID</th><th>Cliente</th><th>Comprobante</th><th>Estado</th><th>Total</th><th>Fecha</th><th>Acción</th></tr></thead><tbody>${sales.map(s=>`<tr><td>${s.id}</td><td>${escapeHtml(s.cliente_email)}</td><td>${escapeHtml(s.comprobante)}</td><td><span class="sale-status">${escapeHtml(s.estado)}</span></td><td>${money(s.total)}</td><td>${new Date(s.creado_en).toLocaleString()}</td><td><button class="btn-danger" onclick="removeSale('${s.id}',${remote})">Eliminar</button></td></tr>`).join("")||'<tr><td colspan="7">No hay ventas registradas.</td></tr>'}</tbody></table></div></div>`;
}
async function removeSale(id,remote){if(!confirm("¿Eliminar esta venta?"))return;if(remote){const{error}=await supabaseClient.from("ventas").delete().eq("id",id);if(error)return toastMsg(error.message,"error")}new P.Repository("sales").delete(Number(id));renderSales();toastMsg("Venta eliminada","success")}
function renderReportsLegacy(){const result=new P.ReportFacade().generate(new P.StatusExpression("PAGADA"),new P.ScreenVisitor());view.innerHTML=`<div class="stats"><div class="stat"><span>Ventas pagadas</span><b>${result.count}</b></div><div class="stat"><span>Ingresos locales</span><b>${money(result.total)}</b></div></div><div class="panel"><h2>Reporte de ventas</h2><div class="report-bar" style="width:${Math.min(100,result.count*12)}%"></div><p>Interpreter filtra ventas pagadas, Visitor calcula resultados, Observer permite actualizaciones y Facade unifica la operación.</p></div>`}
function renderPatterns(){view.innerHTML=`<div class="panel"><h2>Patrones por módulo</h2><div class="patterns"><b>Acceso al sistema</b><br>Singleton, Proxy, Facade<br><b>Menú principal</b><br>Mediator, Command, Observer<br><b>Gestión de usuarios</b><br>Repository, Factory Method, Memento<br><b>Gestión de clientes</b><br>Repository, Prototype, Iterator<br><b>Gestión de proveedores</b><br>Repository, Adapter, Bridge<br><b>Gestión de productos</b><br>Repository, Builder, Composite, Decorator, Flyweight<br><b>Ventas</b><br>Abstract Factory, Strategy, Template Method, State, Chain of Responsibility<br><b>Reportes</b><br>Interpreter, Iterator, Visitor, Observer, Facade</div></div>`}
function normalizeSale(raw){
    const items=(raw.venta_items||raw.items||[]).map(i=>({name:i.producto_nombre||i.productName||"Producto sin nombre",quantity:Number(i.cantidad||i.quantity||0),price:Number(i.precio_unitario||i.price||0)}));
    return{id:raw.id,client:raw.cliente_email||raw.client||"Sin cliente",status:raw.estado||raw.status||"PENDIENTE",receipt:raw.comprobante||raw.receipt||"-",total:Number(raw.total||0),date:raw.creado_en||raw.date,items};
}
function reportSummary(sales){
    const paid=sales.filter(s=>s.status==="PAGADA"),products=new Map(),clients=new Map(),statuses=new Map();
    sales.forEach(s=>{
        statuses.set(s.status,(statuses.get(s.status)||0)+1);
        const client=clients.get(s.client)||{name:s.client,count:0,total:0};client.count++;client.total+=s.total;clients.set(s.client,client);
        s.items.forEach(i=>{const p=products.get(i.name)||{name:i.name,quantity:0,total:0};p.quantity+=i.quantity;p.total+=i.quantity*i.price;products.set(i.name,p)});
    });
    const total=paid.reduce((a,x)=>a+x.total,0),productList=[...products.values()].sort((a,b)=>b.quantity-a.quantity||b.total-a.total),clientList=[...clients.values()].sort((a,b)=>b.total-a.total);
    return{sales,paid,total,avg:paid.length?total/paid.length:0,products:productList,clients:clientList,statuses:[...statuses.entries()],units:productList.reduce((a,x)=>a+x.quantity,0),last:sales[0]};
}
function renderReportHtml(summary,source){
    view.innerHTML=`<div class="stats report-stats"><div class="stat"><span>Ventas pagadas</span><b>${summary.paid.length}</b></div><div class="stat"><span>Ingresos</span><b>${money(summary.total)}</b></div><div class="stat"><span>Ticket promedio</span><b>${money(summary.avg)}</b></div><div class="stat"><span>Productos vendidos</span><b>${summary.units}</b></div></div><div class="report-grid"><div class="panel"><div class="panel-heading"><div><span class="eyebrow">${source}</span><h2>Productos mas vendidos</h2></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Producto</th><th>Unidades</th><th>Ingresos</th><th>Participacion</th></tr></thead><tbody>${summary.products.slice(0,8).map(p=>`<tr><td>${escapeHtml(p.name)}</td><td>${p.quantity}</td><td>${money(p.total)}</td><td><div class="mini-bar"><span style="width:${summary.units?Math.max(6,(p.quantity/summary.units)*100):0}%"></span></div></td></tr>`).join("")||'<tr><td colspan="4">No hay detalle de productos vendidos.</td></tr>'}</tbody></table></div></div><div class="panel"><h2>Resumen comercial</h2><div class="report-list"><p><b>Clientes con compras:</b> ${summary.clients.length}</p><p><b>Ultima venta:</b> ${summary.last?`${escapeHtml(summary.last.client)} - ${money(summary.last.total)} - ${formatDate(summary.last.date)}`:"Sin ventas"}</p><p><b>Estados:</b> ${summary.statuses.map(([status,count])=>`${escapeHtml(status)} (${count})`).join(", ")||"Sin estados"}</p></div></div></div><div class="report-grid"><div class="panel"><h2>Clientes con mayor compra</h2><div class="table-wrap"><table class="table"><thead><tr><th>Cliente</th><th>Compras</th><th>Total</th></tr></thead><tbody>${summary.clients.slice(0,6).map(c=>`<tr><td>${escapeHtml(c.name)}</td><td>${c.count}</td><td>${money(c.total)}</td></tr>`).join("")||'<tr><td colspan="3">No hay clientes con ventas.</td></tr>'}</tbody></table></div></div><div class="panel"><h2>Ventas recientes</h2><div class="table-wrap"><table class="table"><thead><tr><th>Cliente</th><th>Comprobante</th><th>Total</th><th>Fecha</th></tr></thead><tbody>${summary.sales.slice(0,6).map(s=>`<tr><td>${escapeHtml(s.client)}</td><td>${escapeHtml(s.receipt)}</td><td>${money(s.total)}</td><td>${formatDate(s.date)}</td></tr>`).join("")||'<tr><td colspan="4">No hay ventas registradas.</td></tr>'}</tbody></table></div></div></div>`;
}
async function renderReports(){
    view.innerHTML='<div class="panel"><p>Preparando reporte...</p></div>';
    if(supabaseClient){
        const{data,error}=await supabaseClient.from("ventas").select("id,cliente_email,total,estado,comprobante,creado_en,venta_items(producto_nombre,cantidad,precio_unitario)").order("creado_en",{ascending:false});
        if(!error){renderReportHtml(reportSummary((data||[]).map(normalizeSale)),"SUPABASE");return}
    }
    const localSales=new P.Repository("sales").all().map(normalizeSale).sort((a,b)=>new Date(b.date)-new Date(a.date));
    renderReportHtml(reportSummary(localSales),"ALMACENAMIENTO LOCAL");
}
guard().then(allowed=>{if(allowed)render("home")});
