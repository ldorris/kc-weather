document.querySelectorAll('#mt th').forEach((th,i)=>th.onclick=()=>{const tb=document.querySelector('#mt tbody');const rows=[...tb.rows];const dir=th.dataset.d=th.dataset.d==='a'?'d':'a';
rows.sort((a,b)=>{let x=a.cells[i].innerText,y=b.cells[i].innerText;const nx=parseFloat(x),ny=parseFloat(y);const r=(!isNaN(nx)&&!isNaN(ny))?nx-ny:x.localeCompare(y);return dir==='a'?r:-r});rows.forEach(r=>tb.appendChild(r))});
const C=['#0b4f8a','#d7263d','#2a9d8f','#f5a623','#7b2cbf','#4cc9f0','#555'];
const T=window.TOP||{},TK={temp:'tmax',precip:'pcpn'};
function mcol(k,i,m){return (m&&T[m]===k)?'#39FF14':C[i%7]}function mw(k,m){return (m&&T[m]===k)?3.5:2}function mo(k,m){return (m&&T[m]===k)?-1:0}
function chart(id,key){if(!window.Chart)return document.getElementById(id).replaceWith('Charts unavailable (Chart.js CDN failed)');const S=window.SERIES,ks=Object.keys(S);
new Chart(document.getElementById(id),{type:'line',data:{datasets:ks.map((k,i)=>({label:k+(TK[key]&&T[TK[key]]===k?' ★ top performer':''),data:S[k].map(h=>({x:h.t,y:h[key]})),borderColor:mcol(k,i,TK[key]),backgroundColor:mcol(k,i,TK[key]),pointRadius:0,borderWidth:mw(k,TK[key]),order:mo(k,TK[key])}))},
options:{parsing:{xAxisKey:'x',yAxisKey:'y'},interaction:{mode:'index',intersect:false},scales:{x:{type:'category',labels:[...new Set(ks.flatMap(k=>S[k].map(h=>h.t)))].sort(),ticks:{callback:function(v){const l=this.getLabelForValue(v);return l.endsWith('T00:00')?l.slice(5,10):''},autoSkip:false,maxRotation:0}}},plugins:{legend:{labels:{boxWidth:12}}}}})}
chart('cT','temp');chart('cP','precip');chart('cG','gust');