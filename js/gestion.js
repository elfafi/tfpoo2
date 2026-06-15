const P=window.NikePatterns,localAuth=new P.AuthFacade(),$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],money=n=>`S/ ${Number(n).toFixed(2)}`;
const view=$("#view"),title=$("#title"),toast=$("#toast"),authDialog=$("#authDialog"),adminLogin=$("#adminLogin"),productDialog=$("#productDialog"),editProductDialog=$("#editProductDialog"),entityDialog=$("#entityDialog");
const supabaseClient=window.supabase?.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
const schemas={
    users:{title:"Usuarios",fields:["name","username","role"],labels:["Nombre","Usuario","Rol"]},
    clients:{title:"Clientes",fields:["name","email","phone"],labels:["Nombre","Correo","Teléfono"]},
    suppliers:{title:"Proveedores",fields:["name","contact","channel"],labels:["Nombre","Contacto","Canal"]}
};
const mediator=new P.MenuMediator();
mediator.subscribe(name=>$$(".admin-side button").forEach(b=>b.classList.toggle("active",b.dataset.view===name)));

function toastMsg(text,type="info"){toast.textContent=text;toast.dataset.type=type;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2300)}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
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
    title.textContent=name==="home"?"Dashboard":schemas[name]?.title||({products:"Productos",sales:"Ventas",reports:"Reportes",patterns:"Patrones aplicados"}[name]);
    if(schemas[name])renderCrud(name);else if(name==="products")renderProducts();else if(name==="sales")renderSales();else if(name==="reports")renderReports();else if(name==="patterns")renderPatterns();else renderHome();
    return name;
}
function renderHome(){
    const db=new P.DatabaseSingleton().data,r=new P.ReportFacade().generate();
    view.innerHTML=`<div class="stats">${[["Productos",db.products.length],["Clientes",db.clients.length],["Proveedores",db.suppliers.length],["Ventas locales",r.count]].map(x=>`<div class="stat"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("")}</div><div class="admin-grid"><div class="panel admin-welcome"><span class="eyebrow">RESUMEN COMERCIAL</span><h2>Controla la tienda desde un solo lugar.</h2><p>Actualiza catálogo, inventario y ventas. Las nuevas compras también se registran en Supabase.</p><button class="btn-primary" onclick="render('products')">Gestionar productos</button></div><div class="panel"><span class="eyebrow">INGRESOS LOCALES</span><h2>${money(r.total)}</h2><p class="muted">Ventas pagadas acumuladas en este navegador.</p><button class="btn-secondary" onclick="render('sales')">Ver ventas</button></div></div>`;
}
function renderCrud(entity){
    const s=schemas[entity],repo=new P.Repository(entity);
    view.innerHTML=`<div class="panel"><div class="panel-heading"><div><span class="eyebrow">GESTIÓN</span><h2>${s.title}</h2></div><button class="btn-primary" onclick="openEntityDialog('${entity}')">+ Añadir</button></div><div class="table-wrap"><table class="table"><thead><tr>${s.labels.map(x=>`<th>${x}</th>`).join("")}<th>Acciones</th></tr></thead><tbody>${repo.all().map(x=>`<tr>${s.fields.map(f=>`<td>${escapeHtml(x[f])}</td>`).join("")}<td><div class="table-actions"><button class="btn-secondary" onclick="openEntityDialog('${entity}',${x.id})">Editar</button><button class="btn-danger" onclick="removeEntity('${entity}',${x.id})">Eliminar</button></div></td></tr>`).join("")}</tbody></table></div></div>`;
}
function openEntityDialog(entity,id){
    const s=schemas[entity],item=id?new P.Repository(entity).all().find(x=>x.id===id):null;
    $("#entityDialogTitle").textContent=item?`Editar ${s.title.toLowerCase()}`:`Añadir ${s.title.toLowerCase()}`;
    const form=$("#entityDialogForm");form.dataset.entity=entity;form.innerHTML=`<input name="id" type="hidden" value="${item?.id||""}">${s.fields.map((field,i)=>`<label>${s.labels[i]}<input name="${field}" value="${escapeHtml(item?.[field]||"")}" required></label>`).join("")}<button class="primary">${item?"Guardar cambios":"Añadir registro"}</button>`;
    entityDialog.showModal();
}
$("#entityDialogForm").onsubmit=e=>{
    e.preventDefault();const entity=e.target.dataset.entity,formData=new FormData(e.target),id=Number(formData.get("id")),data={};
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
function renderReports(){const result=new P.ReportFacade().generate(new P.StatusExpression("PAGADA"),new P.ScreenVisitor());view.innerHTML=`<div class="stats"><div class="stat"><span>Ventas pagadas</span><b>${result.count}</b></div><div class="stat"><span>Ingresos locales</span><b>${money(result.total)}</b></div></div><div class="panel"><h2>Reporte de ventas</h2><div class="report-bar" style="width:${Math.min(100,result.count*12)}%"></div><p>Interpreter filtra ventas pagadas, Visitor calcula resultados, Observer permite actualizaciones y Facade unifica la operación.</p><button class="btn-secondary" onclick="window.print()">Imprimir / PDF</button></div>`}
function renderPatterns(){view.innerHTML=`<div class="panel"><h2>Patrones por módulo</h2><div class="patterns"><b>Acceso al sistema</b><br>Singleton, Proxy, Facade<br><b>Menú principal</b><br>Mediator, Command, Observer<br><b>Gestión de usuarios</b><br>Repository, Factory Method, Memento<br><b>Gestión de clientes</b><br>Repository, Prototype, Iterator<br><b>Gestión de proveedores</b><br>Repository, Adapter, Bridge<br><b>Gestión de productos</b><br>Repository, Builder, Composite, Decorator, Flyweight<br><b>Ventas</b><br>Abstract Factory, Strategy, Template Method, State, Chain of Responsibility<br><b>Reportes</b><br>Interpreter, Iterator, Visitor, Observer, Facade</div></div>`}
guard().then(allowed=>{if(allowed)render("home")});
