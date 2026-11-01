(function(){
var F=window.FOODS,$=function(i){return document.getElementById(i)},crit=1;
var CN=['calories','protéines','glucides'];
function opts(sel,def){var h='',c='';F.forEach(function(f){if(f.c!==c){if(c)h+='</optgroup>';h+='<optgroup label="'+f.c+'">';c=f.c}h+='<option value="'+f.id+'"'+(f.id===def?' selected':'')+'>'+f.n+'</option>'});sel.innerHTML=h+'</optgroup>'}
function get(id){for(var i=0;i<F.length;i++)if(F[i].id===id)return F[i]}
function vals(f,q){return f.v.map(function(x){return x*q/100})}
function fmt(x,d){return (Math.round(x*Math.pow(10,d))/Math.pow(10,d)).toString().replace('.',',')}
function calc(){
 var a=get($('a').value),b=get($('b').value),q=parseFloat(String($('q').value).replace(',','.'));
 var tb=$('tb'),out=$('out'),w=$('warn');w.textContent='';
 if(!(q>0)||!Number.isFinite(q)||q>2000){out.textContent='Saisis une quantité entre 1 et 2 000 g';tb.innerHTML='';return}
 var va=vals(a,q),ref=va[crit];
 if(b.v[crit]<=0.5||ref<=0.05){out.innerHTML='Critère non adapté';w.textContent='Cet aliment ne contient presque pas de '+CN[crit]+' : choisis un autre critère (souvent « Calories »).';tb.innerHTML='';return}
 var qb=ref/b.v[crit]*100,qr=qb>=20?Math.round(qb/5)*5:Math.round(qb),vb=vals(b,qr);
 out.innerHTML=fmt(q,0)+' g '+a.n.toLowerCase()+'<br>≈ <span>'+qr+' g</span> '+b.n.toLowerCase();
 if(qr>600)w.textContent='Quantité très élevée : ce remplacement n’est pas réaliste sur ce critère.';
 var row=function(n,v){return '<tr><td>'+n+'</td><td>'+fmt(v[0],0)+'</td><td>'+fmt(v[1],1)+' g</td><td>'+fmt(v[2],1)+' g</td><td>'+fmt(v[3],1)+' g</td></tr>'};
 var d=vb.map(function(x,i){return x-va[i]});
 var dr='<tr><td><b>Écart</b></td>'+d.map(function(x,i){var s=(x>0?'+':'')+fmt(x,i?1:0)+(i?' g':'');return '<td class="'+(Math.abs(x)<(i?0.5:5)?'':(x>0?'pos':'neg'))+'">'+s+'</td>'}).join('')+'</tr>';
 tb.innerHTML=row('Départ',va)+row('Remplacement',vb)+dr;
}
function reset(){$('a').value='poulet';$('b').value='tofu';$('q').value=130;setCrit(1)}
function setCrit(c){crit=c;[].forEach.call(document.querySelectorAll('.crit button'),function(x){x.setAttribute('aria-pressed',String(+x.dataset.c===c))});calc()}
opts($('a'),'poulet');opts($('b'),'tofu');
['a','b'].forEach(function(i){$(i).addEventListener('change',calc)});$('q').addEventListener('input',calc);
[].forEach.call(document.querySelectorAll('.crit button'),function(x){x.addEventListener('click',function(){setCrit(+x.dataset.c)})});
$('r').addEventListener('click',reset);calc();
})();