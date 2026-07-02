const P=window.NikePatterns,productRepo=new P.Repository("products");
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],money=n=>`S/ ${Number(n).toFixed(2)}`;
const productGrid=$("#productGrid"),count=$("#count"),total=$("#total"),drawer=$("#drawer"),cartBtn=$("#cartBtn"),checkout=$("#checkout"),loginModal=$("#loginModal"),shopLogin=$("#shopLogin"),toast=$("#toast"),sessionBtn=$("#sessionBtn"),closeLogin=$("#closeLogin"),adminLink=$("#adminLink"),authTitle=$("#authTitle"),authDescription=$("#authDescription"),authSubmit=$("#authSubmit"),authMessage=$("#authMessage");
const supabaseClient=window.supabase?.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
let cart=JSON.parse(localStorage.getItem("nike_cart")||"[]"),activeFilter="Novedades",authMode="login",currentUser=null;

function notify(text,type="info"){toast.textContent=text;toast.dataset.type=type;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2600)}
function stockText(p){if(p.stock===0)return'<span class="stock out">Sin stock</span>';if(p.stock<=5)return'<span class="stock low">Quedan pocas unidades</span>';return'<span class="stock available">Disponible</span>'}
function matchesFilter(p){
    const isFootballProduct=p.line==="Futbol"||p.category==="Camisetas";
    if(activeFilter==="Novedades")return p.line==="Novedades";
    if(activeFilter==="Futbol")return isFootballProduct;
    if(isFootballProduct)return false;
    if(activeFilter==="Hombre"||activeFilter==="Mujer")return p.audience===activeFilter;
    return p.line===activeFilter;
}
function productVisual(p){
    const isBall=p.category==="Pelotas",isShirt=p.category==="Ropa"||p.category==="Camisetas",isBoot=p.category==="Chimpunes";
    const shape=isBall?`<circle cx="400" cy="300" r="155" fill="#f8f8f8" stroke="#111" stroke-width="16"/><path d="M400 145l75 55-28 88h-94l-28-88zM245 260l108 28-5 96-94 35M555 260l-108 28 5 96 94 35M320 510l28-126h104l28 126" fill="none" stroke="#111" stroke-width="16"/>`:isShirt?`<path d="M270 175l90-45h80l90 45 100 105-75 75-55-55v250H300V300l-55 55-75-75z" fill="url(#g)" stroke="#111" stroke-width="10"/><path d="M360 130q40 80 80 0" fill="none" stroke="#111" stroke-width="10"/>`:isBoot?`<path d="M170 395c130-10 190-65 250-180l95 30 15 95 115 55c25 12 15 65-20 65H205c-70 0-85-55-35-65z" fill="url(#g)" stroke="#111" stroke-width="10"/><path d="M290 330l190 45M250 500v35m80-35v35m80-35v35m80-35v35" stroke="#111" stroke-width="13"/>`:`<path d="M125 390c105-15 180-95 245-190 40-58 100-48 145 5l55 65 125 80c40 25 20 90-25 90H170c-60 0-80-40-45-50z" fill="url(#g)" stroke="#111" stroke-width="10"/><path d="M220 390c110-15 205-65 300-160M130 440h545" fill="none" stroke="#fff" stroke-width="15"/>`;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="${p.visualA||"#111"}"/><stop offset="1" stop-color="${p.visualB||"#777"}"/></linearGradient></defs><rect width="800" height="800" fill="${p.visualBg||"#efefef"}"/><g transform="translate(0 40)">${shape}</g><text x="50%" y="675" text-anchor="middle" font-family="Arial" font-size="31" font-weight="700" fill="#111">${p.name}</text><text x="50%" y="720" text-anchor="middle" font-family="Arial" font-size="19" fill="#555">${p.color}</text><text x="50%" y="755" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#111">NIKE ${p.category.toUpperCase()}</text></svg>`;
    return`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function productImageFallback(img,id){const p=productRepo.all().find(x=>x.id===id);img.onerror=null;img.src=productVisual(p)}
function renderProducts(){
    productGrid.innerHTML=productRepo.all().filter(matchesFilter).map(p=>`<article class="card reveal ${p.stock===0?"sold-out":""}"><div class="image-wrap"><img src="${p.image}" onerror="productImageFallback(this,${p.id})" alt="${p.name}" loading="lazy">${p.line==="Novedades"?'<span class="new-tag">Nuevo</span>':""}</div><div class="card-row"><div><h3>${p.name}</h3><span class="muted">${p.category} · ${p.color}<br>Talla ${p.size}${p.sku?` · SKU ${p.sku}`:""}</span>${p.detail?`<p class="product-detail">${p.detail}</p>`:""}${stockText(p)}</div><b>${money(p.price)}</b></div><button ${p.stock===0?"disabled":""} onclick="add(${p.id})">${p.stock===0?"Producto agotado":"Agregar al carrito"}</button></article>`).join("")||"<p>No hay productos en esta sección.</p>";
    observeReveals();
}
function add(id){
    const p=productRepo.all().find(x=>x.id===id);if(!p||p.stock===0)return notify("Este producto no tiene stock","error");
    const item=cart.find(x=>x.id===id);if(item&&item.quantity>=p.stock)return notify("No hay más unidades disponibles","error");
    item?item.quantity++:cart.push({id,quantity:1});saveCart();renderCart();notify("Producto agregado al carrito","success");
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart()}
function changeQuantity(id,amount){const item=cart.find(x=>x.id===id),p=productRepo.all().find(x=>x.id===id);if(!item)return;if(amount>0&&item.quantity>=p.stock)return notify("No hay más unidades disponibles","error");item.quantity+=amount;if(item.quantity<=0)removeItem(id);else{saveCart();renderCart()}}
function saveCart(){localStorage.setItem("nike_cart",JSON.stringify(cart))}
function renderCart(){
    let sum=0;$("#cart").innerHTML=cart.map(i=>{const p=productRepo.all().find(x=>x.id===i.id);if(!p)return"";sum+=p.price*i.quantity;return`<div class="cart-item"><img src="${p.image}"><span><b>${p.name}</b><br><small>${money(p.price)}</small><span class="qty"><button onclick="changeQuantity(${p.id},-1)">−</button>${i.quantity}<button onclick="changeQuantity(${p.id},1)">+</button></span></span><button onclick="removeItem(${p.id})">×</button></div>`}).join("")||'<div class="empty-cart"><b>Tu carrito está vacío</b><span>Agrega tus productos favoritos.</span></div>';
    count.textContent=cart.reduce((a,x)=>a+x.quantity,0);total.textContent=money(sum);
}
function setFilter(filter){activeFilter=filter;$$("[data-filter]").forEach(a=>a.classList.toggle("active",a.dataset.filter===filter));$("#productos").scrollIntoView({behavior:"smooth"});renderProducts()}
function openAuth(mode="login"){setAuthMode(mode);authMessage.textContent="";loginModal.showModal()}
function setAuthMode(mode){authMode=mode;$$("[data-auth-mode]").forEach(b=>b.classList.toggle("active",b.dataset.authMode===mode));$$(".register-only").forEach(x=>{x.style.display=mode==="register"?"block":"none";x.required=mode==="register"});authTitle.textContent=mode==="register"?"Crea tu cuenta Nike":"Inicia sesión para continuar";authDescription.textContent=mode==="register"?"Regístrate para guardar tus compras y beneficios.":"Accede a tu cuenta para finalizar la compra.";authSubmit.textContent=mode==="register"?"Crear cuenta":"Iniciar sesión"}
async function submitAuth(e){
    e.preventDefault();const f=new FormData(e.target),email=f.get("email"),password=f.get("password"),name=f.get("name");
    if(!supabaseClient)return showAuthError("No se pudo conectar con Supabase.");
    if(authMode==="register"&&!String(name||"").trim())return showAuthError("Ingresa tu nombre completo para crear la cuenta.");
    authSubmit.disabled=true;authSubmit.textContent="Procesando...";
    const result=authMode==="register"?await supabaseClient.auth.signUp({email,password,options:{data:{full_name:name}}}):await supabaseClient.auth.signInWithPassword({email,password});
    authSubmit.disabled=false;setAuthMode(authMode);
    if(result.error)return showAuthError(result.error.message);
    if(authMode==="register"&&!result.data.session)return showAuthError("La confirmación por correo está activa en Supabase. Desactiva Confirm email para entrar inmediatamente.");
    currentUser=result.data.session?.user||null;
    if(currentUser)await ensureRemoteProfile(authMode==="register"?name:currentUser.user_metadata?.full_name);
    if(authMode==="register")syncLocalClient(name,email);
    loginModal.close();await loadProfile();notify(authMode==="register"?"Cuenta creada correctamente":"Sesión iniciada","success");
    if(result.data.session&&cart.length)drawer.classList.add("open");
}
function showAuthError(message){authMessage.textContent=message;authMessage.className="auth-message error"}
function syncLocalClient(name,email){
    const cleanEmail=String(email||"").trim().toLowerCase();if(!cleanEmail)return;
    const repo=new P.Repository("clients"),existing=repo.all().find(c=>String(c.email||"").toLowerCase()===cleanEmail);
    const data={name:String(name||"").trim()||cleanEmail.split("@")[0],email:cleanEmail,phone:existing?.phone||"Sin telefono"};
    repo.save(existing?{...existing,...data}:data);
}
async function ensureRemoteProfile(name){
    if(!supabaseClient||!currentUser)return;
    await supabaseClient.rpc("sincronizar_mi_perfil",{p_nombre:name||currentUser.user_metadata?.full_name||""});
}
async function loadProfile(){if(!currentUser||!supabaseClient)return updateSession();let{data}=await supabaseClient.from("usuarios").select("rol,nombre").eq("id",currentUser.id).maybeSingle();if(!data){await ensureRemoteProfile(currentUser.user_metadata?.full_name);({data}=await supabaseClient.from("usuarios").select("rol,nombre").eq("id",currentUser.id).maybeSingle())}currentUser.profileRole=data?.rol;currentUser.profileName=data?.nombre;if(data?.rol==="CLIENTE")syncLocalClient(data?.nombre||currentUser.user_metadata?.full_name,currentUser.email);updateSession()}
async function loadSession(){if(!supabaseClient)return;const{data}=await supabaseClient.auth.getSession();currentUser=data.session?.user||null;await loadProfile();supabaseClient.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;setTimeout(loadProfile,0)})}
async function logoutShop(){if(supabaseClient)await supabaseClient.auth.signOut();currentUser=null;updateSession();notify("Sesión cerrada")}
function updateSession(){sessionBtn.textContent=currentUser?"Cerrar sesión":"Iniciar sesión";adminLink.style.display=currentUser?.profileRole==="ADMIN"?"inline":"none"}
async function completeSale(){
    if(!cart.length)return notify("Agrega productos primero","error");if(!currentUser)return openAuth("login");
    const items=cart.map(i=>({quantity:i.quantity,product:productRepo.all().find(p=>p.id===i.id)}));if(items.some(i=>!i.product||i.quantity>i.product.stock))return notify("Revisa el stock del carrito","error");
    const sale=new P.SaleTemplate().process({client:currentUser.email,receipt:"BOLETA",strategy:new P.PricingStrategy(),items});
    await saveSaleToSupabase(sale,items);
    items.forEach(i=>{i.product.stock-=i.quantity;productRepo.save(i.product)});cart=[];saveCart();renderCart();renderProducts();drawer.classList.remove("open");notify(P.ReceiptFactory.create("BOLETA",sale)+" generada","success");
}
async function saveSaleToSupabase(sale,items){
    if(!supabaseClient||!currentUser)return;
    const{data,error}=await supabaseClient.from("ventas").insert({usuario_id:currentUser.id,cliente_email:currentUser.email,total:sale.total,estado:sale.status,comprobante:sale.receipt}).select("id").single();
    if(error){notify("Compra realizada, pero no se pudo sincronizar la venta con Supabase.","error");return}
    const detail=items.map(i=>({venta_id:data.id,producto_id:i.product.id,producto_nombre:i.product.name,cantidad:i.quantity,precio_unitario:i.product.price}));
    const{error:detailError}=await supabaseClient.from("venta_items").insert(detail);
    if(detailError)notify("La venta se registró, pero faltó sincronizar su detalle.","error");
}
function observeReveals(){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.08});$$(".reveal").forEach(x=>io.observe(x))}

$$("[data-filter]").forEach(a=>a.onclick=e=>{e.preventDefault();setFilter(a.dataset.filter)});
$$("[data-auth-mode]").forEach(b=>b.onclick=()=>setAuthMode(b.dataset.authMode));
cartBtn.onclick=()=>drawer.classList.add("open");$(".drawer .close").onclick=()=>drawer.classList.remove("open");checkout.onclick=completeSale;shopLogin.onsubmit=submitAuth;
sessionBtn.onclick=()=>currentUser?logoutShop():openAuth("login");closeLogin.onclick=()=>loginModal.close();
renderProducts();renderCart();setAuthMode("login");loadSession();
