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
 const polyDefs={p1:'728,172 1035,98 1165,232 1155,472 740,535 703,365',p2:'492,238 725,170 746,523 503,534 448,371',p3:'290,304 490,239 503,534 292,546 240,394',p4:'63,386 285,306 285,546 137,585 43,470'};
 const labels={p1:[927,220],p2:[610,249],p3:[351,257],p4:[149,359]};
 const phaseCenters={p1:[925,330],p2:[600,342],p3:[377,359],p4:[165,425]};
 const roadEdges=[['gate','main'],['main','center'],['main','east'],['east','farEast'],['center','mid'],['mid','artCross'],['artCross','artQuad'],['artQuad','west'],['west','farWest'],['center','northMid'],['northMid','northEast'],['northEast','east'],['northMid','northWest'],['northWest','artQuad'],['west','southWest'],['southWest','artCross'],['mid','p2node'],['artCross','artStudio'],['p3node','toranj'],['east','p1node']];
 const terrainTrees=[[1037,165],[1082,175],[1121,250],[1095,398],[971,206],[990,271],[845,157],[778,140],[709,177],[695,267],[641,217],[520,199],[469,185],[281,355],[204,437],[140,455],[327,466],[422,489],[581,479],[763,475],[1082,386],[912,451],[933,262],[1112,336],[603,164],[437,383],[742,285]];
 function line(a,b){const p=db.nodes[a],q=db.nodes[b];return p&&q?`M${p[0]} ${p[1]} L${q[0]} ${q[1]}`:''}
 const roofs=(b)=>{let x=b.x,y=b.y,w=b.w,h=b.h;return `<path class="building-roof" d="M ${x-w/2+12} ${y-h/2+15} H ${x+w/2-12} M ${x-w/2+12} ${y+h/2-14} H ${x+w/2-12}"/>`};
 function buildingShape(b){let phase=byPhase(b.phase);let fill=phase?phase.color:(b.id==='greenhouse'?'#91B9A2':b.id==='pool'?'#7BC3CF':'#E0B778');let x=b.x,y=b.y,w=b.w,h=b.h;
  let geom=b.shape==='ellipse'?`<ellipse cx="${x}" cy="${y}" rx="${w/2}" ry="${h/2}"/>`:`<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="8"/>`;
  return `<g class="svg-building ${state.dest===b.id?'active':''}" tabindex="0" role="button" aria-label="اطلاعات ${esc(b.name)}؛ برای مشاهده صفحه اختصاصی کلیک کنید" data-building="${esc(b.id)}" fill="${fill}">${geom}${b.shape==='ellipse'?'':roofs(b)}</g><text x="${x}" y="${y+h/2+22}" text-anchor="middle" class="building-label">${esc(b.name)}</text>`;
 }
 function campusBase(){const park=`<g>${[...Array(19)].map((_,i)=>{const x=931+(i%5)*37+(i%2)*3,y=130+Math.floor(i/5)*40;return `<circle cx="${x}" cy="${y}" r="${9+(i*3)%7}" fill="${i%3===0?'#9FCC8E':'#B0D5A3'}" opacity=".75"/>`}).join('')}</g>`;
  return `<defs><pattern id="svg-grid" patternUnits="userSpaceOnUse" width="48" height="48"><path d="M48 0H0V48" fill="none" stroke="#CEDFE1" stroke-width=".7" opacity=".4"/></pattern></defs>
  <rect width="1200" height="650" fill="#F4F9F8"/><rect width="1200" height="650" fill="url(#svg-grid)"/>
  <path class="campus-outline" d="M33 415 L76 371 L183 334 L310 288 L445 228 L605 181 L791 118 L988 52 Q1087 74 1156 166 Q1200 247 1185 417 L1102 506 L920 562 L756 579 L607 610 L392 618 L206 593 L112 585 Z"/>
  <path d="M985 62Q1100 91 1150 176Q1170 241 1145 304L927 290L876 183Z" fill="#D6E9CA" opacity=".87"/>
  <g>${db.phases.map(p=>`<polygon class="phase-region" data-phase="${p.id}" role="button" tabindex="0" aria-label="مشاهده صفحه ${p.name}" points="${polyDefs[p.id]}" fill="${p.color}" fill-opacity="${p.id==='p3'?'.33':'.23'}" stroke="${p.color}" stroke-opacity=".65"/>`).join('')}</g>
  <g>${roadEdges.map(([a,b])=>`<path class="campus-internal" d="${line(a,b)}"/>`).join('')}</g>
  <g>${roadEdges.map(([a,b])=>`<path class="campus-internal-center" d="${line(a,b)}"/>`).join('')}</g>
  ${park}<g>${terrainTrees.map(([x,y],i)=>`<circle class="grass-tree ${i%3===0?'dark':''}" cx="${x}" cy="${y}" r="${i%4===0?11:8}" opacity=".95"/>`).join('')}</g>
  <g>${db.phases.map(p=>`<g><rect class="phase-caption-bg" x="${labels[p.id][0]-51}" y="${labels[p.id][1]-30}" width="102" height="48" rx="18"/><text class="phase-label" x="${labels[p.id][0]}" y="${labels[p.id][1]-4}" text-anchor="middle">${esc(p.name)}</text><text class="phase-mini" x="${labels[p.id][0]}" y="${labels[p.id][1]+12}" text-anchor="middle">${esc(p.tag)}</text></g>`).join('')}</g>
  <g>${db.buildings.map(buildingShape).join('')}</g>
  <g><circle cx="770" cy="552" r="16" fill="white" stroke="#07509B" stroke-width="4"/><path d="M770 542v18m-9-10 9-9 9 9" fill="none" stroke="#07509B" stroke-width="3" stroke-linecap="round"/><text x="769" y="591" text-anchor="middle" class="building-label" style="font-size:16px">ورودی اصلی</text></g>
  <g><text x="1012" y="97" text-anchor="middle" style="font-size:18px;font-weight:900;fill:#5D8369">فضای سبز</text><text x="999" y="113" text-anchor="middle" style="font-size:11px;fill:#6A9676">محدوده نمایشی</text></g>`;
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
  const b=byId(state.dest);const origin=db.origins.find(o=>o.id===state.origin);el.className='route-result active';el.innerHTML=`<div class="route-header"><div class="route-icon">🧭</div><div><h4>مسیر پیشنهادی تا ${esc(b.name)}</h4><small>محاسبه‌شده روی شبکه مسیرهای نمونه</small></div></div><div class="route-dash"><span>${esc(origin?.label||'مبدا')}</span><span>← ←</span><span>${esc(b.name)}</span></div><div class="route-steps">${state.route.length?`مسیر شامل ${state.route.length} نقطه اتصال در مدل نمایشی است. کوتاه‌ترین مسیر در همین شبکه ترسیم‌شده انتخاب شده، نه مسیر تاییدشده محوطه واقعی.`:'مسیر بین این دو نقطه در شبکه نمونه پیدا نشد.'}</div><button type="button" id="routeDetails">جزئیات، طبقات و اساتید ←</button>`;
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
 function renderQuick(){const ids=['toranj','education','art-office','photography','library','printshop'];$('quickDestinations').innerHTML=ids.map(id=>`<button type="button" class="quick-chip" data-quick="${id}">${esc(byId(id).name)}</button>`).join('');$('quickDestinations').querySelectorAll('[data-quick]').forEach(btn=>btn.onclick=()=>go(btn.dataset.quick));}
 function renderOrigins(){const s=$('originSelect');s.innerHTML=db.origins.map(x=>`<option value="${x.id}">${esc(x.label)}</option>`).join('');s.value=state.origin;s.onchange=()=>{state.origin=s.value;if(state.dest)go(state.dest,false);};}
 function renderLegend(){$('mapLegend').innerHTML=db.phases.map(p=>`<span class="legend-item"><i class="legend-dot" style="background:${p.color}"></i>${esc(p.name)}</span>`).join('');}
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
