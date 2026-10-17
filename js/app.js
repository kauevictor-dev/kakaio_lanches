/* ===== UTILITÁRIOS ===== */
const $=s=>document.querySelector(s);
const brl=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}).replace(/\u00a0/g,' ');
const prod=id=>PRODUTOS.find(p=>p.id===id);
const precoAd=(p,n)=>p.adicionais.find(a=>a.nome===n).preco;
const unit=l=>{const p=prod(l.id);return p.preco+l.adicionais.reduce((s,n)=>s+precoAd(p,n),0)};
let cart=[];
try{cart=JSON.parse(localStorage.getItem('cart-kakaio')||'[]').filter(l=>prod(l.id))}catch(e){}
const save=()=>{try{localStorage.setItem('cart-kakaio',JSON.stringify(cart))}catch(e){}};
const subtotal=()=>cart.reduce((s,l)=>s+unit(l)*l.qtd,0);
const tipo=()=>document.querySelector('[name=tipo]:checked').value;
const taxa=()=>tipo()==='Entrega'?CONFIG.taxaEntrega:0;

/* ===== TOPO, STATUS, BOAS-VINDAS ===== */
$('#nome').textContent=CONFIG.nome;$('#end').textContent='📍 '+CONFIG.endereco;
if(CONFIG.logo)['#logo','#logo2'].forEach(s=>{$(s).innerHTML=`<img src="${CONFIG.logo}" alt="${CONFIG.nome}">`});
function status(){
  const d=new Date(),h=CONFIG.horario[d.getDay()];
  if(!h)return'Fechado hoje';
  const mn=x=>{const [a,b]=x.split(':');return +a*60+ +b};
  const m=d.getHours()*60+d.getMinutes();
  if(m<mn(h[0]))return'Fechado agora · abre às '+h[0];
  if(m>=mn(h[1]))return'Fechado agora';
  return'Aberto agora · até '+h[1];
}
{const s=status();$('#stxt').textContent=s;$('#stxt').classList.toggle('on',s.startsWith('Aberto'))}
$('#bvp').textContent=status()+'. Escolha seus lanches, monte o pedido e envie pelo WhatsApp.';
try{if(!sessionStorage.getItem('bv')){$('#bv').showModal();sessionStorage.setItem('bv','1')}}catch(e){$('#bv').showModal()}
const irCardapio=()=>{$('#bv').close();$('#cardapio').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})};
$('#bvok').onclick=irCardapio;$('#ver').onclick=irCardapio;

if(CONFIG.avisoImagens){$('#aviso').textContent=CONFIG.avisoImagens;$('#aviso').hidden=false}
/* ===== CARDÁPIO NA PÁGINA (chips + seções) ===== */
$('#chips').innerHTML=CATS.map((c,i)=>`<a href="#cat-${i}" data-i="${i}">${c.e} ${c.n}</a>`).join('');
$('#grid').innerHTML=CATS.map((c,i)=>`<section class="sec" id="cat-${i}" aria-labelledby="h-${i}"><div class="sh"><h2 id="h-${i}">${c.n}</h2><p>${c.s}</p></div><div class="rows">${PRODUTOS.filter(p=>p.cat===c.n).map(p=>`<button class="item${p.img?' cf':''}" data-id="${p.id}">${p.img?`<img src="${p.img.replace('img/','img/mini/')}" alt="" width="76" height="76" loading="lazy" decoding="async">`:''}<b class="nm">${p.nome}</b><span class="pr">${brl(p.preco)}</span>${p.desc?`<small class="ds">${p.desc}</small>`:''}</button>`).join('')}</div></section>`).join('');
$('#grid').addEventListener('click',e=>{const b=e.target.closest('.item');if(b)abrirProduto(b.dataset.id)});
const chips=[...document.querySelectorAll('#chips a')];
let ativo=null;
const io=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;
  const i=en.target.id.slice(4);if(i===ativo)return;ativo=i;
  chips.forEach(a=>a.classList.toggle('on',a.dataset.i===i));
  const a=chips.find(x=>x.dataset.i===i),box=$('#chips');
  if(a)box.scrollTo({left:a.offsetLeft-(box.clientWidth-a.offsetWidth)/2,behavior:'instant'});
}),{rootMargin:'-150px 0px -65% 0px'});
document.querySelectorAll('.sec').forEach(s=>io.observe(s));

/* ===== PRODUTO ===== */
let cur=null,qtd=1;const pd=$('#pd');
function abrirProduto(id){
  cur=prod(id);qtd=1;const p=cur;
  $('#pdc').innerHTML=`
  ${p.img?`<img class="foto" src="${p.img}" alt="${p.nome}" width="720" height="393"><p class="ilus">Imagem meramente ilustrativa</p>`:''}<div class="hd"><h3>${p.nome}</h3><button class="x" data-close aria-label="Fechar">✕</button></div>
  ${p.desc?`<p class="desc">${p.desc}</p>`:''}
  ${p.escolha?`<fieldset><legend>${p.escolha.titulo}<em>obrigatório</em></legend>${p.escolha.opcoes.map(x=>`<label class="opt"><input type="radio" name="esc" value="${x}"><span>${x}</span></label>`).join('')}</fieldset>`:''}
  ${p.adicionais.length?`<fieldset><legend>Adicionais<em>opcional</em></legend>${p.adicionais.map(a=>`<label class="opt"><input type="checkbox" name="adic" value="${a.nome}"><span>${a.nome}</span><b>+${brl(a.preco)}</b></label>`).join('')}</fieldset>`:''}
  <fieldset><legend>Observações<em>opcional</em></legend><textarea id="pobs" rows="2" maxlength="140" placeholder="Quer tirar ou adicionar algo? Ex.: sem cebola, mais queijo"></textarea></fieldset>
  <div class="foot"><div class="qty"><button data-q="-1" aria-label="Diminuir">−</button><span id="pq">1</span><button data-q="1" aria-label="Aumentar">+</button></div><button class="btn" id="add"></button></div>`;
  atualizar();pd.showModal();
}
const lerSel=()=>({
  escolha:(pd.querySelector('[name=esc]:checked')||{}).value||null,
  remover:[],
  obs:(pd.querySelector('#pobs')||{value:''}).value.trim(),
  adicionais:[...pd.querySelectorAll('[name=adic]:checked')].map(i=>i.value)
});
function atualizar(){
  const s=lerSel(),u=cur.preco+s.adicionais.reduce((t,n)=>t+precoAd(cur,n),0),ok=!cur.escolha||s.escolha;
  $('#pq').textContent=qtd;const b=$('#add');b.disabled=!ok;
  b.textContent=ok?`Adicionar ${brl(u*qtd)}`:`Escolha: ${cur.escolha.titulo.toLowerCase()}`;
}
pd.addEventListener('change',atualizar);
pd.addEventListener('click',e=>{
  if(e.target.dataset.q){qtd=Math.max(1,qtd+ +e.target.dataset.q);atualizar()}
  if(e.target.id==='add'){
    const s=lerSel(),key=JSON.stringify([cur.id,s]),ex=cart.find(l=>l.key===key);
    if(ex)ex.qtd+=qtd;else cart.push({key,id:cur.id,qtd,...s});
    save();renderBarra();pd.close();
  }
});

/* ===== BARRA E CARRINHO ===== */
function renderBarra(){
  const n=cart.reduce((s,l)=>s+l.qtd,0);
  $('#bar').hidden=!n;$('#hQtd').textContent=n?`(${n})`:'';
  $('#barQtd').textContent=`${n} ${n===1?'item':'itens'} | Ver carrinho`;
  $('#barTotal').textContent=brl(subtotal());
}
const cd=$('#cd');
const abrirCarrinho=()=>{renderCarrinho(true);cd.showModal()};
$('#barBtn').onclick=abrirCarrinho;$('#hCart').onclick=abrirCarrinho;
function renderCarrinho(abrindo){
  if(!cart.length&&!abrindo){cd.close();return}
  $('#items').innerHTML=cart.length?cart.map((l,i)=>{const p=prod(l.id);
    const ex=[l.escolha&&p.escolha.titulo+': '+l.escolha,l.obs&&'Obs: '+l.obs,l.adicionais.length&&'+ '+l.adicionais.join(', ')].filter(Boolean).join(' · ');
    return `<div class="li"><div><b>${p.nome}</b>${ex?`<small>${ex}</small>`:''}<small>${brl(unit(l))} cada</small></div>
    <div class="qty"><button data-i="${i}" data-d="-1" aria-label="Diminuir">−</button><span>${l.qtd}</span><button data-i="${i}" data-d="1" aria-label="Aumentar">+</button></div></div>`}).join(''):'<p class="desc">Seu carrinho está vazio.</p>';
  const t=taxa(),sub=subtotal();
  $('#totais').innerHTML=`<div class="linha"><span>Subtotal</span><span>${brl(sub)}</span></div>${t?`<div class="linha"><span>Taxa de entrega</span><span>${brl(t)}</span></div>`:''}<div class="linha total"><span>Total</span><span>${brl(sub+t)}</span></div>`;
}
$('#items').addEventListener('click',e=>{
  const i=e.target.dataset.i;if(i===undefined)return;
  cart[i].qtd+=+e.target.dataset.d;if(cart[i].qtd<1)cart.splice(i,1);
  save();renderBarra();renderCarrinho();
});
$('#retirada').textContent='Retire em: '+CONFIG.endereco;
cd.addEventListener('change',e=>{
  if(e.target.name==='tipo'){const ent=tipo()==='Entrega';$('#entrega').hidden=!ent;$('#retirada').hidden=ent;renderCarrinho(true)}
  if(e.target.name==='pag'){const v=e.target.value;$('#pix').hidden=v!=='Pix';$('#troco').hidden=v!=='Dinheiro'}
});
document.addEventListener('click',e=>{if(e.target.matches('[data-close]'))e.target.closest('dialog').close()});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));

/* ===== MENSAGEM DO WHATSAPP ===== */
const val=id=>$('#'+id).value.trim();
function mensagem(){
  const ent=tipo()==='Entrega',pag=document.querySelector('[name=pag]:checked').value,t=taxa(),L='*━━━━━━━━━━━━━━━*';
  let m=`*Olá, segue abaixo o meu pedido*\n\n`;
  cart.forEach(l=>{const p=prod(l.id);
    m+=`*${l.qtd}x ${p.nome}*\n`;
    if(l.escolha)m+=`   • ${p.escolha.titulo}: ${l.escolha}\n`;
    l.adicionais.forEach(a=>m+=`   • Adicional: ${a} (+${brl(precoAd(p,a))})\n`);
    if(l.obs)m+=`   • Obs: ${l.obs}\n`;
    m+=`   💰 ${brl(unit(l)*l.qtd)}\n\n`});
  m+=`${L}\n`;
  if(ent)m+=`🛵 Taxa de entrega: ${brl(t)}\n`;
  m+=`*TOTAL: ${brl(subtotal()+t)}*\n\n`;
  m+=`*👤 Cliente:* ${val('cli')}\n*📞 Contato:* ${val('tel')}\n`;
  if(ent){let e=`${val('rua')}, ${val('num')} - ${val('bairro')}`;if(val('comp'))e+=`, ${val('comp')}`;if(val('ref'))e+=` (Ref: ${val('ref')})`;m+=`*📍 Endereço:* ${e}\n`}
  else m+=`*📍 Retirada:* vou buscar na hamburgueria\n`;
  m+=`*💳 Pagamento:* ${pag}${pag==='Pix'?' (enviar a chave por mensagem)':''}`;
  if(pag==='Dinheiro'&&val('trocoVal'))m+=`\n*💵 Troco para:* ${brl(+val('trocoVal'))}`;
  if(val('obs'))m+=`\n*📌 Obs:* ${val('obs')}`;
  return m;
}
$('#enviar').onclick=()=>{
  const erro=x=>{$('#erro').textContent=x;return false};
  if(!cart.length)return erro('Seu carrinho está vazio.');
  if(!val('cli')||!val('tel'))return erro('Preencha seu nome e telefone.');
  if(tipo()==='Entrega'&&(!val('rua')||!val('num')||!val('bairro')))return erro('Preencha rua, número e bairro para entrega.');
  if(!document.querySelector('[name=pag]:checked'))return erro('Escolha a forma de pagamento.');
  erro('');
  window.open(`https://api.whatsapp.com/send?phone=${CONFIG.whatsapp}&text=${encodeURIComponent(mensagem())}`,'_blank');
};
renderBarra();
