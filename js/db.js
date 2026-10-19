/* Liga o cardápio ao Firestore (via API REST). Sem o firebase no config.js, usa o produtos.js normalmente. */
(function(){
  const F=CONFIG.firebase;if(!F||!F.projectId||!F.apiKey)return;
  const B=`https://firestore.googleapis.com/v1/projects/${F.projectId}/databases/(default)/documents`,K='key='+F.apiKey;
  const dec=v=>{const k=Object.keys(v)[0],x=v[k];
    if(k==='integerValue'||k==='doubleValue')return +x;
    if(k==='nullValue')return null;
    if(k==='arrayValue')return (x.values||[]).map(dec);
    if(k==='mapValue')return campos(x.fields);
    return x};
  const campos=f=>{const o={};for(const k in f||{})o[k]=dec(f[k]);return o};
  const enc=v=>v==null?{nullValue:null}:Array.isArray(v)?{arrayValue:{values:v.map(enc)}}:typeof v==='number'?{doubleValue:v}:typeof v==='boolean'?{booleanValue:v}:typeof v==='object'?{mapValue:{fields:Object.fromEntries(Object.entries(v).map(([k,x])=>[k,enc(x)]))}}:{stringValue:String(v)};
  try{
    const x=new XMLHttpRequest();
    x.open('GET',`${B}/produtos?pageSize=300&${K}`,false);x.send();
    if(x.status===200){
      const r=(JSON.parse(x.responseText).documents||[]).map(d=>({id:d.name.split('/').pop(),...campos(d.fields)})).filter(d=>d.ativo!==false).sort((a,b)=>(a.ordem||0)-(b.ordem||0));
      if(r.length){
        PRODUTOS.length=0;
        r.forEach(d=>{const o=d.dados||{};
          PRODUTOS.push({id:d.id,nome:d.nome,preco:+d.preco,custo:+d.custo||0,cat:d.cat,desc:d.descr||'',img:d.img||null,remover:o.remover||[],adicionais:o.adicionais||[],escolha:o.escolha||null});
          if(!CATS.some(c=>c.n===d.cat))CATS.push({n:d.cat,e:'🍽️',s:'',img:null})});
        for(let i=CATS.length-1;i>=0;i--)if(!PRODUTOS.some(p=>p.cat===CATS[i].n))CATS.splice(i,1);
      }
    }
  }catch(e){}
  window.salvarPedido=p=>{try{
    const f=Object.fromEntries(Object.entries({...p,status:'novo'}).map(([k,v])=>[k,enc(v)]));
    f.criado={timestampValue:new Date().toISOString()};
    fetch(`${B}/pedidos?${K}`,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})});
  }catch(e){}};
})();
