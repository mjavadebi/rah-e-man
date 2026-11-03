/* Rah-e Man - survey layer 2026-11-03.
   Only large area labels are confirmed by the user's annotated campus map.
   Geometry and pedestrian graph are SCHEMATIC, not surveyed distances or accessible routes.
   Building/room/faculty contents retained from prototype are DEMO. */
(()=>{
'use strict';
const d=window.CAMPUS_DB;
d.meta={...d.meta,version:'MVP 1.1 • map survey',source:'نقشه شماره‌گذاری‌شده دانشجو (۹ محدوده)؛ راه‌های سفید پیاده‌رو',lastReview:'تایید جانمایی کلی؛ نیازمند برداشت ورودی‌ها و جزئیات',demo:true};
d.phases=[
{id:'p1',number:'۰۱',name:'فاز ۱',tag:'بخش آموزشی',color:'#07509B',description:'فاز ۱ بر اساس محدوده شماره ۲ در نقشه ارسالی. کاربرد اتاق‌ها هنوز باید بررسی شود.',buildings:['general','education','library']},
{id:'p2',number:'۰۲',name:'فاز ۲',tag:'بخش آموزشی',color:'#91B9A2',description:'فاز ۲ مطابق محدوده شماره ۵ نقشه؛ جزئیات ساختمان‌ها نیازمند برداشت میدانی است.',buildings:['photography','fashion']},
{id:'p3',number:'۰۳',name:'فاز ۳',tag:'گروه هنر',color:'#E8A9BA',description:'فاز ۳ در سمت راست نقشه؛ تمرکز پروژه راه من بر ساختمان‌ها و کلاس‌های این محدوده است.',buildings:['toranj','art-office','art-studio']}
];
d.zones=[
{id:'dorm',number:'۱',name:'خوابگاه‌ها',color:'#D9B8E6',node:'dorm',destination:'dorms',summary:'محدوده خوابگاه‌ها در غرب دانشگاه. ساختمان‌ها و ورودی‌های داخلی هنوز ثبت نشده‌اند.',points:'25,370 254,284 292,365 107,478 57,495'},
{id:'p1',number:'۲',name:'فاز ۱',color:'#07509B',node:'p1node',phase:'p1',destination:'general',summary:'محدوده فاز یک در غرب میانی دانشگاه؛ جزئیات کلاس‌ها به‌روزرسانی خواهد شد.',points:'304,287 394,251 423,297 424,393 346,402 323,350'},
{id:'caf',number:'۳',name:'سلف',color:'#E8C786',node:'cafeteria',destination:'cafeteria',summary:'ساختمان سلف در قسمت جنوبی فاز ۱. ساعات کار و مسیر ورود نیازمند تایید است.',points:'365,446 395,442 420,464 392,501 363,487'},
{id:'management',number:'۴',name:'ساختمان مدیریت',color:'#B7BDD8',node:'management',destination:'management',summary:'ساختمان مدیر دانشگاه و بخش‌های وابسته؛ جزئیات دفاتر هنوز جمع‌آوری نشده است.',points:'476,280 523,268 524,344 478,353'},
{id:'p2',number:'۵',name:'فاز ۲',color:'#91B9A2',node:'p2node',phase:'p2',destination:'photography',summary:'محدوده فاز دو در میانه بالایی نقشه؛ اطلاعات کلاس‌ها و ورودی‌ها نیازمند تکمیل است.',points:'634,227 742,215 748,316 624,317'},
{id:'p3',number:'۶',name:'فاز ۳',color:'#E8A9BA',node:'p3node',phase:'p3',destination:'toranj',summary:'بخش اصلی پروژه؛ موقعیت کلی فاز سه مشخص است اما جانمایی ترنج و اتاق‌ها هنوز تایید نشده‌اند.',points:'755,315 936,318 950,461 815,491 747,470'},
{id:'workshop',number:'۷',name:'کارگاه چاپ و باشگاه ورزشی',color:'#F0C5A1',node:'workshop',destination:'printshop',summary:'محدوده شماره ۷ در شرق نقشه؛ جای ورودی‌های کارگاه و باشگاه باید ثبت شود.',points:'968,376 1059,357 1070,435 976,451'},
{id:'gym',number:'۸',name:'سالن ورزشی',color:'#8FD2CE',node:'gym',destination:'sports',summary:'سالن ورزشی نزدیک استخر در شمال شرقی محوطه.',points:'747,127 807,118 808,185 751,185'},
{id:'pool',number:'۹',name:'استخر',color:'#87BEE9',node:'pool',destination:'pool',summary:'استخر در شمال شرقی، مجاور سالن ورزشی؛ ورودی دقیق باید مشخص شود.',points:'820,122 863,124 861,185 822,184'}
];
/* Paths are schematic polylines following the white road network; exact distances unverified. */
d.nodes={
gate:[684,486],main:[686,438],west:[544,424],cross:[462,406],p1junction:[420,389],dormjunction:[288,341],
southwest:[408,466],midnorth:[545,314],northwest:[465,270],center:[641,382],northeast:[743,316],
east:[899,334],eastloop:[971,351],farEast:[1074,364],upper:[756,210],sportjunction:[820,207],
dorm:[160,399],p1node:[364,330],cafeteria:[390,472],management:[494,310],p2node:[685,278],p3node:[852,402],workshop:[1000,408],gym:[777,153],pool:[840,155],
toranj:[831,420],artOffice:[891,398],artStudio:[868,441],photography:[668,275],fashion:[715,271],general:[363,324],education:[377,345],library:[342,354],sculpture:[1015,415],printshop:[995,412],sports:[773,155],greenhouse:[1065,190]
};
d.edges=[
['gate','main'],['main','west'],['main','center'],['west','cross'],['cross','p1junction'],['p1junction','dormjunction'],['dormjunction','dorm'],['cross','southwest'],['southwest','cafeteria'],
['p1junction','p1node'],['p1node','general'],['p1node','education'],['p1node','library'],['cross','northwest'],['northwest','midnorth'],['midnorth','management'],['midnorth','center'],
['center','northeast'],['northeast','east'],['northeast','upper'],['upper','sportjunction'],['sportjunction','gym'],['sportjunction','pool'],['upper','p2node'],
['p2node','photography'],['p2node','fashion'],['east','eastloop'],['eastloop','farEast'],['eastloop','p3node'],['p3node','toranj'],['p3node','artOffice'],['p3node','artStudio'],
['farEast','workshop'],['workshop','printshop'],['workshop','sculpture'],['gym','sports'],['farEast','greenhouse']
];
d.origins=[
{id:'gate',label:'ورودی اصلی دانشگاه'},{id:'p1node',label:'فاز ۱'},{id:'p2node',label:'فاز ۲'},{id:'p3node',label:'فاز ۳'},
{id:'dorm',label:'خوابگاه‌ها'},{id:'cafeteria',label:'سلف'},{id:'management',label:'ساختمان مدیریت'},
{id:'workshop',label:'کارگاه چاپ و باشگاه'},{id:'gym',label:'سالن ورزشی'},{id:'pool',label:'استخر'}
];
const additions=[
{id:'dorms',name:'خوابگاه‌ها',node:'dorm',phase:null,category:'اقامتی',tag:'محدوده ۱',summary:'محدوده خوابگاه‌ها در غرب نقشه؛ نام ساختمان‌ها و محل ورودی نیازمند بررسی است.'},
{id:'management',name:'ساختمان مدیریت',node:'management',phase:null,category:'اداری',tag:'محدوده ۴',summary:'محل ساختمان مدیر دانشگاه و بخش‌های وابسته؛ فهرست اتاق‌ها هنوز ثبت نشده است.'}
];
for(const a of additions)if(!d.buildings.some(b=>b.id===a.id))d.buildings.push({...a,x:d.nodes[a.node][0],y:d.nodes[a.node][1],w:50,h:45,shape:'rect',features:['اطلاعات در حال تکمیل'],dataStatus:'جانمایی کلی از نقشه دانشجو؛ جزئیات تایید نشده',floors:[],faculty:[]});
const pos={
toranj:'toranj','art-office':'artOffice','art-studio':'artStudio',photography:'photography',fashion:'fashion',general:'general',education:'education',library:'library',
sculpture:'sculpture',printshop:'printshop',sports:'sports',pool:'pool',greenhouse:'greenhouse',cafeteria:'cafeteria'
};
for(const b of d.buildings){
if(pos[b.id]){b.node=pos[b.id];b.x=d.nodes[b.node][0];b.y=d.nodes[b.node][1];}
if(b.id==='printshop'||b.id==='sports'||b.id==='sculpture')b.phase=null;
if(b.id==='greenhouse')b.summary='گلخانه در تصاویر اولیه ذکر شده، اما در نقشه شماره‌گذاری‌شده اخیر جانمایی تایید نشده است.';
if(b.id==='toranj')b.dataStatus='وابستگی به فاز ۳ از توضیحات دانشجو؛ مختصات و کلاس‌ها فعلا نمایشی';
}
d.faq=d.faq.map(f=>f.id==='q6'?{...f,a:'کارگاه چاپ در محدوده شماره ۷ و شرق دانشگاه مشخص شده است. مسیر روی شبکه شماتیک نشان داده می‌شود.'}:f.id==='q9'?{...f,a:'سلف در محدوده شماره ۳ و در جنوب فاز یک مشخص شده است؛ در راهنما مسیر پیشنهادی را ببین.'}:f.id==='q10'?{...f,a:'سالن ورزشی و استخر به ترتیب در محدوده‌های ۸ و ۹ در شمال شرقی دانشگاه هستند.'}:f);
d.faq.push(
{id:'survey1',q:'خوابگاه‌ها کجاست؟',a:'در محدوده شماره ۱، سمت غرب نقشه است. محل ورودی ساختمان‌ها هنوز بررسی نشده است.',destination:'dorms',tags:['خوابگاه','سکونت']},
{id:'survey2',q:'ساختمان مدیریت کجاست؟',a:'ساختمان مدیریت محدوده شماره ۴ در میانه دانشگاه است. جزئیات دفترها هنوز ثبت نشده‌اند.',destination:'management',tags:['مدیر','ریاست','اداری']},
{id:'survey3',q:'سالن ورزشی کجاست؟',a:'سالن ورزشی در محدوده ۸ نزدیک استخر در شمال شرقی نقشه قرار دارد.',destination:'sports',tags:['ورزش','سالن']}
);
})();