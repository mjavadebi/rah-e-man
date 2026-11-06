/*
 * Rah-e Man · campus cartography v2
 * Visual-only SVG renderer. No image overlay, iframe, or external dependency.
 * Referenced blue buildings and red pedestrian corridors were redrawn as editable
 * map primitives. Physical geometry is still schematic until on-site survey.
 * Existing CAMPUS_DB and shortest-path algorithm remain untouched.
 */
(function () {
  "use strict";
  const P={cream:"#F8EDE4",paper:"#FFF9F3",blue:"#07509B",deep:"#164C7D",
    pink:"#E8A9BA",rose:"#D98DAB",sage:"#91B9A2",forest:"#668875",
    pale:"#D6E7C8",ink:"#243748",gold:"#F5D69B",sky:"#B9D8EB"};
  const landmarks=[
    // Western residential cluster: units are still one searchable destination.
    {id:"d01",name:"خوابگاه ۱",x:91,y:446,w:43,h:36,target:"dorms",kind:"residence"},
    {id:"d02",name:"خوابگاه ۲",x:86,y:398,w:46,h:38,target:"dorms",kind:"residence"},
    {id:"d03",name:"خوابگاه ۳",x:155,y:408,w:46,h:40,target:"dorms",kind:"residence"},
    {id:"d04",name:"خوابگاه ۴",x:171,y:458,w:44,h:38,target:"dorms",kind:"residence"},
    {id:"d05",name:"خوابگاه ۵",x:210,y:377,w:44,h:38,target:"dorms",kind:"residence"},
    {id:"d06",name:"خوابگاه ۶",x:242,y:412,w:43,h:38,target:"dorms",kind:"residence"},
    {id:"d07",name:"خوابگاه ۷",x:228,y:349,w:43,h:38,target:"dorms",kind:"residence"},
    {id:"d08",name:"خوابگاه ۸",x:117,y:365,w:43,h:34,target:"dorms",kind:"residence"},
    {id:"d09",name:"خوابگاه ۹",x:181,y:341,w:43,h:35,target:"dorms",kind:"residence"},
    {id:"d10",name:"خوابگاه ۱۰",x:270,y:356,w:43,h:35,target:"dorms",kind:"residence"},
    // Phase 1 and central service buildings.
    {id:"p1main",name:"کلاس‌های فاز ۱",x:362,y:332,w:91,h:102,target:"general",kind:"education",large:true},
    {id:"p1office",name:"آموزش",x:342,y:413,w:57,h:54,target:"education",kind:"office"},
    {id:"p1admin",name:"ساختمان مدیریت",x:455,y:316,w:69,h:69,target:"management",kind:"office"},
    {id:"caf",name:"سلف",x:399,y:475,w:79,h:60,target:"cafeteria",kind:"service",large:true},
    {id:"novin",name:"ساختمان نوین",x:556,y:282,w:56,h:57,phase:"p2",kind:"education"},
    {id:"roshd",name:"ساختمان رشد",x:572,y:361,w:52,h:51,phase:"p2",kind:"education"},
    {id:"unit-manager",name:"مدیریت",x:620,y:329,w:50,h:47,phase:"p2",kind:"office"},
    {id:"photography",name:"ساختمان عکاسی",x:680,y:296,w:92,h:75,target:"photography",kind:"education",large:true},
    {id:"pouyan",name:"پویان",x:777,y:273,w:58,h:66,phase:"p2",kind:"education"},
    {id:"gym",name:"سالن ورزشی",x:825,y:152,w:91,h:63,target:"sports",kind:"service",large:true},
    {id:"pool",name:"استخر",x:905,y:152,w:47,h:61,target:"pool",kind:"service"},
    // Phase 3 is a set of individually interactive studios.
    {id:"a1",name:"آتلیه ۱",x:871,y:368,w:51,h:43,target:"art-studio",kind:"studio"},
    {id:"a2",name:"آتلیه ۲",x:927,y:368,w:51,h:43,target:"art-studio",kind:"studio"},
    {id:"a3",name:"آتلیه ۳",x:871,y:411,w:51,h:40,target:"art-studio",kind:"studio"},
    {id:"a4",name:"آتلیه ۴",x:927,y:411,w:51,h:40,target:"art-studio",kind:"studio"},
    {id:"a5",name:"آتلیه ۵",x:871,y:454,w:51,h:40,target:"art-studio",kind:"studio"},
    {id:"a6",name:"آتلیه ۶",x:927,y:454,w:51,h:40,target:"art-studio",kind:"studio"},
    {id:"it",name:"IT",x:767,y:424,w:42,h:39,phase:"p3",kind:"office"},
    {id:"artoffice",name:"دفتر گروه",x:1020,y:424,w:48,h:72,target:"art-office",kind:"office"},
    {id:"library",name:"کتابخانه",x:985,y:460,w:57,h:38,target:"library",kind:"service"},
    {id:"support",name:"معاونت",x:986,y:506,w:75,h:35,phase:"p3",kind:"office"},
    {id:"print",name:"کارگاه چاپ",x:1055,y:485,w:74,h:50,target:"printshop",kind:"studio"},
    {id:"multipurpose",name:"سالن چندمنظوره",x:1111,y:470,w:105,h:74,phase:"p3",kind:"service",large:true}
  ];
  const roadContours=[
    // Main walkable loop visible in the annotated drawing (approximate trace).
    "M 144 482 Q 192 510 263 431 Q 311 400 315 366 Q 312 330 360 300 L 491 247 L 690 177 L 831 113 Q 868 100 901 128 L 994 216 Q 1056 308 1161 326 Q 1192 330 1174 391 Q 1167 435 1100 454",
    "M 313 370 Q 307 454 355 537 Q 377 574 428 545 L 566 501 Q 605 481 640 490 Q 677 504 710 488 Q 745 475 771 504 Q 795 522 824 520 L 1110 453",
    "M 363 299 Q 392 320 390 371 L 393 475 L 527 476 L 575 460 Q 626 442 670 449",
    "M 427 371 L 572 369 L 674 365 L 784 368 L 899 362 L 1023 366",
    "M 571 370 L 578 316 L 620 316 L 620 255 L 664 253",
    "M 691 176 Q 711 226 706 290 L 706 365",
    "M 821 119 L 827 196 L 902 196 L 922 268 L 1000 326",
    "M 897 361 L 899 479 L 853 519",
    "M 1010 364 L 1042 390 L 1042 485 L 1024 522",
    "M 740 367 L 742 431 L 784 431 L 786 491",
    "M 486 371 Q 500 394 533 392 Q 552 393 570 369",
    "M 400 474 Q 357 468 349 421",
    "M 926 194 L 1010 278 L 1130 326"
  ];
  const landscaped=[
    [255,434,88,42],[487,324,93,76],[496,416,85,60],[629,205,120,74],
    [748,314,90,58],[777,395,77,45],[698,487,65,39],[1007,236,100,73],
    [1075,390,79,44],[287,501,72,40]
  ];
  // Use seeded fixed vectors so every redraw and zoom has identical scenery.
  const trees=[[118,510,1],[170,524,.8],[238,492,.65],[475,338,.8],[514,308,.65],
    [477,441,1],[609,206,.8],[653,213,.65],[730,237,.8],[754,303,.7],
    [1014,228,.8],[1057,258,.7],[1098,279,1],[1125,236,.65],
    [1010,300,.65],[1063,347,.8],[1098,363,.75],[1032,420,.7],
    [584,485,.8],[605,523,.7],[649,502,.65],[284,493,.8],
    [708,464,.7],[974,246,.6],[793,254,.75]];
  const plots=landscaped.map(([x,y,w,h],i)=>
    '<rect x="'+(x-w/2)+'" y="'+(y-h/2)+'" width="'+w+'" height="'+h+'" rx="'+(8+i%3*3)+'" class="garden-plot"/>').join("");
  const treeSvg=trees.map(([x,y,s],i)=>'<g class="map-tree" transform="translate('+x+' '+y+') scale('+s+')">'+
   '<path d="M0 3v15" stroke="#698B60" stroke-width="5" stroke-linecap="round"/>'+
   '<circle cx="-9" cy="-3" r="12" fill="'+(i%5===0?'#91B9A2':'#78A475')+'"/>'+
   '<circle cx="7" cy="-7" r="14" fill="'+(i%3===0?'#65986C':'#8EB282')+'"/>'+
   '<circle cx="0" cy="-14" r="12" fill="#A0C69A"/>'+
   '<circle cx="-8" cy="-12" r="3" fill="#D5E8CA" opacity=".6"/></g>').join("");
  function text(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function labelLines(str) {
    const splits={"کلاس‌های فاز ۱":["کلاس‌های","فاز ۱"],"ساختمان مدیریت":["ساختمان","مدیریت"],"ساختمان عکاسی":["ساختمان","عکاسی"],"سالن چندمنظوره":["سالن","چندمنظوره"],"سالن ورزشی":["سالن","ورزشی"],"ساختمان نوین":["ساختمان","نوین"],"ساختمان رشد":["ساختمان","رشد"],"ساختمان ترنج":["ساختمان","ترنج"]};
    return splits[str]||[str];
  }
  function featureSvg(feature,db,active){
    const b=feature.target && db.buildings.find(x=>x.id===feature.target);
    const accessible=b?'data-building="'+text(b.id)+'"':'data-map-place="'+text(feature.id)+'"';
    const isActive=active && b && active===b.id;
    const big=!!feature.large;
    const x=feature.x-feature.w/2,y=feature.y-feature.h/2;
    const fill=feature.kind==="service"?"#1A608C":feature.kind==="office"?"#285C82":feature.kind==="residence"?"#376F96":P.blue;
    const lineCount=labelLines(feature.name).length;
    const font=big?15:feature.w<52?10.3:12.5;
    const baseline=feature.y + (lineCount===1?4:-5);
    const ts=labelLines(feature.name).map((s,i)=>'<tspan x="'+feature.x+'" dy="'+(i?font*1.28:0)+'">'+text(s)+'</tspan>').join("");
    return '<g class="map-building '+(isActive?'active ':'')+'map-building--'+feature.kind+'" tabindex="0" role="button" aria-label="'+text(feature.name)+'، مشاهده جزئیات" '+accessible+'>'+
      '<rect class="map-building-shadow" x="'+(x+3)+'" y="'+(y+5)+'" width="'+feature.w+'" height="'+feature.h+'" rx="'+(big?8:6)+'"/>'+
      '<rect class="map-building-body" x="'+x+'" y="'+y+'" width="'+feature.w+'" height="'+feature.h+'" rx="'+(big?8:6)+'" fill="'+fill+'"/>'+
      '<path d="M '+(x+6)+' '+(y+6)+' H '+(x+feature.w-6)+'" stroke="#A7D1E8" stroke-opacity=".56" stroke-width="2" stroke-linecap="round" pointer-events="none"/>'+
      '<text class="map-building-text" x="'+feature.x+'" y="'+baseline+'" font-size="'+font+'" text-anchor="middle" font-weight="800" pointer-events="none">'+ts+'</text>'+
      '</g>';
  }
  function render(db,state){
    const active=state.dest;
    // The nine confirmed macro-zones remain individually clickable behind the buildings.
    const zones=(db.zones||[]).map(z=>
      '<g class="campus-zone'+(active===z.destination?' active':'')+'" role="button" tabindex="0" data-zone="'+text(z.id)+'" aria-label="'+text(z.name)+'، اطلاعات محدوده">'+
      '<polygon points="'+z.points+'" fill="'+z.color+'" fill-opacity=".11" stroke="'+z.color+'" stroke-opacity=".26" stroke-width="1.8" stroke-dasharray="4 7"/>'+
      '</g>').join("");
    // The core graph roads and Dijkstra coordinates remain in sync, including access spurs.
    const graphRoads=db.edges.map(([a,b])=>{
      const p=db.nodes[a],q=db.nodes[b];return p&&q?'M'+p.join(' ')+' L'+q.join(' '):'';
    }).filter(Boolean);
    const roads=[...roadContours,...graphRoads];
    const roadLayer=roads.map((d,i)=>
      '<path d="'+d+'" class="map-pedestrian '+(i>=roadContours.length?'map-pedestrian--graph':'')+'"/>').join("");
    const dashed=roads.slice(0,roadContours.length).map(d=>
      '<path d="'+d+'" class="map-pedestrian-center"/>').join("");
    const paper='<defs>'+
      '<linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF9F3"/><stop offset=".65" stop-color="#F8EDE4"/><stop offset="1" stop-color="#F2E5DC"/></linearGradient>'+
      '<pattern id="paper-dots" width="26" height="24" patternUnits="userSpaceOnUse"><circle cx="3" cy="5" r=".65" fill="#CBAEB1" opacity=".24"/><circle cx="18" cy="18" r=".5" fill="#CBAEB1" opacity=".2"/></pattern>'+
      '<clipPath id="campus-area"><path d="M18 393 L271 286 L422 236 L582 178 L806 93 L954 39 Q1056 72 1147 185 L1172 406 L1051 491 L878 545 L722 557 L530 598 L283 583 L116 559 Z"/></clipPath>'+
      '<filter id="map-card-shadow" x="-20%" y="-30%" width="150%" height="165%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#164C7D" flood-opacity=".14"/></filter>'+
      '</defs>';
    const frame='<path d="M18 393 L271 286 L422 236 L582 178 L806 93 L954 39 Q1056 72 1147 185 L1172 406 L1051 491 L878 545 L722 557 L530 598 L283 583 L116 559 Z" fill="#DCEACF" stroke="#61876B" stroke-width="8" stroke-linejoin="round"/>'+
      '<path d="M18 393 L271 286 L422 236 L582 178 L806 93 L954 39 Q1056 72 1147 185 L1172 406 L1051 491 L878 545 L722 557 L530 598 L283 583 L116 559 Z" fill="none" stroke="#F8EDE4" stroke-width="2.4" stroke-linejoin="round"/>';
    const eastPark='<path d="M918 97 Q1043 79 1118 192 Q1157 241 1136 293 L968 300 Q940 270 914 213 Z" fill="#CAE0BA" stroke="#A5C69B" stroke-width="1"/>';
    const westPark='<path d="M72 504 Q179 501 266 464 L289 510 Q204 583 105 549 Z" fill="#CDE4C2" stroke="#A5C69B" stroke-width="1"/>';
    const track='<g class="map-walkway-network">'+roadLayer+dashed+'</g>';
    const garden='<g clip-path="url(#campus-area)">'+plots+treeSvg+'</g>';
    const selected=landmarks.map(b=>featureSvg(b,db,active)).join("");
    const entry='<g class="map-entry-marker"><circle cx="684" cy="486" r="16" fill="#F8EDE4" stroke="#07509B" stroke-width="3"/>'+
      '<path d="M684 478 V492 M677 484 L684 477 L691 484" fill="none" stroke="#07509B" stroke-width="2.5" stroke-linecap="round"/>'+
      '<rect x="627" y="513" width="115" height="29" rx="14" fill="#FFF9F3" stroke="#E8A9BA"/>'+
      '<text x="684" y="532" text-anchor="middle" fill="#243748" font-size="13" font-weight="800">ورودی اصلی</text></g>';
    const north='<g class="map-north"><circle cx="767" cy="77" r="24" fill="#FFF9F3" stroke="#466A58" stroke-width="2"/>'+
      '<path d="M767 47 L767 107 M737 77 L797 77" stroke="#466A58" stroke-width="1.5"/>'+
      '<path d="M767 55 L758 81 L767 77 L776 81 Z" fill="#D98DAB"/>'+
      '<text x="708" y="82" text-anchor="middle" font-size="17" font-weight="800" fill="#243748">شمال</text></g>';
    const parks='<g class="map-park-name"><rect x="982" y="264" width="121" height="38" rx="18" fill="#FFF9F3" opacity=".93"/><text x="1042" y="290" text-anchor="middle" fill="#466A58" font-size="18" font-weight="800">فضای سبز</text>'+
      '<rect x="139" y="526" width="112" height="37" rx="18" fill="#FFF9F3" opacity=".93"/><text x="195" y="551" text-anchor="middle" fill="#466A58" font-size="16" font-weight="800">فضای سبز</text></g>';
    const key='<g class="map-map-key" aria-hidden="true"><rect x="28" y="36" width="242" height="99" rx="17" fill="#FFF9F3" opacity=".96" stroke="#DEC9BC"/>'+
      '<text x="248" y="61" fill="#243748" text-anchor="end" font-size="15" font-weight="800">راهنمای نقشه</text>'+
      '<rect x="217" y="75" width="30" height="14" rx="4" fill="#07509B"/><text x="205" y="87" text-anchor="end" fill="#243748" font-size="11">ساختمان قابل انتخاب</text>'+
      '<path d="M218 107 H247" stroke="#D98DAB" stroke-width="8" stroke-linecap="round"/><text x="205" y="111" text-anchor="end" fill="#243748" font-size="11">مسیر پیاده‌روی</text></g>';
    return paper+
      '<rect width="1200" height="650" fill="url(#paper)"/><rect width="1200" height="650" fill="url(#paper-dots)"/>'+
      frame+'<g clip-path="url(#campus-area)">'+eastPark+westPark+zones+garden+track+'</g>'+
      north+parks+selected+entry+key+
      '<text x="600" y="625" text-anchor="middle" class="map-watermark">راهنمای گرافیکی راه من · موقعیت دقیق ساختمان‌ها و مسیرها نیازمند تایید میدانی است</text>';
  }
  window.RAHMAN_MAP={render,landmarks,roads:roadContours,version:"visual-2.0"};
})();