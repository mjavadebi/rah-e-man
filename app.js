(()=>{'use strict';
 const db=window.CAMPUS_DB;
 const $=id=>document.getElementById(id);
 const byId=id=>db.buildings.find(b=>b.id===id);
 const byPhase=id=>db.phases.find(p=>p.id===id);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=s=>String(s??'').toLowerCase().replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/[‌\u200c]/g,' ').replace(/[أإآ]/g,'ا').replace(/[\u064b-\u065f]/g,'').replace(/\s+/g,' ').trim();
 const state={origin:'gate',dest:null,route:[],viewBox:[0,0,1200,650],popup:null,tooltip:null};
 const svg=$('campusMap');if(!svg)return;
 const ns='http://www.w3.org/2000/svg';
 /* Survey-updated SVG; all polygons are authored components, not embedded images. */
 function line(a,b){const p=db.nodes[a],q=db.nodes[b];return p&&q?`M${p[0]} ${p[1]} L${q[0]} ${q[1]}`:'';}
 function campusBase(){
 const walkways=db.edges.map(([a,b])=>line(a,b)).filter(Boolean);
 const areaSvg=(db.zones||[]).map(z=>{
 const active=state.dest===z.destination;
 return `<g class="campus-zone ${active?'active':''}" data-zone="${esc(z.id)}" tabindex="0" role="button" aria-label="${esc(z.name)}؛ جزئیات و مسیر" style="cursor:pointer">
   <polygon points="${z.points}" fill="${z.color}" fill-opacity=".46" stroke="${z.color}" stroke-width="${active?5:2.5}" stroke-linejoin="round"/>
   <circle cx="${db.nodes[z.node][0]}" cy="${db.nodes[z.node][1]-6}" r="18" fill="#fff" stroke="${z.color}" stroke-width="3"/>
   <text x="${db.nodes[z.node][0]}" y="${db.nodes[z.node][1]}" text-anchor="middle" font-size="17" font-weight="900" fill="#243748">${z.number}</text>
   <text class="building-label" x="${db.nodes[z.node][0]}" y="${db.nodes[z.node][1]+35}" text-anchor="middle" style="font-size:14px;font-weight:900;paint-order:stroke;stroke:#fff;stroke-width:4px">${esc(z.name)}</text>
   </g>`;
 }).join('');
 const trees=[[927,155],[990,191],[1050,221],[1089,280],[586,194],[572,235],[455,236],[559,374],[633,322],[602,444],[717,441],[919,252],[1015,311],[255,380],[202,440]].map(([x,y])=>`<g fill="#91B9A2"><circle cx="${x}" cy="${y}" r="12"/><circle cx="${x-10}" cy="${y+5}" r="8"/><rect x="${x-2}" y="${y+7}" width="4" height="12" fill="#70997D"/></g>`).join('');
 return `<defs><pattern id="survey-grid" width="46" height="46" patternUnits="userSpaceOnUse"><path d="M46 0H0V46" stroke="#D9E5DE" stroke-width=".6" fill="none"/></pattern></defs>
 <rect width="1200" height="650" fill="#F8EDE4"/><rect width="1200" height="650" fill="url(#survey-grid)"/>
 <path d="M18 393 L271 286 L422 236 L582 178 L806 93 L954 39 Q1056 72 1147 185 L1172 406 L1051 491 L878 545 L722 557 L530 598 L283 583 L116 559 Z" fill="#E6F0DE" stroke="#668E6C" stroke-width="5" stroke-linejoin="round"/>
 <path d="M887 96 Q1050 64 1130 188 L1140 325 L928 307 L880 218 Z" fill="#D3E8C4"/>${trees}
 <g>${walkways.map(s=>`<path d="${s}" fill="none" stroke="#BAC7BD" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</g>
 <g>${walkways.map(s=>`<path d="${s}" fill="none" stroke="#FFFFFF" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</g>
 ${areaSvg}
 <g><circle cx="684" cy="486" r="15" fill="#07509B" stroke="#fff" stroke-width="4"/><path d="M684 477v17m-8-9 8-8 8 8" stroke="#fff" stroke-width="3" fill="none" stroke-linejoin="round"/><text x="684" y="520" class="building-label" text-anchor="middle">ورودی اصلی</text></g>
 <text x="999" y="264" fill="#5D8369" text-anchor="middle" font-size="23" font-weight="900">فضای سبز</text>
 <text x="370" y="613" fill="#697B84" font-size="12">محدوده‌ها طبق نقشه دانشجو · مسیرهای سفید به‌صورت شماتیک بازسازی شده‌اند</text>`;
 }
 function shortestPath(origin,target){
  const dist={},prev={},visited=new Set();Object.keys(db.nodes).forEach(k=>dist[k]=Infinity);if(!db.nodes[origin]||!db.nodes[target])return [];
  dist[origin]=0;const adj={};Object.keys(db.nodes).forEach(k=>adj[k]=[]);
  db.edges.forEach(([a,b])=>{if(!db.nodes[a]||!db.nodes[b])return;const p=db.nodes[a],q=db.nodes[b],w=Math.hypot(p[0]-q[0],p[1]-q[1]);adj[a].push([b,w]);adj[b].push([a,w]);});
  while(true){let u=null;for(const id in dist)if(!visited.has(id)&&(u===null||dist[id]<dist[u]))u=id;
   if(u===null||dist[u]===Infinity)break;if(u===target)break;visited.add(u);
   for(const [v,w] of adj[u])if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;prev[v]=u;}}
  if(origin===target)return [origin];if(!prev[target])return [];
  let arr=[target],cur=target;while(cur!==origin){cur=prev[cur];if(!cur)return [];arr.unshift(cur);}return arr;
 }
 function getPathSvg(){if(!state.route.length)return '';let pts=state.route.map(k=>db.nodes[k].join(',')).join(' '),start=db.nodes[state.route[0]],end=db.nodes[state.route[state.route.length-1]];
  return `<g id="active-route" role="img" aria-label="مسیر پیشنهادی از مبدا تا مقصد"><polyline class="route-line-halo" points="${pts}"/><polyline class="route-line" points="${pts}"/>${start?`<circle class="route-circle" cx="${start[0]}" cy="${start[1]}" r="14"/><text class="route-label" x="${start[0]}" y="${start[1]+5}" text-anchor="middle">م</text>`:''}${end?`<circle class="route-circle destination" cx="${end[0]}" cy="${end[1]}" r="15"/><text class="route-label" x="${end[0]}" y="${end[1]+5}" text-anchor="middle">✓</text>`:''}</g>`;
 }
 function draw(){svg.innerHTML=campusBase()+getPathSvg();svg.setAttribute('viewBox',state.viewBox.join(' '));
  svg.querySelectorAll('[data-building]').forEach(el=>{
   let b=byId(el.dataset.building);el.addEventListener('mouseenter',e=>tooltip(e,b.name,b.summary));el.addEventListener('mousemove',moveTooltip);el.addEventListener('mouseleave',hideTooltip);
   el.addEventListener('click',()=>window.location.href=`place.html?id=${encodeURIComponent(b.id)}`);
   el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.location.href=`place.html?id=${encodeURIComponent(b.id)}`;}});
  });
  svg.querySelectorAll('[data-zone]').forEach(el=>{const z=db.zones.find(t=>t.id===el.dataset.zone);if(!z)return;
   el.addEventListener('mouseenter',e=>tooltip(e,z.name,z.summary));el.addEventListener('mousemove',moveTooltip);el.addEventListener('mouseleave',hideTooltip);
   const navigate=()=>{window.location.href=z.phase?`phase.html?id=${encodeURIComponent(z.phase)}`:`place.html?id=${encodeURIComponent(z.destination)}`;};
   el.addEventListener('click',navigate);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();navigate();}});
  });
  svg.querySelectorAll('[data-phase]').forEach(el=>{
   let p=byPhase(el.dataset.phase);el.addEventListener('mouseenter',e=>tooltip(e,p.name,p.description));el.addEventListener('mousemove',moveTooltip);el.addEventListener('mouseleave',hideTooltip);
   el.addEventListener('click',()=>window.location.href=`phase.html?id=${encodeURIComponent(p.id)}`);
   el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.location.href=`phase.html?id=${encodeURIComponent(p.id)}`;}});
  });
  const route=document.querySelector('#active-route');if(route)route.addEventListener('click',()=>state.dest&&showPopup(byId(state.dest)));
  updatePopup();
 }
 function moveTooltip(e){const rect=$('mapBoard').getBoundingClientRect();let box=$('mapTooltip');let x=e.clientX-rect.left,y=e.clientY-rect.top;box.style.left=Math.max(8,Math.min(rect.width-236,x-30))+'px';box.style.top=Math.max(42,Math.min(rect.height-95,y-86))+'px';}
 function tooltip(e,title,summary){const box=$('mapTooltip');box.innerHTML=`<strong>${esc(title)}</strong><small>${esc(summary)}</small><small>برای صفحه اختصاصی کلیک کن ↗</small>`;box.hidden=false;moveTooltip(e)}
 function hideTooltip(){$('mapTooltip').hidden=true}
 function getSvgPoint(node){const point=db.nodes[node];if(!point)return null;let p=svg.createSVGPoint();p.x=point[0];p.y=point[1];const c=svg.getScreenCTM();if(!c)return null;const tr=p.matrixTransform(c),parent=$('mapBoard').getBoundingClientRect();return {x:tr.x-parent.left,y:tr.y-parent.top};}
 function showPopup(b){if(!b)return;state.popup=b.id;updatePopup()}
 function updatePopup(){let p=$('mapPopup');if(!state.popup){p.hidden=true;return}const b=byId(state.popup);if(!b){p.hidden=true;return}const point=getSvgPoint(b.node);if(!point){p.hidden=true;return}
  p.hidden=false;p.innerHTML=`<button class="popup-close" aria-label="بستن" type="button">×</button><strong>${esc(b.name)}</strong><small>${esc(b.summary.slice(0,112))}</small><button type="button" class="popup-open">جزئیات و طبقات ←</button>`;
  p.querySelector('.popup-close').addEventListener('click',()=>{state.popup=null;p.hidden=true});p.querySelector('.popup-open').addEventListener('click',()=>window.location.href=`place.html?id=${encodeURIComponent(b.id)}`);
  const width=$('mapBoard').clientWidth;p.style.left=Math.max(115,Math.min(width-115,point.x))+'px';p.style.top=Math.max(155,point.y-7)+'px';}
 function go(dest,scroll=true){const b=byId(dest);if(!b)return;state.dest=b.id;state.route=shortestPath(state.origin,b.node);state.popup=b.id;state.viewBox=[0,0,1200,650];draw();renderRoute();
  const stage=$('svgStage');if(stage.scrollWidth>stage.clientWidth){const visiblePoint=(b.x/1200)*stage.scrollWidth;stage.scrollLeft=Math.max(0,visiblePoint-stage.clientWidth*.52);requestAnimationFrame(updatePopup);}
  if(scroll)document.getElementById('map-section').scrollIntoView({behavior:'smooth',block:'start'});}

 function renderRoute(){let el=$('routeResult');if(!state.dest){el.className='route-result';el.innerHTML='<div class="empty-route"><span class="route-flag">↝</span><strong>مقصدی انتخاب نشده</strong></div>';return;}
  const b=byId(state.dest);const origin=db.origins.find(o=>o.id===state.origin);el.className='route-result active';el.innerHTML=`<div class="route-header"><div class="route-icon">🧭</div><div><h4>مسیر پیشنهادی تا ${esc(b.name)}</h4><small>محاسبه‌شده روی شبکه مسیرهای نمونه</small></div></div><div class="route-dash"><span>${esc(origin?.label||'مبدا')}</span><span>← ←</span><span>${esc(b.name)}</span></div><div class="route-steps">${state.route.length?`مسیر شامل ${state.route.length} نقطه اتصال در مدل شماتیک است. کوتاه‌ترین مسیر در همین شبکه ترسیم‌شده انتخاب شده، نه مسیر تاییدشده محوطه واقعی.`:'مسیر بین این دو نقطه در شبکه نمونه پیدا نشد.'}</div><button type="button" id="routeDetails">جزئیات، طبقات و اساتید ←</button>`;
  $('routeDetails').onclick=()=>location.href=`place.html?id=${encodeURIComponent(b.id)}`;
 }
 function searchItems(q){const nq=norm(q);if(!nq)return [];
  const candidates=[];for(const b of db.buildings){let full=[b.name,b.tag,b.category,b.summary,...(b.features||[])].join(' ');if(norm(full).includes(nq)||nq.split(' ').every(t=>norm(full).includes(t)))candidates.push({id:b.id,name:b.name,kind:b.category});
   for(const f of b.floors||[])for(const r of f.rooms||[]){if(norm(r.name+' '+r.code).includes(nq)){candidates.push({id:b.id,name:`${r.name} (${r.code})`,kind:`${b.name} · ${f.label}`});}}
   for(const f of b.faculty||[])if(norm(f.name+' '+f.office+' '+f.role).includes(nq))candidates.push({id:b.id,name:f.name,kind:`${b.name} · ${f.office}`});}
  return candidates.slice(0,8);
 }
 function renderSearch(){const input=$('searchInput'),box=$('searchResults');let val=input.value.trim();if(!val){box.innerHTML='';return}const arr=searchItems(val);box.innerHTML=arr.length?arr.map((x,i)=>`<button class="search-result" type="button" data-res="${i}"><span><strong>${esc(x.name)}</strong><br><small>${esc(x.kind)}</small></span><span>↖</span></button>`).join(''):'<p style="color:#9A7F7F;font-size:10px">موردی پیدا نشد؛ عبارت دیگه‌ای رو امتحان کن.</p>';box.querySelectorAll('[data-res]').forEach(el=>el.onclick=()=>{const r=arr[+el.dataset.res];go(r.id);box.innerHTML='';input.value=r.name;});}
 function renderPhaseCards(){const icons=['📚','📸','🎨','🧩'];$('phaseCards').innerHTML=db.phases.map((p,i)=>`<article class="phase-card" style="--phase:${p.color};--phaseSoft:${p.color}33"><div class="phase-card-top"><span class="phase-number">${p.number}</span><div class="phase-icon">${icons[i]}</div></div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="phase-card-foot"><button type="button" data-open-phase="${p.id}">دیدن ساختمان‌ها ←</button><small>${p.buildings.length} بخش در MVP</small></div></article>`).join('');$('phaseCards').querySelectorAll('[data-open-phase]').forEach(b=>b.onclick=()=>location.href=`phase.html?id=${b.dataset.openPhase}`);}
 function renderFAQ(q=''){const filter=norm(q);const faqs=db.faq.filter(x=>!filter||norm(x.q+' '+x.a+' '+x.tags.join(' ')).includes(filter));$('faqList').innerHTML=faqs.length?faqs.map(f=>`<details class="faq-item"><summary><span>${esc(f.q)}</span><span class="faq-plus">+</span></summary><div class="faq-answer">${esc(f.a)}<br><button type="button" data-faq-dest="${esc(f.destination)}">نمایش مقصد و مسیر روی نقشه ←</button>${f.openFaculty?` <a href="place.html?id=toranj#faculty" style="color:var(--blue);padding-right:9px;font-size:10px">فهرست اساتید ↗</a>`:''}</div></details>`).join(''):'<div class="notice-box">سوالی پیدا نشد. می‌تونی نام فضا رو در جست‌وجوی نقشه وارد کنی.</div>';
  $('faqList').querySelectorAll('[data-faq-dest]').forEach(btn=>btn.onclick=()=>go(btn.dataset.faqDest));}
 function renderQuick(){const ids=['toranj','cafeteria','management','dorms','sports','pool'];$('quickDestinations').innerHTML=ids.map(id=>`<button type="button" class="quick-chip" data-quick="${id}">${esc(byId(id).name)}</button>`).join('');$('quickDestinations').querySelectorAll('[data-quick]').forEach(btn=>btn.onclick=()=>go(btn.dataset.quick));}
 function renderOrigins(){const s=$('originSelect');s.innerHTML=db.origins.map(x=>`<option value="${x.id}">${esc(x.label)}</option>`).join('');s.value=state.origin;s.onchange=()=>{state.origin=s.value;if(state.dest)go(state.dest,false);};}
 function renderLegend(){$('mapLegend').innerHTML=[...db.phases].map(p=>`<span class="legend-item"><i class="legend-dot" style="background:${p.color}"></i>${esc(p.name)}</span>`).join('');}
 function renderCrumbs(){$('breadcrumbs').innerHTML='<button type="button" class="crumb active">🏠 دانشگاه / نقشه کلی</button>';$('mapLevelLabel').textContent='نمای کلی دانشگاه';}
 function setZoom(factor){let [x,y,w,h]=state.viewBox;const nw=Math.max(350,Math.min(1200,w*factor)),nh=nw*650/1200;state.viewBox=[x+(w-nw)/2,y+(h-nh)/2,nw,nh];draw();}
 function resetZoom(){state.viewBox=[0,0,1200,650];draw();}
 function scrollToId(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});}
 function initNav(){document.querySelectorAll('[data-nav]').forEach(btn=>btn.onclick=()=>{const id={map:'map-section',explore:'explore-section',faq:'faq-section',about:'about-section'}[btn.dataset.nav];scrollToId(id);document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b===btn));$('navToggle').setAttribute('aria-expanded','false');document.querySelector('.main-nav').classList.remove('open');});
  $('navToggle').onclick=()=>{const n=document.querySelector('.main-nav');n.classList.toggle('open');$('navToggle').setAttribute('aria-expanded',String(n.classList.contains('open')));};
  $('heroMapBtn').onclick=()=>scrollToId('map-section');$('heroFaqBtn').onclick=()=>scrollToId('faq-section');$('aboutMapBtn').onclick=()=>scrollToId('map-section');$('showAllBtn').onclick=()=>{resetZoom();scrollToId('map-section');};
  $('zoomIn').onclick=()=>setZoom(.76);$('zoomOut').onclick=()=>setZoom(1.3);$('resetView').onclick=resetZoom;
  $('searchInput').addEventListener('input',renderSearch);$('searchInput').addEventListener('keydown',e=>{if(e.key==='Enter'){const r=searchItems($('searchInput').value)[0];if(r)go(r.id);}});
  $('faqSearch').addEventListener('input',e=>renderFAQ(e.target.value));
  window.addEventListener('resize',()=>{if(state.popup)updatePopup();});$('svgStage').addEventListener('scroll',()=>{if(state.popup)updatePopup();},{passive:true});
 }
 function initDeepLink(){const sp=new URLSearchParams(location.search);const dest=sp.get('dest'),origin=sp.get('origin');if(db.nodes[origin]){state.origin=origin;$('originSelect').value=origin;}if(byId(dest))setTimeout(()=>go(dest,true),70);}
 renderPhaseCards();renderOrigins();renderQuick();renderLegend();renderCrumbs();renderFAQ();initNav();draw();initDeepLink();
})();
