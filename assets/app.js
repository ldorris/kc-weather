document.querySelectorAll('#mt th').forEach((th,i)=>th.onclick=()=>{const tb=document.querySelector('#mt tbody');const rows=[...tb.rows];const dir=th.dataset.d=th.dataset.d==='a'?'d':'a';
rows.sort((a,b)=>{let x=a.cells[i].innerText,y=b.cells[i].innerText;const nx=parseFloat(x),ny=parseFloat(y);const r=(!isNaN(nx)&&!isNaN(ny))?nx-ny:x.localeCompare(y);return dir==='a'?r:-r});rows.forEach(r=>tb.appendChild(r))});
const C=['#0b4f8a','#d7263d','#2a9d8f','#f5a623','#7b2cbf','#4cc9f0','#555'];
const T=window.TOP||{},TK={temp:'tmax',precip:'pcpn'};
function mcol(k,i,m){return (m&&T[m]===k)?'#39FF14':C[i%7]}function mw(k,m){return (m&&T[m]===k)?3.5:2}function mo(k,m){return (m&&T[m]===k)?-1:0}
const KCX=(function(){const reg={};let big=null,last=null;
const ov=document.createElement('div');ov.id='cmodal';ov.innerHTML='<div class="cm-box" role="dialog" aria-modal="true"><div class="cm-head"><b class="cm-title"></b><button type="button" class="cm-x" aria-label="Close">✕</button></div><div class="cm-body"><canvas id="cBig"></canvas></div></div>';document.body.appendChild(ov);
function close(){if(big){big.destroy();big=null}ov.classList.remove('open');document.body.classList.remove('cm-lock');if(last)last.focus()}
ov.addEventListener('click',e=>{if(e.target===ov)close()});ov.querySelector('.cm-x').onclick=close;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ov.classList.contains('open'))close()});
function open(id){const r=reg[id];if(!r||!window.Chart)return;last=document.activeElement;if(big)big.destroy();ov.querySelector('.cm-title').textContent=r.title;ov.classList.add('open');document.body.classList.add('cm-lock');
const cfg=r.cfg(true),src=r.chart();if(src)cfg.data.datasets.forEach((d,i)=>{d.hidden=!src.isDatasetVisible(i)});big=new Chart(document.getElementById('cBig'),cfg);ov.querySelector('.cm-x').focus()}
function inArea(ch,e){const a=ch.chartArea;return !!a&&e.x>=a.left&&e.x<=a.right&&e.y>=a.top&&e.y<=a.bottom}
function opts(id,big){return big?{}:{onClick:(e,els,ch)=>{if(inArea(ch,e))open(id)},onHover:(e,els,ch)=>{ch.canvas.style.cursor=inArea(ch,e)?'zoom-in':'default'}}}
function register(id,title,cfg,getChart){reg[id]={title,cfg,chart:getChart};const cv=document.getElementById(id);if(!cv)return;const h=cv.closest('.card').querySelector('h3');
const b=document.createElement('button');b.type='button';b.className='cx';b.title='Expand chart (or click/tap inside the plot)';b.setAttribute('aria-label','Expand '+title);b.textContent='⤢ Expand';b.onclick=()=>open(id);h.appendChild(b)}
function fs(big){return big?15:12}
return {register,open,close,inArea,opts,fs,get big(){return big}}})();window.KCX=KCX;
function ttitle(items){const l=items.length?items[0].label:'';const d=new Date(l);return isNaN(d)?l:d.toLocaleString('en-US',{weekday:'short',month:'numeric',day:'numeric',hour:'numeric'})}
const CH={};
function cfgLine(id,key,big){const S=window.SERIES,ks=Object.keys(S),f=KCX.fs(big);
return {type:'line',data:{datasets:ks.map((k,i)=>({label:k+(TK[key]&&T[TK[key]]===k?' ★ top performer':''),data:S[k].map(h=>({x:h.t,y:h[key]})),borderColor:mcol(k,i,TK[key]),backgroundColor:mcol(k,i,TK[key]),pointRadius:0,pointHoverRadius:big?5:3,borderWidth:mw(k,TK[key])*(big?1.3:1),order:mo(k,TK[key])}))},
options:{...KCX.opts(id,big),maintainAspectRatio:false,animation:big?false:undefined,parsing:{xAxisKey:'x',yAxisKey:'y'},interaction:{mode:'index',intersect:false},
scales:{x:{type:'category',labels:[...new Set(ks.flatMap(k=>S[k].map(h=>h.t)))].sort(),ticks:{font:{size:f},callback:function(v){const l=this.getLabelForValue(v);return l.endsWith('T00:00')?l.slice(5,10):(big&&l.endsWith('T12:00')?'noon':'')},autoSkip:false,maxRotation:0}},y:{ticks:{font:{size:f}}}},
plugins:{legend:{labels:{boxWidth:big?16:12,font:{size:f}}},tooltip:{titleFont:{size:f+1},bodyFont:{size:f},callbacks:{title:ttitle}}}}}}
function chart(id,key,title){const el=document.getElementById(id);if(!window.Chart)return el.replaceWith('Charts unavailable (Chart.js CDN failed)');CH[id]=new Chart(el,cfgLine(id,key,false));KCX.register(id,title,big=>cfgLine(id,key,big),()=>CH[id])}
chart('cT','temp','Temperature (°F) · Kansas City');chart('cP','precip','Hourly precip (in) · Kansas City');chart('cG','gust','Wind gusts (mph) · Kansas City');