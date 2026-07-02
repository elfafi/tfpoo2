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
        {id:301,name:"Brasil Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Amarillo / Verde",size:"M",price:429.9,stock:12,image:"images/products/world-cup-brazil.png",sku:"BRASIL-HOME-26",detail:"Camiseta Nike de seleccion para el mundial. Pais: Brasil."},
        {id:302,name:"Francia Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Azul marino",size:"M",price:429.9,stock:10,image:"images/products/world-cup-france.png",sku:"FRANCIA-HOME-26",detail:"Camiseta Nike de seleccion para el mundial. Pais: Francia."},
        {id:303,name:"Estados Unidos Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Blanco / Rojo",size:"M",price:429.9,stock:9,image:"images/products/world-cup-usa.png",sku:"USA-HOME-26",detail:"Camiseta Nike de seleccion para el mundial. Pais: Estados Unidos."},
        {id:304,name:"Uruguay Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Celeste",size:"M",price:429.9,stock:8,image:"images/products/world-cup-uruguay.png",sku:"URUGUAY-HOME-26",detail:"Camiseta Nike de seleccion para el mundial. Pais: Uruguay."},
        {id:305,name:"Paises Bajos Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Naranja",size:"M",price:429.9,stock:7,image:"images/products/world-cup-netherlands.png",sku:"NED-HOME-26",detail:"Camiseta Nike de seleccion para el mundial. Pais: Paises Bajos."},
        {id:306,name:"Inglaterra Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Blanco / Azul",size:"M",price:429.9,stock:6,image:"images/products/world-cup-england.png",sku:"ENG-HOME-26",detail:"Camiseta Nike de seleccion para el mundial. Pais: Inglaterra."},
        {id:307,name:"Brasil 2024 Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Amarillo / Verde",size:"M",price:429.9,stock:11,image:"images/products/brazil-2024-home.png",sku:"BRASIL-2024-HOME",detail:"Camiseta Nike Dri-FIT de seleccion. Pais: Brasil."},
        {id:308,name:"Francia 2025 Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Azul / Rojo",size:"M",price:429.9,stock:10,image:"images/products/france-2025-home.png",sku:"FRANCIA-2025-HOME",detail:"Camiseta Nike Dri-FIT de seleccion. Pais: Francia."},
        {id:309,name:"Inglaterra 2026 Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Blanco",size:"M",price:429.9,stock:8,image:"images/products/england-2026-home.jpg",sku:"INGLATERRA-2026-HOME",detail:"Camiseta Nike Dri-FIT de seleccion para el mundial. Pais: Inglaterra."},
        {id:310,name:"Paises Bajos 2024 Stadium Local",category:"Camisetas",audience:"Hombre",line:"Novedades",color:"Naranja",size:"M",price:429.9,stock:9,image:"images/products/netherlands-2024-home.jpg",sku:"NED-2024-HOME",detail:"Camiseta Nike Dri-FIT de seleccion. Pais: Paises Bajos."},
        {id:311,name:"Nike Vomero Premium",category:"Zapatillas",audience:"Hombre",line:"Zapatillas",color:"White/Total Orange/Laser Orange/Lapis",size:"42",price:862.5,stock:6,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/71dec6df-2d2e-480c-b9ab-528b49fb4291/NIKE+VOMERO+PREMIUM.png",sku:"HQ2050-101",detail:"Men's Road Running Shoes. Producto Nike oficial de la linea Zapatillas."},
        {id:312,name:"Nike Vomero Premium",category:"Zapatillas",audience:"Mujer",line:"Zapatillas",color:"Summit White/Sail/Coconut Milk/Metallic Silver",size:"38",price:862.5,stock:7,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/4bdcb1ce-11ce-4e12-8b77-f294069f0156/W+NIKE+VOMERO+PREMIUM+ESS.png",sku:"IQ8102-101",detail:"Women's Road Running Shoes. Producto Nike oficial de la linea Zapatillas."},
        {id:313,name:"Nike Pegasus 42",category:"Zapatillas",audience:"Hombre",line:"Zapatillas",color:"White/Lapis/Total Orange/Metallic Silver",size:"42",price:543.8,stock:8,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/690f0153-ba61-49a7-b6f0-97773df09a1c/AIR+ZOOM+PEGASUS+42.png",sku:"IB1873-102",detail:"Men's Road Running Shoes. Producto Nike oficial de la linea Zapatillas."},
        {id:314,name:"Nike Pegasus 42",category:"Zapatillas",audience:"Mujer",line:"Zapatillas",color:"Bleached Lilac/Mystic Dates/Pink Smoke/Pink Rise",size:"38",price:543.8,stock:9,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/daaece85-6b16-487b-b03f-2484d8fe7d93/W+NIKE+AIR+ZOOM+PEGASUS+42.png",sku:"IB1881-501",detail:"Women's Road Running Shoes. Producto Nike oficial de la linea Zapatillas."},
        {id:315,name:"Nike Pegasus Premium",category:"Zapatillas",audience:"Hombre",line:"Zapatillas",color:"Thunder Blue/Obsidian/Black/Ashen Slate",size:"42",price:825,stock:10,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/712786b6-7cef-41fe-9aa2-4e50c018dca5/NIKE+PEGASUS+PREMIUM.png",sku:"HQ2592-405",detail:"Men's Road Running Shoes. Producto Nike oficial de la linea Zapatillas."},
        {id:316,name:"Nike Pegasus Premium",category:"Zapatillas",audience:"Mujer",line:"Zapatillas",color:"Summit White/Pure Platinum/Pencil Point/White",size:"38",price:581.1,stock:11,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/b3d93198-e6b1-44c9-bde5-b285dbed6622/W+NIKE+PEGASUS+PREMIUM+ESS.png",sku:"IO9918-100",detail:"Women's Road Running Shoes. Producto Nike oficial de la linea Zapatillas."},
        {id:317,name:"Nike Vomero Plus",category:"Zapatillas",audience:"Hombre",line:"Zapatillas",color:"Off White/Grey Fog/Thunderstorm/Obsidian",size:"42",price:675,stock:12,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/8290fae9-d9e0-476f-b06c-4255c829bfee/NIKE+VOMERO+PLUS.png",sku:"HV8150-111",detail:"Men's Road Running Shoes. Producto Nike oficial de la linea Zapatillas."},
        {id:318,name:"Nike Vomero Plus",category:"Zapatillas",audience:"Mujer",line:"Zapatillas",color:"Bleached Lilac/Pink Rise/Pink Foam/Light Magenta",size:"38",price:675,stock:13,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/e1d2370b-767f-4ab6-9f35-15b0ff2dfeb9/W+NIKE+VOMERO+PLUS.png",sku:"HV8154-504",detail:"Women's Road Running Shoes. Producto Nike oficial de la linea Zapatillas."},
        {id:319,name:"Nike Vomero 18",category:"Zapatillas",audience:"Hombre",line:"Zapatillas",color:"Grey Fog/Off White/Work Blue/Dark Obsidian",size:"42",price:581.3,stock:14,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/e9279c96-ce57-49b8-a737-8aacf2b5dc78/NIKE+VOMERO+18.png",sku:"HM6803-015",detail:"Men's Road Running Shoes. Producto Nike oficial de la linea Zapatillas."},
        {id:320,name:"Nike Vomero 18",category:"Zapatillas",audience:"Mujer",line:"Zapatillas",color:"Bleached Lilac/Light Magenta/Pink Rise/Pink Smoke",size:"38",price:581.3,stock:15,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/82777093-3c9b-4719-ba86-9eb1e6160962/W+NIKE+VOMERO+18.png",sku:"HM6804-500",detail:"Women's Road Running Shoes. Producto Nike oficial de la linea Zapatillas."},
        {id:321,name:"Nike Windrunner",category:"Ropa",audience:"Hombre",line:"Ropa",color:"Summit White/Blue Void/Light Crimson",size:"M",price:393.8,stock:6,image:"https://static.nike.com/a/images/t_default/dc5eecec-d750-43fc-bb60-0a72ba9f8006/M+NK+WR+LTWT+HZ+JKT.png",sku:"IF3390-121",detail:"Men's Lightweight Half-Zip Jacket. Producto Nike oficial de la linea Ropa."},
        {id:322,name:"Nike Windrunner",category:"Ropa",audience:"Hombre",line:"Ropa",color:"Blue Void/Summit White/Light Crimson",size:"M",price:206.3,stock:7,image:"https://static.nike.com/a/images/t_default/49056596-90e0-4443-86e2-72dddc9e57cb/M+NK+WR+WVN+LTWT+SHORT.png",sku:"IF3398-492",detail:"Men's Lightweight Woven Shorts. Producto Nike oficial de la linea Ropa."},
        {id:323,name:"Nike Club",category:"Ropa",audience:"Hombre",line:"Ropa",color:"Old Royal/Old Royal/White",size:"M",price:262.5,stock:8,image:"https://static.nike.com/a/images/t_default/2b1a348f-2af4-4d9c-bd16-7d364f9779c2/M+NK+CLUB+BB+PO+HOODIE.png",sku:"FN3859-417",detail:"Men's Pullover Fleece Hoodie. Producto Nike oficial de la linea Ropa."},
        {id:324,name:"Nike Sportswear Club",category:"Ropa",audience:"Hombre",line:"Ropa",color:"Dark Grey Heather/Light Smoke Grey/White",size:"M",price:281.3,stock:9,image:"https://static.nike.com/a/images/t_default/d2520a86-966b-4592-bb1a-88a4c332d795/M+NK+CLUB+FT+OH+PANT+PLAY.png",sku:"IM5542-063",detail:"Men's Open-Hem French Terry Pants. Producto Nike oficial de la linea Ropa."},
        {id:325,name:"Nike Air",category:"Ropa",audience:"Hombre",line:"Ropa",color:"Cucumber Calm/Black/Black",size:"M",price:318.8,stock:10,image:"https://static.nike.com/a/images/t_default/e0b2d550-1dfd-4fda-9f7d-c502679d4f0f/M+NK+AIR+PO+HDY.png",sku:"IF1266-391",detail:"Men's Fleece Pullover Hoodie. Producto Nike oficial de la linea Ropa."},
        {id:326,name:"Nike Studio Fleece Medium Weight",category:"Ropa",audience:"Mujer",line:"Ropa",color:"Pink Rise/Sail",size:"S",price:300,stock:11,image:"https://static.nike.com/a/images/t_default/de937733-e20f-4f1d-81fd-7b049598cb80/W+NK+STDO+FLC+MW+OS+CRP+FZ+HDY.png",sku:"IM8499-621",detail:"Women's Oversized Full-Zip Cropped Hoodie. Producto Nike oficial de la linea Ropa."},
        {id:327,name:"Nike Studio Fleece Lightweight",category:"Ropa",audience:"Mujer",line:"Ropa",color:"Pink Rise/Sail",size:"S",price:187.5,stock:12,image:"https://static.nike.com/a/images/t_default/db023cd6-2073-4e50-89d5-9c5f768245e4/W+NK+STDO+FLC+LW+MR+STD+4+SHRT.png",sku:"IM8508-621",detail:"Women's Mid-Rise Shorts. Producto Nike oficial de la linea Ropa."},
        {id:328,name:"Nike Studio Fleece Medium Weight",category:"Ropa",audience:"Mujer",line:"Ropa",color:"Pink Rise/Pink Smoke/Sail",size:"S",price:318.8,stock:13,image:"https://static.nike.com/a/images/t_default/1462ca3c-7f94-4dd1-812b-b83267ace258/W+NK+STDO+FLC+MW+SP+TRK+JKT.png",sku:"IO2300-621",detail:"Women's Track Jacket. Producto Nike oficial de la linea Ropa."},
        {id:329,name:"Nike Studio Fleece Lightweight",category:"Ropa",audience:"Mujer",line:"Ropa",color:"Pink Rise/Sail",size:"S",price:281.3,stock:14,image:"https://static.nike.com/a/images/t_default/bb193fa5-ddf0-49bd-b232-ba9a0cf8ec44/W+NK+STDO+FLC+LW+HR+OS+CFF+PNT.png",sku:"IM8511-621",detail:"Women's Oversized High-Rise Cuffed Pants. Producto Nike oficial de la linea Ropa."},
        {id:330,name:"Nike Studio Fleece Lightweight",category:"Ropa",audience:"Mujer",line:"Ropa",color:"Pink Smoke/Sail",size:"S",price:300,stock:15,image:"https://static.nike.com/a/images/t_default/ffd95694-9904-48f3-9e84-a8527482ab19/W+NK+STDO+FLC+LW+OS+FZ+HDY.png",sku:"IM8108-654",detail:"Women's Oversized Full-Zip Hoodie. Producto Nike oficial de la linea Ropa."},
        {id:331,name:"Jordan Son of Mars Low",category:"Zapatillas",audience:"Hombre",line:"Jordan",color:"White/Varsity Red/Light Smoke Grey/True Blue",size:"42",price:618.8,stock:6,image:"https://static.nike.com/a/images/t_default/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/29ebb8c3-9694-43ad-8780-f0933b568a64/JORDAN+SON+OF+MARS+LOW.png",sku:"580603-102",detail:"Men's Shoe. Producto Nike oficial de la linea Jordan."},
        {id:332,name:"Jordan Trunner Flow",category:"Zapatillas",audience:"Hombre",line:"Jordan",color:"White/Gym Red/Metallic Silver/Black",size:"42",price:318.8,stock:7,image:"https://static.nike.com/a/images/t_default/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5cb91c76-92a9-4962-9d20-17503483d6e5/JORDAN+TRUNNER+FLOW.png",sku:"IO2091-101",detail:"Men's Shoes. Producto Nike oficial de la linea Jordan."},
        {id:333,name:"Jordan Brooklyn",category:"Ropa",audience:"Hombre",line:"Jordan",color:"Sail/True Blue/University Red",size:"M",price:281.3,stock:8,image:"https://static.nike.com/a/images/t_default/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/10efd440-f4f8-45d6-a0f8-d16eec895d68/M+J+BRK+CB+ST+FLC+PO.png",sku:"IM8975-134",detail:"Men's Pullover Hoodie. Producto Nike oficial de la linea Jordan."},
        {id:334,name:"Jordan Brooklyn",category:"Ropa",audience:"Hombre",line:"Jordan",color:"True Blue/University Red",size:"M",price:262.5,stock:9,image:"https://static.nike.com/a/images/t_default/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/bffa5abb-18db-4b5a-89f6-cb870e54e70c/M+J+BRK+ST+FLC+CUFF+PANT+BB.png",sku:"IM8906-485",detail:"Men's Pants. Producto Nike oficial de la linea Jordan."},
        {id:335,name:"Jordan Sixty Plus Low",category:"Zapatillas",audience:"Hombre",line:"Jordan",color:"White/True Blue/Varsity Red",size:"42",price:600,stock:10,image:"https://static.nike.com/a/images/t_default/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9b33e38f-7970-4f82-b78c-34ec5d1b9680/JORDAN+SIXTY+PLUS+LOW.png",sku:"IH2047-102",detail:"Men's Shoes. Producto Nike oficial de la linea Jordan."},
        {id:336,name:"Jordan Trunner O/S",category:"Zapatillas",audience:"Mujer",line:"Jordan",color:"Blue Beyond/True Blue/Soft Pearl",size:"38",price:431.3,stock:11,image:"https://static.nike.com/a/images/t_default/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/d486e014-edd0-4051-b78e-2e831bf1a6c2/WMNS+JORDAN+TRUNNER+O%2FS.png",sku:"IR1839-400",detail:"Women's Shoes. Producto Nike oficial de la linea Jordan."},
        {id:337,name:"Jordan",category:"Ropa",audience:"Mujer",line:"Jordan",color:"Blue Beyond",size:"S",price:150,stock:12,image:"https://static.nike.com/a/images/t_default/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/bcecab29-7757-4274-94aa-62ab21e03fb6/W+J+SS+GF+GFX+TEE+VAR.png",sku:"IM7151-489",detail:"Women's Girlfriend T-Shirt. Producto Nike oficial de la linea Jordan."},
        {id:338,name:"Jordan Brooklyn",category:"Ropa",audience:"Mujer",line:"Jordan",color:"Black",size:"S",price:262.5,stock:13,image:"https://static.nike.com/a/images/t_default/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/3dc8eb20-262e-4d51-8b74-bfab53a3dc00/W+J+BRK+WVN+BIG+SHORT.png",sku:"IM6957-010",detail:"Women's Woven Big Shorts. Producto Nike oficial de la linea Jordan."},
        {id:339,name:"Jordan Triangle",category:"Zapatillas",audience:"Hombre",line:"Jordan",color:"Hyper Punch/Medium Soft Pink/Regal Pink/Black",size:"42",price:543.8,stock:14,image:"https://static.nike.com/a/images/t_default/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/3dd68493-aee1-415c-9ef6-fa6897a42b9a/JORDAN+TRIANGLE.png",sku:"IB1154-600",detail:"Basketball Shoes. Producto Nike oficial de la linea Jordan."},
        {id:340,name:"Luka 5",category:"Zapatillas",audience:"Hombre",line:"Jordan",color:"Laser Fuchsia/Black/Bleached Turquoise/Fiberglass",size:"42",price:506.3,stock:15,image:"https://static.nike.com/a/images/t_default/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/4786bf0a-a510-4bad-a0e6-515ddb41448c/JORDAN+LUKA+5.png",sku:"HV8082-600",detail:"Basketball Shoes. Producto Nike oficial de la linea Jordan."},
        {id:341,name:"USMNT",category:"Ropa",audience:"Hombre",line:"Futbol",color:"White",size:"M",price:168.8,stock:6,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9c7cc2d6-f7ee-4423-b356-300ca2d0b906/USA+M+NK+TEE+JUST+DOGS+QS.png",sku:"JU0234-100",detail:"Men's Nike Soccer T-Shirt. Producto Nike oficial de la linea Futbol."},
        {id:342,name:"USA x V.A.A.",category:"Ropa",audience:"Hombre",line:"Futbol",color:"White/Deep Royal Blue/Deep Royal Blue",size:"M",price:270,stock:7,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/09e90fd1-22d0-44ad-8f14-9894d5e4a795/USX+M+NK+DF+ACDPR+X2+SS+PM+TOP.png",sku:"IH1696-100",detail:"Men's Academy Pro Short-Sleeve Soccer Top. Producto Nike oficial de la linea Futbol."},
        {id:343,name:"Nike Mercurial Vapor 17 Elite",category:"Chimpunes",audience:"Hombre",line:"Futbol",color:"Multi-Color/Black",size:"42",price:1050,stock:8,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/93450bab-cca5-4148-8ce7-6c3b871b0aec/VAPOR+17+ELITE+FG+T.png",sku:"IO1560-900",detail:"Firm-Ground Low-Top Soccer Cleats. Producto Nike oficial de la linea Futbol."},
        {id:344,name:"Nike Mercurial Superfly 11 Elite",category:"Chimpunes",audience:"Hombre",line:"Futbol",color:"Multi-Color/Black",size:"42",price:1181.3,stock:9,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/abbc0f29-e8f4-4275-9a80-5a8ca70b8d4c/ZM+SUPERFLY+11+ELITE+FG+T.png",sku:"IO8219-900",detail:"Firm-Ground Low-Top Soccer Cleats. Producto Nike oficial de la linea Futbol."},
        {id:345,name:"Nike Phantom 6 Low Elite",category:"Chimpunes",audience:"Hombre",line:"Futbol",color:"Multi-Color/Black",size:"42",price:975,stock:10,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/aeaa04e6-86ee-4539-9d21-421cdd364d2f/PHANTOM+6+LOW+ELITE+FG+T.png",sku:"IH1778-900",detail:"Firm-Ground Soccer Cleats. Producto Nike oficial de la linea Futbol."},
        {id:346,name:"Nike Phantom 6 High Elite",category:"Chimpunes",audience:"Hombre",line:"Futbol",color:"Multi-Color/Black",size:"42",price:1068.8,stock:11,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/997638b7-170b-4072-97d2-1294d2117fac/PHANTOM+6+HIGH+ELITE+FG+T.png",sku:"IH1779-900",detail:"Firm-Ground Soccer Cleats. Producto Nike oficial de la linea Futbol."},
        {id:347,name:"Nike Tiempo Maestro Elite",category:"Chimpunes",audience:"Hombre",line:"Futbol",color:"Multi-Color/Black",size:"42",price:975,stock:12,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/61990682-fb3a-43d3-983b-a46ec163876e/TIEMPO+MAESTRO+ELITE+FG+T.png",sku:"IH1776-901",detail:"Firm-Ground Low-Top Soccer Cleats. Producto Nike oficial de la linea Futbol."},
        {id:348,name:"USMNT 2026 Home",category:"Ropa",audience:"Hombre",line:"Futbol",color:"Sail",size:"M",price:243.8,stock:13,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/09ea28c5-671e-4629-9dec-5435000e48f1/USA+MNK+DF+JSY+SS+FTBL+TP+HM.png",sku:"JU1495-133",detail:"Men's Nike Soccer Short-Sleeve Top. Producto Nike oficial de la linea Futbol."},
        {id:349,name:"Nike Mercurial Vapor 17 Elite",category:"Chimpunes",audience:"Hombre",line:"Futbol",color:"Multi-Color/Black",size:"42",price:1012.5,stock:14,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/59da48a9-da34-45bd-b79e-e40e60c76b04/VAPOR+17+ELITE+AG-PRO+T.png",sku:"IM5806-900",detail:"Artificial-Grass Low-Top Soccer Cleats. Producto Nike oficial de la linea Futbol."},
        {id:350,name:"Nike Mercurial Superfly 11 Elite",category:"Chimpunes",audience:"Hombre",line:"Futbol",color:"Multi-Color/Black",size:"42",price:1181.3,stock:15,image:"https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9b1cf756-1947-4153-a20e-9ce4c6102a8b/ZM+SUPERFLY+11+ELITE+AG-PRO+T.png",sku:"IO8221-900",detail:"Artificial-Grass Low-Top Soccer Cleats. Producto Nike oficial de la linea Futbol."}
    ]}
    migrateCatalog(){if(this.data.catalogVersion===9)return;this.data.products=this.catalog();this.data.catalogVersion=9;this.save();}
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
    pay(context){const total=context.strategy.apply(context.items.reduce((a,i)=>a+i.product.price*i.quantity,0));return{id:Date.now(),client:context.client,total,status:new SaleState("PAGADA").name,date:new Date().toISOString(),receipt:context.receipt,items:context.items.map(i=>({productId:i.product.id,productName:i.product.name,quantity:i.quantity,price:i.product.price}))};}
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
