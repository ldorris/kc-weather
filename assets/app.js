document.querySelectorAll('#mt th').forEach((th,i)=>th.onclick=()=>{const tb=document.querySelector('#mt tbody');const rows=[...tb.rows];const dir=th.dataset.d=th.dataset.d==='a'?'d':'a';
rows.sort((a,b)=>{let x=a.cells[i].dataset.sort||a.cells[i].innerText,y=b.cells[i].dataset.sort||b.cells[i].innerText;const nx=parseFloat(x),ny=parseFloat(y);const r=a.cells[i].dataset.sort?x.localeCompare(y):(!isNaN(nx)&&!isNaN(ny))?nx-ny:x.localeCompare(y);return dir==='a'?r:-r});rows.forEach(r=>tb.appendChild(r))});
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
// Time axis: every series is plotted at its TRUE valid time. Series times are Central wall-clock strings
// ('YYYY-MM-DDTHH:00'); they are mapped to ms as if UTC and always formatted in UTC, so the axis shows Central time
// for every viewer regardless of the browser's own zone. (The old category axis + mode:'index' tooltip picked the
// same ARRAY INDEX in every dataset; a series starting at its init+1h, hours before the others' local-midnight
// start, had its hover dot 4-10 h away from the time in the tooltip title.)
function tms(s){return Date.parse(s+':00Z')}
const TFMT=new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'short',month:'numeric',day:'numeric',hour:'numeric'}),DFMT=new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'short',month:'numeric',day:'numeric'});
function ttitle(items){return items.length?TFMT.format(new Date(items[0].parsed.x))+' CT':''}
if(window.Chart&&!Chart.Interaction.modes.xsync){Chart.Interaction.modes.xsync=function(chart,e){
const a=chart.chartArea,xs=chart.scales.x;if(!a||!xs||e.x<a.left||e.x>a.right)return [];const v=xs.getValueForPixel(e.x);let best=null,bd=Infinity;
chart.data.datasets.forEach((d,i)=>{if(!chart.isDatasetVisible(i))return;for(const p of d.data){if(p.y==null)continue;const q=Math.abs(p.x-v);if(q<bd){bd=q;best=p.x}}});
if(best===null)return [];const out=[];
chart.data.datasets.forEach((d,i)=>{if(!chart.isDatasetVisible(i))return;const k=d.data.findIndex(p=>p.x===best&&p.y!=null);if(k>=0)out.push({element:chart.getDatasetMeta(i).data[k],datasetIndex:i,index:k})});
return out}}
const XHAIR={id:'xhair',afterDatasetsDraw(c){const a=c.tooltip&&c.tooltip.getActiveElements&&c.tooltip.getActiveElements();if(!a||!a.length)return;const x=a[0].element.x,ctx=c.ctx;ctx.save();ctx.strokeStyle='rgba(19,37,58,.35)';ctx.lineWidth=1;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(x,c.chartArea.top);ctx.lineTo(x,c.chartArea.bottom);ctx.stroke();ctx.restore()}};
const CH={};
function cfgLine(id,key,big){const S=window.SERIES,ks=Object.keys(S),f=KCX.fs(big),D=864e5;
const all=ks.flatMap(k=>S[k].map(h=>tms(h.t)));const xmin=Math.min(...all),xmax=Math.max(...all);
return {type:'line',plugins:[XHAIR],data:{datasets:ks.map((k,i)=>({label:k+(TK[key]&&T[TK[key]]===k?' ★ top performer':''),data:S[k].map(h=>({x:tms(h.t),y:h[key]})),borderColor:mcol(k,i,TK[key]),backgroundColor:mcol(k,i,TK[key]),pointRadius:0,pointHoverRadius:big?6:4,borderWidth:mw(k,TK[key])*(big?1.3:1),order:mo(k,TK[key]),spanGaps:true}))},
options:{...KCX.opts(id,big),maintainAspectRatio:false,animation:big?false:undefined,interaction:{mode:'xsync',intersect:false},
scales:{x:{type:'linear',min:xmin,max:xmax,afterBuildTicks:s=>{const t=[];for(let m=Math.ceil(s.min/D)*D;m<=s.max;m+=big?D/2:D)t.push({value:m});s.ticks=t},
grid:{color:c=>c.tick&&c.tick.value%D===0?'rgba(0,0,0,.12)':'rgba(0,0,0,.04)'},
ticks:{font:{size:f},autoSkip:false,maxRotation:0,callback:v=>v%D===0?DFMT.format(new Date(v)):(big?'noon':'')}},y:{ticks:{font:{size:f}}}},
plugins:{legend:{labels:{boxWidth:big?16:12,font:{size:f}}},tooltip:{titleFont:{size:f+1},bodyFont:{size:f},callbacks:{title:ttitle}}}}}}
function chart(id,key,title){const el=document.getElementById(id);if(!window.Chart)return el.replaceWith('Charts unavailable (Chart.js CDN failed)');CH[id]=new Chart(el,cfgLine(id,key,false));KCX.register(id,title,big=>cfgLine(id,key,big),()=>CH[id])}
chart('cT','temp','Temperature (°F) · Kansas City');chart('cP','precip','Hourly precip (in) · Kansas City');chart('cG','gust','Wind gusts (mph) · Kansas City');