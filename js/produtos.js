/* ===== CATEGORIAS (img: URL da foto; sem foto aparece o emoji) ===== */
const CATS=[
 {n:"Tradicionais",e:"🍔",s:"Os clássicos da casa",img:null},
 {n:"Artesanais",e:"🥩",s:"Hambúrguer artesanal",img:null},
 {n:"Combos",e:"🍟",s:"Lanche, batata e bebida",img:null},
 {n:"Porções e salgados",e:"🍟",s:"Batata frita e salgados",img:null},
 {n:"Bebidas",e:"🥤",s:"Refris e água",img:null},
 {n:"Sucos e vitaminas",e:"🍹",s:"Sabores da fruta",img:null},
 {n:"Sobremesas",e:"🍰",s:"Nega maluca",img:null}
];

/* ===== PRODUTOS ===== */
const REM=[]; // sem lista de remover: o cliente escreve nas observações do item
const SABORES=["Morango","Uva","Graviola","Cajá","Acerola","Manga","Maracujá","Goiaba","Mangaba"];
const P=(id,nome,preco,cat,desc="",x={})=>({id,nome,preco,cat,desc,remover:[],adicionais:[],escolha:null,...x});
const B=(id,n,p,c,d)=>P(id,n,p,c,d,{remover:REM});
const PRODUTOS=[
 B("torrada","Torrada",7,"Tradicionais","Pão, presunto, queijo e salada"),
 B("simples","Hambúrguer Simples",12,"Tradicionais","Pão, hambúrguer, presunto, queijo e salada"),
 B("xburg","X-Burg",14,"Tradicionais","Pão, hambúrguer, ovo, presunto, queijo e salada"),
 B("xbacon","X-Bacon",15,"Tradicionais","Pão, hambúrguer, ovo, bacon, presunto, queijo e salada"),
 B("xtudo","X-Tudo",20,"Tradicionais","Pão, hambúrguer, ovo, bacon, frango, calabresa, presunto, queijo e salada"),
 B("monstrao","Super Monstrão",35,"Tradicionais","Dois pães, três hambúrgueres, três ovos, cebola, três presunto, queijos e salada"),
 B("xpicanha","X-Picanha",18,"Tradicionais","Pão, hambúrguer de picanha, cebola, ovo, catupiry, presunto, queijo e salada"),
 B("sertanejo","Sertanejo",18,"Tradicionais","Pão, hambúrguer de picanha, cebola, ovo, catupiry, presunto, queijo, queijo de coalho e salada"),
 B("xcalabresa","X-Calabresa",18,"Tradicionais","Pão, hambúrguer, calabresa, cebola, presunto, queijo e salada"),
 B("xfrango","X-Frango",18,"Tradicionais","Pão, hambúrguer, frango, catupiry, presunto, queijo e salada"),
 B("gigantao","Gigantão",26,"Tradicionais","Pão, dois hambúrguer, dois ovos, cebola, dois presunto, dois queijos e salada"),
 B("amonstrao","Super Monstrão Artesanal",40,"Artesanais","Dois pães, três hambúrgueres artesanais, três ovos, cheddar, cebola e salada"),
 B("aovo","Artesanal com Ovo",25,"Artesanais","Pão, hambúrguer artesanal, ovo, cheddar, cebola e salada"),
 B("asimples","Artesanal Simples",22,"Artesanais","Pão, hambúrguer artesanal, cheddar e salada"),
 B("abacon","Artesanal Bacon",25,"Artesanais","Pão, hambúrguer artesanal, bacon, cheddar, cebola e salada"),
 B("aduplo","Artesanal Duplo",35,"Artesanais","Pão, dois hambúrgueres, dois ovos, cheddar, cebola e salada"),
 P("c-kids","Combo Kids",14.99,"Combos","1 torrada + 1 suco natural",{escolha:{titulo:"Sabor do suco",opcoes:SABORES.concat("Laranja")}}),
 B("c-casa","Combo da Casa",17.99,"Combos","1 X-Burguer + 1 Caçulinha"),
 B("c-xbacon","Combo X-Bacon",27.99,"Combos","1 X-Bacon + 1 Caçulinha + 1 batata frita P"),
 B("c-xfrango","Combo X-Frango",30.99,"Combos","1 X-Frango + 1 Caçulinha + 1 batata frita P"),
 B("c-xtudo","Combo X-Tudo",32.99,"Combos","1 X-Tudo + 1 Caçulinha + 1 batata frita P"),
 B("c-esp","Combo Especial",34.99,"Combos","2 X-Burguer + 2 Caçulinha"),
 B("c-gig","Combo Gigantão",41.99,"Combos","1 Gigantão + 1 refrigerante lata + 1 batata frita P"),
 B("c-triplo","Combo Triplo Burguer",49.99,"Combos","3 X-Burguer + 1 refrigerante 600 ml"),
 B("c-monstro","Combo Monstro",49.99,"Combos","1 Super Monstrão + 1 refrigerante lata + 1 batata frita P"),
 B("c-fam","Combo Família",64.99,"Combos","4 X-Burguer + 1 refrigerante de 1 litro"),
 P("bp","Batata Frita P",15,"Porções e salgados"),
 P("bm","Batata Frita M",20,"Porções e salgados"),
 P("bg","Batata Frita G",25,"Porções e salgados"),
 P("bs","Batata Frita Suprema",28,"Porções e salgados"),
 P("salgado","Salgado",4,"Porções e salgados","Preço por unidade"),
 P("agua","Água mineral",3,"Bebidas"),
 P("lata","Refrigerante lata",7,"Bebidas"),
 P("r600","Refrigerante 600 ml",9,"Bebidas"),
 P("r1l","Refrigerante 1 litro",11,"Bebidas"),
 P("casulinha","Caçulinha",4,"Bebidas"),
 P("suco","Suco ou vitamina",7,"Sucos e vitaminas","Escolha o sabor",{escolha:{titulo:"Sabor",opcoes:SABORES}}),
 P("laranja","Suco de laranja",8,"Sucos e vitaminas"),
 P("nega","Nega Maluca (fatia)",10,"Sobremesas","Sabor chocolate")
];


/* ===== FOTOS (id do produto -> arquivo em img/) ===== */
const FOTOS={
 torrada:"img/torrada.jpg", xbacon:"img/x-bacon.jpg", monstrao:"img/super-monstrao.jpg", gigantao:"img/gigantao.jpg", aovo:"img/artesanal-com-ovo.jpg",
 simples:"img/hamburguer-simples.jpg", xburg:"img/x-burguer.jpg", xtudo:"img/x-tudo.jpg", xpicanha:"img/x-picanha.jpg", sertanejo:"img/sertanejo.jpg",
 xcalabresa:"img/x-calabresa.jpg", xfrango:"img/x-frango.jpg",
 amonstrao:"img/artesanal-monstrao.jpg", asimples:"img/artesanal-simples.jpg", abacon:"img/artesanal-bacon.jpg", aduplo:"img/artesanal-duplo.jpg",
 bp:"img/batata-frita.jpg", bm:"img/batata-frita.jpg", bg:"img/batata-frita.jpg",
 salgado:"img/salgados.jpg", nega:"img/nega-maluca.jpg"
};
PRODUTOS.forEach(p=>{if(FOTOS[p.id])p.img=FOTOS[p.id]});
