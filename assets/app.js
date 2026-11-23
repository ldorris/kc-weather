function chartSkin(){const cs=getComputedStyle(document.documentElement),v=n=>cs.getPropertyValue(n).trim();
return {tick:v('--chart-tick')||'#3b4a5c',grid:v('--chart-grid')||'rgba(0,0,0,.12)',gridMinor:v('--chart-grid-minor')||'rgba(0,0,0,.04)',
xhair:v('--chart-xhair')||'rgba(19,37,58,.35)',font:v('--chart-font')||'system-ui,sans-serif',
tipBg:v('--chart-tip-bg')||'rgba(255,255,255,.96)',tipFg:v('--chart-tip-fg')||'#10233a',tipBd:v('--chart-tip-bd')||'rgba(16,40,80,.18)',
border:v('--line')||'rgba(0,0,0,.1)'}}
function applyChartTheme(){if(!window.Chart)return;const s=chartSkin();
Chart.defaults.color=s.tick;Chart.defaults.borderColor=s.border;Chart.defaults.font.family=s.font;
const tip=Chart.defaults.plugins&&Chart.defaults.plugins.tooltip;if(tip){tip.backgroundColor=s.tipBg;tip.titleColor=s.tipFg;tip.bodyColor=s.tipFg;tip.borderColor=s.tipBd;tip.borderWidth=1}
const charts=[];const inst=Chart.instances;
if(inst){if(typeof inst.forEach==='function')inst.forEach(c=>charts.push(c));else Object.values(inst).forEach(c=>charts.push(c))}
if(window.CH)Object.values(CH).forEach(c=>{if(c&&charts.indexOf(c)<0)charts.push(c)});
if(window.KCX&&KCX.big&&charts.indexOf(KCX.big)<0)charts.push(KCX.big);
charts.forEach(c=>{try{
  if(c.options&&c.options.plugins){const L=c.options.plugins.legend,T=c.options.plugins.tooltip;
    if(L&&L.labels){L.labels.color=s.tick;L.labels.font=Object.assign({},L.labels.font||{},{family:s.font})}
    if(T){T.backgroundColor=s.tipBg;T.titleColor=s.tipFg;T.bodyColor=s.tipFg;T.borderColor=s.tipBd;T.borderWidth=1;if(T.titleFont)T.titleFont.family=s.font;if(T.bodyFont)T.bodyFont.family=s.font}}
  if(c.options&&c.options.scales)Object.keys(c.options.scales).forEach(k=>{const sc=c.options.scales[k];if(!sc)return;if(sc.ticks)sc.ticks.color=s.tick;if(sc.title)sc.title.color=s.tick;if(!sc.grid)sc.grid={};if(typeof sc.grid.color!=='function')sc.grid.color=s.grid});
  c.update('none')}catch(e){}})}
applyChartTheme();
document.querySelectorAll('#mt th').forEach((th,i)=>th.onclick=()=>{const tb=document.querySelector('#mt tbody');const rows=[...tb.rows];const dir=th.dataset.d=th.dataset.d==='a'?'d':'a';
rows.sort((a,b)=>{let x=a.cells[i].dataset.sort||a.cells[i].innerText,y=b.cells[i].dataset.sort||b.cells[i].innerText;const nx=parseFloat(x),ny=parseFloat(y);const r=a.cells[i].dataset.sort?x.localeCompare(y):(!isNaN(nx)&&!isNaN(ny))?nx-ny:x.localeCompare(y);return dir==='a'?r:-r});rows.forEach(r=>tb.appendChild(r))});
const C=['#0b4f8a','#d7263d','#2a9d8f','#f5a623','#7b2cbf','#4cc9f0','#555','#000'];
const T=window.TOP||{},TK={temp:'tmax',precip:'pcpn'};const QCAT={0:'none',1:'0.01–0.09"',2:'0.10–0.24"',3:'0.25–0.49"',4:'0.50–0.99"',5:'1.00–1.99"',6:'≥2.00"'};
const XS=window.XSTYLE||{};function mcol(k,i,m){return (m&&T[m]===k)?'#39FF14':XS[k]?XS[k].c:C[i%8]}function mw(k,m){return (m&&T[m]===k)?3.5:2}function mo(k,m){return (m&&T[m]===k)?-1:0}
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
const TFMT=new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'short',month:'numeric',day:'numeric',hour:'numeric'}),DFMT=new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'short',month:'numeric',day:'numeric'}),SDFMT=new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'short'});
function ttitle(items){return items.length?TFMT.format(new Date(items[0].parsed.x))+' CT':''}
if(window.Chart&&!Chart.Interaction.modes.xsync){Chart.Interaction.modes.xsync=function(chart,e){
const a=chart.chartArea,xs=chart.scales.x;if(!a||!xs||e.x<a.left||e.x>a.right)return [];const v=xs.getValueForPixel(e.x);let best=null,bd=Infinity;
chart.data.datasets.forEach((d,i)=>{if(!chart.isDatasetVisible(i))return;for(const p of d.data){if(p.y==null)continue;const q=Math.abs(p.x-v);if(q<bd){bd=q;best=p.x}}});
if(best===null)return [];const out=[];
chart.data.datasets.forEach((d,i)=>{if(!chart.isDatasetVisible(i))return;const k=d.data.findIndex(p=>p.x===best&&p.y!=null);if(k>=0)out.push({element:chart.getDatasetMeta(i).data[k],datasetIndex:i,index:k})});
return out}}
const XHAIR={id:'xhair',afterDatasetsDraw(c){const a=c.tooltip&&c.tooltip.getActiveElements&&c.tooltip.getActiveElements();if(!a||!a.length)return;const x=a[0].element.x,ctx=c.ctx;ctx.save();ctx.strokeStyle=chartSkin().xhair;ctx.lineWidth=1;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(x,c.chartArea.top);ctx.lineTo(x,c.chartArea.bottom);ctx.stroke();ctx.restore()}};
const CH={};
function cfgLine(id,key,big){const S=window.SERIES,ks=Object.keys(S),f=KCX.fs(big),D=864e5;
const all=ks.flatMap(k=>S[k].map(h=>tms(h.t)));const xmin=Math.min(...all),xmax=Math.max(...all);
const ds=ks.map((k,i)=>[k,i]).filter(([k])=>S[k].some(h=>h[key]!=null)).map(([k,i])=>({label:k+(TK[key]&&T[TK[key]]===k?' ★ top performer':''),data:S[k].filter(h=>h[key]!=null).map(h=>({x:tms(h.t),y:h[key]})),borderColor:mcol(k,i,TK[key]),backgroundColor:mcol(k,i,TK[key]),borderDash:XS[k]&&XS[k].d?XS[k].d:undefined,pointRadius:XS[k]&&XS[k].p?(big?3:2):0,pointHoverRadius:big?6:4,borderWidth:mw(k,TK[key])*(big?1.3:1),order:mo(k,TK[key]),spanGaps:true}));
if(key==='temp')(window.DAILYX||[]).forEach(X=>{const G='#39FF14',th=T.tmax===X.key,tl=T.tmin===X.key,pc=p=>(p.k==='high'?th:tl)?G:X.color;
const data=X.pts.map(p=>({x:tms(p.t),y:p.y,k:p.k})).filter(p=>p.x>=xmin&&p.x<=xmax);if(!data.length)return;
ds.push({xkey:X.key,label:X.label+(th||tl?' ★ top performer ('+[th?'highs':'',tl?'lows':''].filter(Boolean).join(', ')+')':''),daily:1,place:'placed at median model timing',data,borderColor:th?G:X.color,backgroundColor:th?G:X.color,borderDash:[7,5],borderWidth:(th?3.5:2.5)*(big?1.3:1),
pointStyle:'triangle',pointRotation:c=>c.raw&&c.raw.k==='low'?180:0,pointRadius:big?8:6,pointHoverRadius:big?10:8,pointBackgroundColor:c=>c.raw?pc(c.raw):X.color,pointBorderColor:X.color,pointBorderWidth:1.5,order:th?-1:0,spanGaps:true})});
if(key==='precip')(window.DAILYP||[]).forEach(X=>{const G='#39FF14',top=T.pcpn===X.key,col=top?G:X.color;
const data=X.pts.map(p=>({x:tms(p.t),y:p.y,k:p.k})).filter(p=>p.x>=xmin&&p.x<=xmax);if(!data.length)return;
ds.push({xkey:X.key,label:X.label+(top?' ★ top performer':''),daily:1,place:'calendar-day total, shown at 11 PM CT',unit:' in',data,borderColor:col,backgroundColor:col,borderDash:[7,5],borderWidth:(top?3.5:2.5)*(big?1.3:1),
pointStyle:'rectRot',pointRadius:big?8:6,pointHoverRadius:big?10:8,pointBackgroundColor:col,pointBorderColor:X.color,pointBorderWidth:1.5,order:top?-1:0,spanGaps:true})});
return {type:'line',plugins:[XHAIR],data:{datasets:ds},
options:{...KCX.opts(id,big),maintainAspectRatio:false,animation:big?false:undefined,interaction:{mode:'xsync',intersect:false},
scales:{x:{type:'linear',min:xmin,max:xmax,afterBuildTicks:s=>{const t=[];for(let m=Math.ceil(s.min/D)*D;m<=s.max;m+=big?D/2:D)t.push({value:m});s.ticks=t},
grid:{color:c=>{const s=chartSkin();return c.tick&&c.tick.value%D===0?s.grid:s.gridMinor}},
ticks:{font:{size:f},autoSkip:false,maxRotation:0,callback:v=>v%D===0?(innerWidth<640&&!big?SDFMT.format(new Date(v)):DFMT.format(new Date(v))):(big?'noon':'')}},y:{ticks:{font:{size:f}}}},
plugins:{legend:{labels:{boxWidth:big?16:12,font:{size:f}}},tooltip:{titleFont:{size:f+1},bodyFont:{size:f},callbacks:{title:ttitle,label:c=>{const r=c.raw||{};return c.dataset.daily?' '+(c.dataset.xkey||c.dataset.label.split(' ')[0])+' daily '+(r.k||'')+': '+c.formattedValue+(c.dataset.unit||'')+(c.dataset.place?' ('+c.dataset.place+')':''):' '+c.dataset.label+': '+c.formattedValue}}}}}}}
function chart(id,key,title){const el=document.getElementById(id);if(!window.Chart)return el.replaceWith('Charts unavailable (Chart.js CDN failed)');CH[id]=new Chart(el,cfgLine(id,key,false));KCX.register(id,title,big=>cfgLine(id,key,big),()=>CH[id])}
chart('cT','temp','Temperature (°F) · Kansas City');
(function(){const M=window.MOSPOP||[],el=document.getElementById('cMP');if(!el)return;if(!M.length||!window.Chart){el.closest('.cbox').outerHTML='<p class="s">MOS PoP unavailable this build.</p>';return}
const all=M.flatMap(X=>X.pts.map(p=>tms(p.t)));const xmin=Math.min(...all),xmax=Math.max(...all),D=864e5;
function cfg(big){const f=KCX.fs(big);return {type:'line',plugins:[XHAIR],data:{datasets:M.map(X=>{const top=T.pcpn===X.label,col=top?'#39FF14':X.color;return {label:X.label+' ('+X.h+'-h PoP)'+(top?' ★ top performer':''),data:X.pts.map(p=>({x:tms(p.t),y:p.pop,q:p.q,qin:p.qin,h:p.h,lead:p.lead})),borderColor:col,backgroundColor:col+'33',fill:false,stepped:'before',pointRadius:c=>c.raw&&c.raw.lead?0:(big?4:3),pointHoverRadius:big?7:5,borderWidth:(top?3.5:2.2)*(big?1.3:1)}})},
options:{...KCX.opts('cMP',big),maintainAspectRatio:false,animation:big?false:undefined,interaction:{mode:'xsync',intersect:false},
scales:{x:{type:'linear',min:xmin,max:xmax,afterBuildTicks:s=>{const t=[];for(let m=Math.ceil(s.min/D)*D;m<=s.max;m+=D)t.push({value:m});s.ticks=t},ticks:{font:{size:f},autoSkip:false,maxRotation:0,callback:v=>innerWidth<640&&!big?SDFMT.format(new Date(v)):DFMT.format(new Date(v))}},y:{min:0,max:100,ticks:{font:{size:f},callback:v=>v+'%'}}},
plugins:{legend:{labels:{boxWidth:big?16:12,font:{size:f}}},tooltip:{titleFont:{size:f+1},bodyFont:{size:f},callbacks:{title:it=>it.length?'Period ending '+TFMT.format(new Date(it[0].parsed.x))+' CT':'',label:c=>{const r=c.raw||{};return ' '+c.dataset.label.replace(/ [(].*$/,'')+': '+r.h+'-h PoP '+c.formattedValue+'%'+(r.qin!=null?' · QPF '+Number(r.qin).toFixed(2)+'"':(r.q!=null?' · QPF category '+r.q+' ('+(QCAT[r.q]||'?')+')':''))}}}}}}}
CH.cMP=new Chart(el,cfg(false));KCX.register('cMP','Precipitation chance (%) · KCI',big=>cfg(big),()=>CH.cMP)})();chart('cP','precip','Hourly precip (in) · Kansas City');chart('cG','gust','Wind gusts (mph) · Kansas City');
/* Tabs: client-side switching, deep-linkable (#home #forecast #scores #tp #sw #nws #more, or any section id), #only-<id> view */
(function(){const tabs=[...document.querySelectorAll('nav.tabs .tab')],panels=[...document.querySelectorAll('main>.panel')];if(!panels.length)return;
const ids=new Set(panels.map(p=>p.dataset.tab)),nav=document.querySelector('nav.tabs');
function show(k,el){panels.forEach(p=>p.classList.toggle('on',p.dataset.tab===k));
tabs.forEach(t=>{const on=t.dataset.tab===k;t.classList.toggle('on',on);t.setAttribute('aria-selected',on?'true':'false');if(on){const r=t.parentNode;r.scrollTo({left:t.offsetLeft-r.clientWidth/2+t.clientWidth/2,behavior:'smooth'})}});
if(window.Chart)Object.values(Chart.instances||{}).forEach(c=>{try{c.resize()}catch(e){}});
requestAnimationFrame(()=>{if(el){const y=el.getBoundingClientRect().top+scrollY-(nav&&!document.body.classList.contains('only')?nav.offsetHeight+10:8);scrollTo({top:Math.max(0,y)})}else scrollTo({top:0})})}
function route(){let h='';try{h=decodeURIComponent(location.hash.slice(1))}catch(e){}let only=false;if(h.startsWith('only-')){h=h.slice(5);only=true}
if(!h||ids.has(h)){document.body.classList.remove('only');show(h||'home');return}
const el=document.getElementById(h),p=el&&el.closest('main>.panel');if(!p){show('home');return}
if(only){document.body.classList.add('only');[...p.children].forEach(c=>{c.style.display=(c===el||c.contains(el))?'':'none'})}
if(el.tagName==='DETAILS')el.open=true;show(p.dataset.tab,el)}
addEventListener('hashchange',route);route();
const KCTHEMES=[{id:'cyberpunk',label:'Cyberpunk',icon:'🌆'},{id:'light',label:'Classic Light',icon:'☀️'},{id:'dark',label:'Classic Dark',icon:'🌙'}];
function applyTheme(t,persist){if(!KCTHEMES.some(x=>x.id===t))t='cyberpunk';
const d=document.documentElement;d.dataset.theme=t;d.dataset.scheme=t==='light'?'light':'dark';
if(persist!==false){try{localStorage.setItem('kcThemeV2',t)}catch(e){}}
const sel=document.getElementById('themeSel');if(sel){if(!sel.dataset.built){sel.innerHTML=KCTHEMES.map(x=>'<option value="'+x.id+'">'+x.icon+' '+x.label+'</option>').join('');sel.dataset.built='1'}sel.value=t}
if(window.applyChartTheme)applyChartTheme();
try{window.dispatchEvent(new CustomEvent('kc-theme',{detail:{theme:t}}))}catch(e){}}
const tsel=document.getElementById('themeSel');
if(tsel){applyTheme(document.documentElement.dataset.theme||'cyberpunk',false);tsel.onchange=()=>applyTheme(tsel.value,true)}
})();
(function(){
const P=window.DAILYCMP; if(!P||!P.days||!P.days.length) return;
const root=document.getElementById('dailymodel'); if(!root) return;
const $ = (s,el=root)=>el.querySelector(s);
const $$ = (s,el=root)=>[...el.querySelectorAll(s)];
const KEY={tmax:'hi',tmin:'lo',pcpn:'precip'};
const UNIT={tmax:'°',tmin:'°',pcpn:'"'};
const fmt={
  hi:v=>v==null?'–':String(Math.round(v)),
  lo:v=>v==null?'–':String(Math.round(v)),
  precip:v=>{
    if(v==null) return '–';
    if(typeof v==='number') return v<0.005&&v>0?'T':v.toFixed(2);
    return String(v);
  },
  gust:v=>v==null?'–':String(Math.round(v)),
  snow:v=>v==null||v===0?'–':(typeof v==='number'?(v<0.05?'T':v.toFixed(1)):String(v))
};
function num(v){return (typeof v==='number'&&isFinite(v))?v:null}
function hasEl(rec,el){return rec && num(rec[KEY[el]])!=null}
let view='day', day=P.days[0].d, el='tmax', showAll=false;
try{const s=JSON.parse(localStorage.getItem('kcDailyCmp')||'{}');
  if(s.view==='heat'||s.view==='day') view=s.view;
  if(s.el&&P.metrics[s.el]) el=s.el;
  if(typeof s.showAll==='boolean') showAll=s.showAll;
  if(s.day&&P.days.some(x=>x.d===s.day)) day=s.day;
}catch(e){}
function save(){try{localStorage.setItem('kcDailyCmp',JSON.stringify({view,day,el,showAll}))}catch(e){}}
function meta(d){return P.days.find(x=>x.d===d)||P.days[0]}
function leadOf(d){return (meta(d)||{}).lead||1}
function maeOf(name,d,e){const L=String(leadOf(d)); return ((P.mae||{})[e]||{})[L] ? P.mae[e][L][name] : null}
function shortList(d,e){
  const L=String(leadOf(d));
  const ranked=((P.top5||{})[e]||{})[L]||[];
  const names=[];
  for(const n of ranked){
    const rec=(P.rows.find(r=>r.name===n)||{}).vals||{};
    if(hasEl(rec[d],e) || (e==='tmax'&&num((rec[d]||{}).hi)!=null) || (e==='tmin'&&num((rec[d]||{}).lo)!=null) || (e==='pcpn'&&num((rec[d]||{}).precip)!=null)){
      if(!names.includes(n)) names.push(n);
    }
    if(names.length>=5) break;
  }
  // if fewer than 5 had data, still include remaining ranked (they render as –)
  for(const n of ranked){ if(names.length>=5) break; if(!names.includes(n)) names.push(n); }
  return names;
}
function visibleRows(d,e){
  const refs=P.ref||[];
  if(showAll) return P.rows;
  const want=shortList(d,e);
  const out=[];
  const seen=new Set();
  for(const n of refs.concat(want)){
    const r=P.rows.find(x=>x.name===n);
    if(r && !seen.has(r.name)){ out.push(r); seen.add(r.name); }
  }
  // keep any short-list / ref order: refs first (blend, nws), then top5 not already included
  return out;
}
function pc(rec){
  if(!rec) return '–';
  if(rec.pop!=null && rec.qpf!=null) return 'PoP '+Math.round(rec.pop)+'% · '+fmt.precip(rec.qpf)+'"';
  if(rec.pop!=null && rec.qcat!=null) return 'PoP '+Math.round(rec.pop)+'% · '+(window.QCAT&&QCAT[rec.qcat]||('cat '+rec.qcat));
  if(rec.pop!=null && rec.precip==null) return 'PoP '+Math.round(rec.pop)+'%';
  return fmt.precip(rec.precip);
}
function noteOf(rec){
  if(!rec) return '';
  let n=rec.note||'';
  if(rec.complete===false && !/partial/i.test(n)) n=(n?n+' · ':'')+'partial';
  return n;
}
function consensus(d){
  const models=P.rows.filter(r=>!(P.ref||[]).includes(r.name));
  function spread(k){
    const xs=models.map(r=>num((r.vals[d]||{})[k])).filter(v=>v!=null);
    if(!xs.length) return {n:0};
    const mid=xs.slice().sort((a,b)=>a-b);
    const med=mid.length%2?mid[(mid.length-1)/2]:(mid[mid.length/2-1]+mid[mid.length/2])/2;
    return {n:xs.length, med, lo:Math.min(...xs), hi:Math.max(...xs)};
  }
  return {hi:spread('hi'), lo:spread('lo'), precip:spread('precip')};
}
function fmtCons(s, kind){
  if(!s||!s.n) return '–';
  if(kind==='precip') return fmt.precip(s.med)+' ('+fmt.precip(s.lo)+'–'+fmt.precip(s.hi)+', n='+s.n+')';
  return Math.round(s.med)+'° ('+Math.round(s.lo)+'–'+Math.round(s.hi)+', n='+s.n+')';
}
function renderDay(){
  $$('.dchip').forEach(b=>b.setAttribute('aria-pressed', b.dataset.day===day?'true':'false'));
  $$('.mchip').forEach(b=>b.setAttribute('aria-pressed', b.dataset.el===el?'true':'false'));
  const m=meta(day); const L=m.lead;
  const names=shortList(day,el);
  const leadTxt='Short list for '+P.metrics[el].toLowerCase()+' at lead D'+L+' (30-day KMCI MAE).';
  $('#dllead').textContent=P.fallback
    ? 'forecastscores.com weights unavailable this build — showing every source. Super Blend and NWS are still the reference rows.'
    : leadTxt+(showAll?' Showing every source.':'');
  $('#dlexplain').textContent=P.explain||'';
  const tb=$('#mt tbody'); tb.innerHTML='';
  const C=consensus(day);
  const cr=document.createElement('tr'); cr.className='dlcons';
  cr.innerHTML='<td>Consensus (median of models)</td><td>'+fmtCons(C.hi,'hi')+'</td><td>'+fmtCons(C.lo,'lo')+'</td><td>'+fmtCons(C.precip,'precip')+'</td><td>–</td><td>–</td><td>excludes Super Blend and NWS</td>';
  tb.appendChild(cr);
  for(const r of visibleRows(day,el)){
    const v=r.vals[day]||{};
    const tr=document.createElement('tr');
    const cls=[r.cls||'','xrow'];
    if((P.ref||[]).includes(r.name)) cls.push('dlref');
    tr.className=cls.filter(Boolean).join(' ');
    const mae=maeOf(r.name,day,el);
    const maeS=mae!=null?('<div class="s">D'+L+' MAE '+(el==='pcpn'?mae.toFixed(2)+'"':mae.toFixed(1)+'°')+'</div>'):'';
    const pcell=(v.pop!=null && v.precip==null && v.qpf==null && v.qcat==null)?('PoP '+Math.round(v.pop)+'%'):pc(v);
    // If precip amount exists, show amount; append PoP in the note if present and amount is also there
    let precipCell=fmt.precip(v.precip);
    if(v.precip==null && (v.pop!=null||v.qpf!=null||v.qcat!=null)) precipCell=pc(v);
    else if(v.precip!=null && v.pop!=null) precipCell=fmt.precip(v.precip)+' <span class="s">PoP '+Math.round(v.pop)+'%</span>';
    const miss=!r.vals[day]?' dlmiss':'';
    tr.innerHTML='<td>'+r.html+maeS+'</td>'
      +'<td class="dlhi'+miss+'">'+fmt.hi(v.hi)+'</td>'
      +'<td class="'+miss+'">'+fmt.lo(v.lo)+'</td>'
      +'<td class="'+miss+'">'+precipCell+'</td>'
      +'<td class="'+miss+'">'+fmt.gust(v.gust)+'</td>'
      +'<td class="'+miss+'">'+fmt.snow(v.snow)+'</td>'
      +'<td class="s">'+((noteOf(v)||'').replace(/</g,'&lt;'))+'</td>';
    tb.appendChild(tr);
  }
}
function blendVal(d,e){
  const r=P.rows.find(x=>x.name===P.blend);
  return r?num((r.vals[d]||{})[KEY[e]]):null;
}
function heatColor(dv, maxA){
  if(dv==null||!maxA) return '';
  const t=Math.max(-1,Math.min(1, dv/maxA));
  if(t===0) return '';
  const pos=t>0; const a=Math.abs(t);
  // red = warmer/wetter than blend; blue = cooler/drier
  const c=pos?('220,38,38'):('29,78,216');
  return 'background:rgba('+c+','+(0.15+0.7*a).toFixed(2)+')';
}
function renderHeat(){
  $$('.mchip', $('#dl-heat')).forEach(b=>b.setAttribute('aria-pressed', b.dataset.el===el?'true':'false'));
  const box=$('#dlheatbox');
  const maxA=(()=>{let m=0;
    for(const r of P.rows){
      if(r.name===P.blend) continue;
      for(const d of P.days){
        const b=blendVal(d.d,el), v=num((r.vals[d.d]||{})[KEY[el]]);
        if(b!=null&&v!=null) m=Math.max(m, Math.abs(v-b));
      }
    }
    return m||1;
  })();
  let hdr='<th class="rh">Model</th>'+P.days.map(d=>'<th>'+d.lab+'</th>').join('');
  let body='';
  const order=[...P.rows].sort((a,b)=>{
    const ra=(P.ref||[]).indexOf(a.name), rb=(P.ref||[]).indexOf(b.name);
    if(ra>=0||rb>=0) return (ra<0?99:ra)-(rb<0?99:rb);
    return a.name.localeCompare(b.name);
  });
  for(const r of order){
    let tds='';
    for(const d of P.days){
      const rec=r.vals[d.d]||{};
      const v=num(rec[KEY[el]]);
      if(v==null){ tds+='<td class="dlna" title="no data">–</td>'; continue; }
      const b=blendVal(d.d,el);
      const dv=(b==null||r.name===P.blend)?0:v-b;
      const label=r.name===P.blend?'blend':((dv>0?'+':'')+(el==='pcpn'?dv.toFixed(2):Math.round(dv))+UNIT[el]);
      const tip=r.name+' · '+d.lab+' · '+(el==='pcpn'?fmt.precip(v)+'"':Math.round(v)+'°')+(r.name===P.blend||b==null?'':' vs blend '+(el==='pcpn'?fmt.precip(b)+'"':Math.round(b)+'°')+' ('+label+')');
      tds+='<td class="dlc" data-day="'+d.d+'" style="'+heatColor(r.name===P.blend?0:dv,maxA)+'" title="'+tip.replace(/"/g,'&quot;')+'">'+(el==='pcpn'?fmt.precip(v):Math.round(v))+(r.name===P.blend?'':' <span class="s">'+label+'</span>')+'</td>';
    }
    body+='<tr class="'+(r.cls||'')+'"><th class="rh">'+r.html+'</th>'+tds+'</tr>';
  }
  const scaleHi=el==='pcpn'?('+'+maxA.toFixed(2)+'"'):('+'+Math.round(maxA)+'°');
  const scaleLo=el==='pcpn'?('−'+maxA.toFixed(2)+'"'):('−'+Math.round(maxA)+'°');
  box.innerHTML='<div class="dlheat"><div class="dlscale"><span>'+scaleLo+' cooler / drier</span><span class="dlbar"></span><span>'+scaleHi+' warmer / wetter</span><span>vs KCTV Super Blend</span></div><table class="dlheat"><thead><tr>'+hdr+'</tr></thead><tbody>'+body+'</tbody></table></div>';
  box.querySelectorAll('td.dlc').forEach(td=>td.onclick=()=>{day=td.dataset.day; view='day'; save(); applyView();});
}
function applyView(){
  $$('.vbtn').forEach(b=>{const on=b.dataset.view===view; b.classList.toggle('on',on); b.setAttribute('aria-pressed',on?'true':'false')});
  $('#dl-day').hidden=view!=='day';
  $('#dl-heat').hidden=view!=='heat';
  $('#dlexplain').textContent=P.explain||'';
  if(view==='heat') renderHeat(); else renderDay();
}
$$('.vbtn').forEach(b=>b.onclick=()=>{view=b.dataset.view; save(); applyView()});
$$('.dchip').forEach(b=>b.onclick=()=>{day=b.dataset.day; save(); renderDay()});
function bindM(elroot){
  // metric chips in day tools already exist; clone into heat map toolbar once
}
$$('.mchip').forEach(b=>b.onclick=()=>{el=b.dataset.el; save(); applyView()});
const heatm=$('.mchips.heatm');
if(heatm && !heatm.dataset.built){
  heatm.innerHTML=$$('.mchips:not(.heatm) .mchip').map(b=>b.outerHTML).join('');
  heatm.dataset.built='1';
  $$('.mchip', heatm).forEach(b=>b.onclick=()=>{el=b.dataset.el; save(); applyView()});
}
const all=$('#dlAll'); if(all){all.checked=showAll; all.onchange=()=>{showAll=all.checked; save(); renderDay()}}
// header sort on the day table
document.querySelectorAll('#mt th').forEach((th,i)=>th.onclick=()=>{const tb=document.querySelector('#mt tbody');const rows=[...tb.rows];const dir=th.dataset.d=th.dataset.d==='a'?'d':'a';
rows.sort((a,b)=>{let x=a.cells[i].dataset.sort||a.cells[i].innerText,y=b.cells[i].dataset.sort||b.cells[i].innerText;const nx=parseFloat(x),ny=parseFloat(y);const r=(!isNaN(nx)&&!isNaN(ny))?nx-ny:x.localeCompare(y);return dir==='a'?r:-r});rows.forEach(r=>tb.appendChild(r))});
applyView();
})();
