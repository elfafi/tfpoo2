/* Biblioteca de patrones del negocio. Persistencia estatica para GitHub Pages. */
class DatabaseSingleton {
    static instance;
    constructor() {
        if (DatabaseSingleton.instance) return DatabaseSingleton.instance;
        this.key = "nike_business_data";
        this.data = JSON.parse(localStorage.getItem(this.key) || "null") || this.seed();
        this.migrateCatalog();
        DatabaseSingleton.instance = this;
    }
    seed() {
        const data = {
            users: [{id:1,name:"Fabian",username:"fabian",role:"ADMIN"}],
            clients: [{id:1,name:"Alex Runner",email:"alex@nike.demo",phone:"999 111 222"}],
            suppliers: [{id:1,name:"Nike Distribution LATAM",contact:"supply@nike.demo",channel:"Directo"}],
            products: this.catalog(),
            sales: [{id:90,client:"Alex Runner",total:789.9,status:"PAGADA",date:new Date().toISOString(),receipt:"BOLETA"}]
        };
        localStorage.setItem(this.key, JSON.stringify(data)); return data;
    }
    catalog(){return[
        {id:201,name:"Brasil Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Amarillo / Verde",size:"M",price:429.9,stock:12,image:"images/products/world-cup-brazil.png"},
        {id:202,name:"Francia Stadium Local",category:"Camisetas",audience:"Mujer",line:"Novedades",color:"Azul marino",size:"S",price:429.9,stock:8,image:"images/products/world-cup-france.png"},
        {id:203,name:"Estados Unidos Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Blanco / Rojo",size:"L",price:429.9,stock:6,image:"images/products/world-cup-usa.png"},
        {id:204,name:"Uruguay Stadium Local",category:"Camisetas",audience:"Mujer",line:"Novedades",color:"Celeste",size:"M",price:429.9,stock:7,image:"images/products/world-cup-uruguay.png"},
        {id:211,name:"Países Bajos Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Naranja",size:"M",price:429.9,stock:4,image:"images/products/world-cup-netherlands.png"},
        {id:212,name:"Inglaterra Stadium Local",category:"Camisetas",audience:"Mujer",line:"Novedades",color:"Blanco",size:"S",price:429.9,stock:0,image:"images/products/world-cup-england.png"},
        {id:205,name:"Nike Air Force 1 '07 LV8",category:"Zapatillas",audience:"Hombre",line:"Zapatillas",color:"Negro / Blanco",size:"42",price:599.9,stock:14,image:"images/products/nike-air-force-1-07-lv8.jpg",sku:"IB6388-001",officialUrl:"https://www.nike.com.pe/nike-air-force1-07-lv8-zapatillas-para-hombre/ib6388-001/11020128021.html",detail:"Zapatillas para hombre con cuero duradero, cuello acolchado y suela cupsole clasica."},
        {id:206,name:"Nike Air Force 1 '07 LV8 Cream",category:"Zapatillas",audience:"Mujer",line:"Zapatillas",color:"Crema",size:"38",price:599.9,stock:5,image:"images/products/nike-air-force-1-07-lv8-cream.jpg"},
        {id:207,name:"Nike SB Dunk Low Pro",category:"Zapatillas",audience:"Hombre",line:"Zapatillas",color:"Amarillo / Negro",size:"42",price:549.9,stock:10,image:"images/products/nike-sb-dunk-low-pro.jpg",sku:"IB6206-701",officialUrl:"https://www.nike.com.pe/nike-sb-dunk-low-pro-zapatilla-de-skateboarding/ib6206-701/11085147014.html",detail:"Zapatilla de skateboarding con unidad Zoom Air en el talon y suela de goma adherente."},
        {id:208,name:"Nike SB Dunk Low Pro Red",category:"Zapatillas",audience:"Mujer",line:"Zapatillas",color:"Rojo / Blanco",size:"39",price:549.9,stock:3,image:"images/products/nike-sb-dunk-low-pro-red.jpg"},
        {id:209,name:"Nike Dunk Low Retro",category:"Zapatillas",audience:"Hombre",line:"Zapatillas",color:"Blanco / Azul",size:"43",price:549.9,stock:9,image:"images/products/nike-dunk-low-retro.jpg",sku:"HF5441-107",officialUrl:"https://www.nike.com.pe/nike-dunk-low-retro-zapatillas-para-hombre/hf5441-107/10991116021.html",detail:"Zapatillas para hombre con look retro de basket, cuello acolchado y traccion circular."},
        {id:210,name:"Nike Air Max 95 Big Bubble SE",category:"Zapatillas",audience:"Mujer",line:"Zapatillas",color:"Multicolor",size:"39",price:799.9,stock:2,image:"images/products/nike-air-max-95-big-bubble.jpg"},
        {id:213,name:"Nike Pegasus Premium",category:"Zapatillas",audience:"Hombre",line:"Zapatillas",color:"Blanco / Negro",size:"42",price:899.9,stock:6,image:"images/products/pegasus-premium.webp",detail:"Running premium con espuma reactiva y transicion suave para entrenamientos diarios."},
        {id:214,name:"Nike Motiva",category:"Zapatillas",audience:"Mujer",line:"Zapatillas",color:"Blanco / Plata",size:"38",price:449.9,stock:8,image:"images/products/nike-motiva.png",detail:"Disenada para caminar con comodidad: base ancha, balanceo suave y gran amortiguacion."},
        {id:215,name:"Nike Mercurial Superfly",category:"Chimpunes",audience:"Hombre",line:"Futbol",color:"Azul / Rosa",size:"42",price:699.9,stock:5,image:"images/products/mercurial-superfly.jpg",detail:"Chimpunes de futbol con ajuste tipo calcetin y traccion agresiva para velocidad."},
        {id:216,name:"Nike Flight",category:"Pelotas",audience:"Hombre",line:"Futbol",color:"Blanco / Negro",size:"5",price:599.9,stock:11,image:"images/products/nike-flight.png",detail:"Balon de futbol de alto rendimiento con tecnologia Aerowsculpt para vuelo estable."},
        {id:217,name:"Nike Premier League Academy",category:"Pelotas",audience:"Hombre",line:"Futbol",color:"Blanco / Morado",size:"5",price:179.9,stock:15,image:"images/products/premier-league-ball.jpg",detail:"Balon Academy de la Premier League con ranuras moldeadas y cubierta texturizada."},
        {id:218,name:"Nike Sportswear Phoenix Fleece",category:"Ropa",audience:"Mujer",line:"Ropa",color:"Gris",size:"M",price:329.9,stock:7,image:"images/products/phoenix-fleece.png",detail:"Polera fleece amplia y suave para uso diario, con acabado premium."},
        {id:219,name:"Nike One Classic",category:"Ropa",audience:"Mujer",line:"Ropa",color:"Negro",size:"S",price:149.9,stock:9,image:"images/products/nike-one-classic.png",detail:"Polo de entrenamiento con tecnologia Dri-FIT, tacto suave y ajuste clasico."},
        {id:220,name:"Air Jordan 4 Retro",category:"Zapatillas",audience:"Hombre",line:"Jordan",color:"Blanco / Cemento",size:"42",price:949.9,stock:3,image:"images/products/air-jordan-4.jpg",detail:"Modelo Jordan retro con paneles de malla, soporte lateral y amortiguacion Air."}
    ]}
    migrateCatalog(){if(this.data.catalogVersion===7)return;this.data.products=this.catalog();this.data.catalogVersion=7;this.save();}
    save(){ localStorage.setItem(this.key, JSON.stringify(this.data)); }
}

class Repository {
    constructor(entity){ this.db=new DatabaseSingleton(); this.entity=entity; }
    all(){ return this.db.data[this.entity]; }
    save(item){ item.id=item.id||Date.now(); const i=this.all().findIndex(x=>x.id===item.id); i<0?this.all().push(item):this.all()[i]=item; this.db.save(); return item; }
    delete(id){ this.db.data[this.entity]=this.all().filter(x=>x.id!==id); this.db.save(); }
}

// Acceso: Proxy y Facade.
class AuthProxy { login(user,password){ return user==="fabian"&&password==="ingeniero"; } }
class AuthFacade {
    constructor(){this.proxy=new AuthProxy();}
    login(user,password){if(!this.proxy.login(user,password))return false;sessionStorage.setItem("user","fabian");return true;}
    isAdmin(){return sessionStorage.getItem("user")==="fabian";}
}

// Menu principal: Command, Mediator y Observer.
class MenuCommand { constructor(action){this.action=action;} execute(){return this.action();} }
class MenuMediator {
    constructor(){this.observers=[];} subscribe(fn){this.observers.push(fn);}
    dispatch(command){const result=command.execute();this.observers.forEach(fn=>fn(result));return result;}
}

// Usuarios: Factory Method y Memento.
class UserFactory { create(name,username,role){return{id:Date.now(),name,username,role};} }
class MementoManager { constructor(){this.history=[];} save(value){this.history.push(JSON.stringify(value));} undo(){return JSON.parse(this.history.pop()||"null");} }

// Clientes: Prototype e Iterator.
class ClientPrototype { clone(client,email){return{...client,id:Date.now(),email};} }
class CollectionIterator { constructor(items){this.items=items;this.index=0;} next(){return this.items[this.index++];} hasNext(){return this.index<this.items.length;} }

// Proveedores: Adapter y Bridge.
class SupplierAdapter { fromExternal(x){return{id:Date.now(),name:x.company,contact:x.apiContact,channel:"API externa"};} }
class SupplierBridge { constructor(channel){this.channel=channel;} notify(supplier){return this.channel.send(supplier);} }

// Productos: Builder, Composite, Decorator y Flyweight.
class ProductBuilder {
    constructor(){this.product={id:Date.now()};}
    set(key,value){this.product[key]=value;return this;} build(){return this.product;}
}
class ProductComposite { constructor(){this.parts=[];} add(product){this.parts.push(product);return this;} price(){return this.parts.reduce((a,x)=>a+x.price,0);} }
class DiscountDecorator { constructor(product,discount){this.product=product;this.discount=discount;} price(){return this.product.price*(1-this.discount);} }
class ProductFlyweight { static values=new Map(); static shared(value){if(!this.values.has(value))this.values.set(value,value);return this.values.get(value);} }

// Ventas: Abstract Factory, Strategy, Template Method, State y Chain of Responsibility.
class ReceiptFactory { static create(type,sale){return type==="FACTURA"?`Factura F-${sale.id}`:`Boleta B-${sale.id}`;} }
class PricingStrategy { apply(total){return total;} }
class VipPricingStrategy extends PricingStrategy { apply(total){return total*.9;} }
class SaleState { constructor(name){this.name=name;} }
class SaleValidator {
    setNext(next){this.next=next;return next;} validate(context){this.check(context);if(this.next)this.next.validate(context);}
}
class StockValidator extends SaleValidator { check(c){if(c.items.some(i=>i.quantity>i.product.stock))throw Error("Stock insuficiente");} }
class ClientValidator extends SaleValidator { check(c){if(!c.client)throw Error("Cliente no valido");} }
class SaleTemplate {
    process(context){this.validate(context);const sale=this.pay(context);return this.register(sale);}
    validate(context){const first=new StockValidator();first.setNext(new ClientValidator());first.validate(context);}
    pay(context){const total=context.strategy.apply(context.items.reduce((a,i)=>a+i.product.price*i.quantity,0));return{id:Date.now(),client:context.client,total,status:new SaleState("PAGADA").name,date:new Date().toISOString(),receipt:context.receipt};}
    register(sale){new Repository("sales").save(sale);return sale;}
}

// Reportes: Interpreter, Visitor, Observer y Facade.
class StatusExpression { constructor(status){this.status=status;} interpret(sale){return sale.status===this.status;} }
class ScreenVisitor { visit(sales){return{count:sales.length,total:sales.reduce((a,x)=>a+x.total,0)};} }
class ReportFacade {
    constructor(){this.repo=new Repository("sales");this.observers=[];} subscribe(fn){this.observers.push(fn);}
    generate(expression=new StatusExpression("PAGADA"),visitor=new ScreenVisitor()){const result=visitor.visit(this.repo.all().filter(x=>expression.interpret(x)));this.observers.forEach(fn=>fn(result));return result;}
}

window.NikePatterns={DatabaseSingleton,Repository,AuthFacade,MenuCommand,MenuMediator,UserFactory,MementoManager,ClientPrototype,CollectionIterator,SupplierAdapter,SupplierBridge,ProductBuilder,ProductComposite,DiscountDecorator,ProductFlyweight,ReceiptFactory,PricingStrategy,VipPricingStrategy,SaleTemplate,ReportFacade,StatusExpression,ScreenVisitor};
