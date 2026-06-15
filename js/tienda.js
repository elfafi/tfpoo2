const P=window.NikePatterns,productRepo=new P.Repository("products");
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],money=n=>`S/ ${Number(n).toFixed(2)}`;
const productGrid=$("#productGrid"),count=$("#count"),total=$("#total"),drawer=$("#drawer"),cartBtn=$("#cartBtn"),checkout=$("#checkout"),loginModal=$("#loginModal"),shopLogin=$("#shopLogin"),toast=$("#toast"),sessionBtn=$("#sessionBtn"),closeLogin=$("#closeLogin"),adminLink=$("#adminLink"),authTitle=$("#authTitle"),authDescription=$("#authDescription"),authSubmit=$("#authSubmit"),authMessage=$("#authMessage");
const supabaseClient=window.supabase?.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
let cart=JSON.parse(localStorage.getItem("nike_cart")||"[]"),activeFilter="Novedades",authMode="login",currentUser=null;

function notify(text,type="info"){toast.textContent=text;toast.dataset.type=type;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2600)}
function stockText(p){if(p.stock===0)return'<span class="stock out">Sin stock</span>';if(p.stock<=5)return'<span class="stock low">Quedan pocas unidades</span>';return'<span class="stock available">Disponible</span>'}
function matchesFilter(p){if(activeFilter==="Novedades")return p.line==="Novedades";if(activeFilter==="Hombre"||activeFilter==="Mujer")return p.audience===activeFilter;return p.line===activeFilter}
function renderProducts(){
    productGrid.innerHTML=productRepo.all().filter(matchesFilter).map(p=>`<article class="card reveal ${p.stock===0?"sold-out":""}"><div class="image-wrap"><img src="${p.image}" alt="${p.name}" loading="lazy">${p.line==="Novedades"?'<span class="new-tag">Nuevo</span>':""}</div><div class="card-row"><div><h3>${p.name}</h3><span class="muted">${p.category} · ${p.color}<br>Talla ${p.size}</span>${stockText(p)}</div><b>${money(p.price)}</b></div><button ${p.stock===0?"disabled":""} onclick="add(${p.id})">${p.stock===0?"Producto agotado":"Agregar al carrito"}</button></article>`).join("")||"<p>No hay productos en esta sección.</p>";
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
function setAuthMode(mode){authMode=mode;$$("[data-auth-mode]").forEach(b=>b.classList.toggle("active",b.dataset.authMode===mode));$$(".register-only").forEach(x=>x.style.display=mode==="register"?"block":"none");authTitle.textContent=mode==="register"?"Crea tu cuenta Nike":"Inicia sesión para continuar";authDescription.textContent=mode==="register"?"Regístrate para guardar tus compras y beneficios.":"Accede a tu cuenta para finalizar la compra.";authSubmit.textContent=mode==="register"?"Crear cuenta":"Iniciar sesión"}
async function submitAuth(e){
    e.preventDefault();const f=new FormData(e.target),email=f.get("email"),password=f.get("password"),name=f.get("name");
    if(!supabaseClient)return showAuthError("No se pudo conectar con Supabase.");
    authSubmit.disabled=true;authSubmit.textContent="Procesando...";
    const result=authMode==="register"?await supabaseClient.auth.signUp({email,password,options:{data:{full_name:name}}}):await supabaseClient.auth.signInWithPassword({email,password});
    authSubmit.disabled=false;setAuthMode(authMode);
    if(result.error)return showAuthError(result.error.message);
    currentUser=result.data.session?.user||null;loginModal.close();await loadProfile();notify(authMode==="register"?"Cuenta creada correctamente":"Sesión iniciada","success");
    if(authMode==="register"&&!result.data.session)notify("Revisa tu correo para confirmar la cuenta");
    if(result.data.session&&cart.length)drawer.classList.add("open");
}
function showAuthError(message){authMessage.textContent=message;authMessage.className="auth-message error"}
async function loadProfile(){if(!currentUser||!supabaseClient)return updateSession();const{data}=await supabaseClient.from("usuarios").select("rol,nombre").eq("id",currentUser.id).maybeSingle();currentUser.profileRole=data?.rol;currentUser.profileName=data?.nombre;updateSession()}
async function loadSession(){if(!supabaseClient)return;const{data}=await supabaseClient.auth.getSession();currentUser=data.session?.user||null;await loadProfile();supabaseClient.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;setTimeout(loadProfile,0)})}
async function logoutShop(){if(supabaseClient)await supabaseClient.auth.signOut();currentUser=null;updateSession();notify("Sesión cerrada")}
function updateSession(){sessionBtn.textContent=currentUser?"Cerrar sesión":"Iniciar sesión";adminLink.style.display=currentUser?.profileRole==="ADMIN"?"inline":"none"}
async function completeSale(){
    if(!cart.length)return notify("Agrega productos primero","error");if(!currentUser)return openAuth("login");
    const items=cart.map(i=>({quantity:i.quantity,product:productRepo.all().find(p=>p.id===i.id)}));if(items.some(i=>!i.product||i.quantity>i.product.stock))return notify("Revisa el stock del carrito","error");
    const sale=new P.SaleTemplate().process({client:currentUser.email,receipt:"BOLETA",strategy:new P.PricingStrategy(),items});
    items.forEach(i=>{i.product.stock-=i.quantity;productRepo.save(i.product)});cart=[];saveCart();renderCart();renderProducts();drawer.classList.remove("open");notify(P.ReceiptFactory.create("BOLETA",sale)+" generada","success");
}
function observeReveals(){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.08});$$(".reveal").forEach(x=>io.observe(x))}

$$("[data-filter]").forEach(a=>a.onclick=e=>{e.preventDefault();setFilter(a.dataset.filter)});
$$("[data-auth-mode]").forEach(b=>b.onclick=()=>setAuthMode(b.dataset.authMode));
cartBtn.onclick=()=>drawer.classList.add("open");$(".drawer .close").onclick=()=>drawer.classList.remove("open");checkout.onclick=completeSale;shopLogin.onsubmit=submitAuth;
sessionBtn.onclick=()=>currentUser?logoutShop():openAuth("login");closeLogin.onclick=()=>loginModal.close();
renderProducts();renderCart();setAuthMode("login");loadSession();
