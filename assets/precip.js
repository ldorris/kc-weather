if(location.hash.startsWith("#only-")){const id=location.hash.slice(6);document.querySelectorAll("main>section:not(#"+id+"),header,.banner").forEach(e=>e.style.display="none")}
(function(){const P=window.PRECIP;if(!P)return;const el=document.getElementById('cPT');if(!window.Chart){el.replaceWith('Chart unavailable (Chart.js CDN failed)');return}
const C=['#0b4f8a','#d7263d','#2a9d8f','#f5a623','#7b2cbf','#4cc9f0','#555','#000'];let ch;
function draw(t){const d=P.totals[t]||{};const ks=Object.keys(d);if(ch)ch.destroy();
ch=new Chart(el,{type:'bar',data:{labels:P.days.map(x=>new Date(x+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'numeric',day:'numeric'})),
datasets:ks.map((k,i)=>({label:k,data:d[k],backgroundColor:k.startsWith('NWS')?'#13253a':k==='ICON'?'#39FF14':C[i%8],borderColor:k==='ICON'?'#1a7a00':undefined,borderWidth:k==='ICON'?1.5:0}))},options:{maintainAspectRatio:false,plugins:{legend:{labels:{boxWidth:12}}},scales:{y:{beginAtZero:true,suggestedMax:0.25,title:{display:true,text:'inches'}}}}})}
const s=document.getElementById('ptown');s.onchange=()=>draw(s.value);draw(s.value)})();