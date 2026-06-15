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
        {id:101,name:"Air Max Dn8",category:"Calzado",audience:"Hombre",line:"Novedades",color:"Negro / Rojo",size:"42",price:789.9,stock:18,image:"images/products/air-jordan-1.jpg"},
        {id:102,name:"Pegasus Premium",category:"Running",audience:"Hombre",line:"Novedades",color:"Blanco / Volt",size:"41",price:699.9,stock:4,image:"images/products/pegasus-premium.webp"},
        {id:103,name:"Tech Fleece Windrunner",category:"Ropa",audience:"Hombre",line:"Hombre",color:"Gris",size:"M",price:459.9,stock:13,image:"images/products/phoenix-fleece.png"},
        {id:104,name:"Dri-FIT Academy",category:"Camisetas",audience:"Hombre",line:"Hombre",color:"Negro",size:"L",price:189.9,stock:0,image:"images/products/academy-jersey.jpg"},
        {id:105,name:"Air Jordan 1 Low",category:"Jordan",audience:"Unisex",line:"Jordan",color:"Blanco / Negro",size:"43",price:629.9,stock:10,image:"images/products/air-jordan-1.jpg"},
        {id:106,name:"Nike One Classic",category:"Ropa",audience:"Mujer",line:"Mujer",color:"Rosa",size:"S",price:169.9,stock:15,image:"images/products/nike-one-classic.png"},
        {id:107,name:"Nike Motiva",category:"Calzado",audience:"Mujer",line:"Novedades",color:"Blanco / Lila",size:"38",price:499.9,stock:3,image:"images/products/nike-motiva.png"},
        {id:108,name:"Sportswear Phoenix Fleece",category:"Ropa",audience:"Mujer",line:"Mujer",color:"Crema",size:"M",price:329.9,stock:9,image:"images/products/phoenix-fleece.png"},
        {id:109,name:"Air Jordan 4 Retro",category:"Jordan",audience:"Unisex",line:"Jordan",color:"Blanco / Azul",size:"42",price:899.9,stock:2,image:"images/products/air-jordan-4.jpg"},
        {id:110,name:"Jordan Flight Fleece",category:"Ropa",audience:"Mujer",line:"Jordan",color:"Negro",size:"S",price:369.9,stock:8,image:"images/products/jordan-flight-fleece.png"},
        {id:111,name:"Camiseta Local Perú",category:"Camisetas",audience:"Unisex",line:"Fútbol",color:"Blanco / Rojo",size:"M",price:299.9,stock:12,image:"images/products/peru-jersey.jpg"},
        {id:112,name:"Camiseta Academy Pro",category:"Camisetas",audience:"Hombre",line:"Fútbol",color:"Azul",size:"L",price:219.9,stock:5,image:"images/products/academy-jersey.jpg"},
        {id:113,name:"Mercurial Superfly",category:"Chimpunes",audience:"Unisex",line:"Fútbol",color:"Volt / Negro",size:"42",price:999.9,stock:4,image:"images/products/mercurial-superfly.jpg"},
        {id:114,name:"Phantom GX Academy",category:"Chimpunes",audience:"Unisex",line:"Fútbol",color:"Blanco / Rosa",size:"41",price:449.9,stock:0,image:"images/products/mercurial-superfly.jpg"},
        {id:115,name:"Nike Flight",category:"Pelotas",audience:"Unisex",line:"Fútbol",color:"Blanco / Multicolor",size:"5",price:599.9,stock:7,image:"images/products/nike-flight.png"},
        {id:116,name:"Premier League Academy",category:"Pelotas",audience:"Unisex",line:"Fútbol",color:"Amarillo / Morado",size:"5",price:159.9,stock:3,image:"images/products/premier-league-ball.jpg"}
    ]}
    migrateCatalog(){if(this.data.catalogVersion===4)return;this.data.products=this.catalog();this.data.catalogVersion=4;this.save();}
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
