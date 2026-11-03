/*
 * راه من / نمونه نمایشی مستقل از اینترنت
 * داده‌های اتاق‌ها، شماره‌ها، اساتید، مختصات ساختمان‌ها و مسیرهای داخلی
 * برای نمایش کامل MVP فرضی هستند؛ همه باید پیش از استفاده عمومی بررسی شوند.
 */
window.CAMPUS_DB = {
  meta: {name:'دانشگاه ملی مهارت شریعتی تهران', version:'MVP 1.0', source:'نقشه عمومی ارسالی و توضیحات دانشجو', lastReview:'نیازمند تایید میدانی', demo:true},
  phases: [
    {id:'p1', number:'۰۱',name:'فاز یک', tag:'دروس عمومی', color:'#07509B', description:'محل برگزاری بخش بزرگی از کلاس‌های عمومی و چند خدمت دانشگاهی؛ توزیع دقیق ساختمان‌ها نیازمند تایید است.', buildings:['general','education','library']},
    {id:'p2', number:'۰۲',name:'فاز دو', tag:'عکاسی و کارگاه‌ها', color:'#91B9A2', description:'فضاهای مرتبط با عکاسی، چاپ دستی و طراحی و دوخت، مطابق تجربه دانشجویان.', buildings:['photography','fashion']},
    {id:'p3', number:'۰۳',name:'فاز سه', tag:'گروه هنر', color:'#E8A9BA', description:'کانون فعالیت گروه هنر و دفتر گروه؛ تمرکز اصلی این نسخه آزمایشی.', buildings:['toranj','art-office','art-studio']},
    {id:'p4', number:'۰۴',name:'فاز چهار', tag:'چاپ دستی و ورزش', color:'#E8C786', description:'کارگاه‌های چاپ دستی و مجسمه‌سازی و چند فضای ورزشی؛ جانمایی دقیق نمایشی است.', buildings:['sculpture','printshop','sports']}
  ],
  /* xy are VECTOR DEMO coordinates (not land-survey accuracy) */
  nodes: {
    gate:[770,552],main:[770,482],east:[890,458],farEast:[1014,439],
    center:[650,448],mid:[550,408],artCross:[450,382],artQuad:[373,343],west:[261,363],farWest:[150,388],
    northMid:[607,306],northEast:[822,323],northWest:[428,266],southWest:[305,453],southMid:[550,499],
    p1node:[900,390],p2node:[560,345],p3node:[402,343],p4node:[176,368],
    toranj:[348,308],artOffice:[458,330],artStudio:[370,419],
    general:[935,374],education:[865,339],library:[728,365],
    photography:[578,307],fashion:[504,274],
    sculpture:[193,354],printshop:[224,423],sports:[1084,436],
    pool:[1076,302],greenhouse:[1030,172],cafeteria:[1000,418]
  },
  edges: [
    ['gate','main'],['main','center'],['main','east'],['east','farEast'],['farEast','sports'],['farEast','cafeteria'],
    ['center','mid'],['mid','artCross'],['artCross','artQuad'],['artCross','southMid'],['southMid','center'],
    ['artQuad','west'],['west','farWest'],['west','southWest'],['southWest','artCross'],
    ['center','northMid'],['northMid','northEast'],['northEast','east'],['northMid','northWest'],['northWest','artQuad'],
    ['east','p1node'],['p1node','general'],['p1node','education'],['northEast','education'],['northEast','library'],['center','library'],
    ['mid','p2node'],['p2node','photography'],['northMid','photography'],['northWest','fashion'],['fashion','p2node'],
    ['artQuad','p3node'],['p3node','toranj'],['p3node','artOffice'],['artCross','artOffice'],['artCross','artStudio'],
    ['farWest','p4node'],['p4node','sculpture'],['west','printshop'],
    ['farEast','pool'],['pool','greenhouse'],['northEast','pool']
  ],
  origins:[
    {id:'gate',label:'ورودی اصلی دانشگاه'},
    {id:'p3node',label:'محوطه فاز ۳'},
    {id:'toranj',label:'ساختمان ترنج'},
    {id:'p2node',label:'محوطه فاز ۲'},
    {id:'p1node',label:'محوطه فاز ۱'},
    {id:'library',label:'کتابخانه (نمونه)'},
    {id:'p4node',label:'محوطه فاز ۴'}
  ],
  buildings:[
    {id:'toranj',node:'toranj',phase:'p3',name:'ساختمان ترنج',tag:'مرکز نمونه پروژه',category:'آموزشی / هنر',summary:'ساختمان دوطبقه؛ راهنمای کلاس‌ها، آتلیه‌ها و دفاتر در این MVP به صورت نمونه پیاده‌سازی شده است.',features:['۲ طبقه','کلاس و آتلیه','راهنمای داخلی'],dataStatus:'مکان و نام بنا از دانشجو؛ فهرست اتاق‌ها نمایشی',x:348,y:308,shape:'rect',w:80,h:61,
      floors:[
        {id:'0',label:'طبقه همکف',note:'چیدمان صرفا نمونه است؛ باید با بازدید از ساختمان تطبیق داده شود.',rooms:[
          {id:'t101',name:'آتلیه طراحی ۱',code:'T-101',type:'studio',x:98,y:120,w:150,h:110},
          {id:'t102',name:'کلاس تئوری ۱۰۲',code:'T-102',type:'class',x:270,y:120,w:136,h:110},
          {id:'t103',name:'دفتر گروه هنر',code:'T-103',type:'office',x:430,y:120,w:170,h:110},
          {id:'t104',name:'کارگاه پایه',code:'T-104',type:'studio',x:98,y:330,w:150,h:100},
          {id:'t105',name:'کلاس ۱۰۵',code:'T-105',type:'class',x:270,y:330,w:136,h:100},
          {id:'t106',name:'خدمات و انبار',code:'T-106',type:'service',x:430,y:330,w:170,h:100}
        ]},
        {id:'1',label:'طبقه اول',note:'شماره‌ها و کاربری‌ها در این طبقه نمونه نمایشی‌اند.',rooms:[
          {id:'t201',name:'آتلیه گرافیک',code:'T-201',type:'studio',x:98,y:120,w:150,h:110},
          {id:'t202',name:'کلاس ۲۰۲',code:'T-202',type:'class',x:270,y:120,w:136,h:110},
          {id:'t203',name:'دفتر اساتید',code:'T-203',type:'office',x:430,y:120,w:170,h:110},
          {id:'t204',name:'آتلیه تصویرسازی',code:'T-204',type:'studio',x:98,y:330,w:150,h:100},
          {id:'t205',name:'کلاس ۲۰۵',code:'T-205',type:'class',x:270,y:330,w:136,h:100},
          {id:'t206',name:'اتاق جلسات',code:'T-206',type:'office',x:430,y:330,w:170,h:100}
        ]}
      ],
      faculty:[
        {name:'استاد نمونه الف',role:'گرافیک',office:'T-203',days:'زمان حضور: قابل ثبت',demo:true},
        {name:'استاد نمونه ب',role:'طراحی پایه',office:'T-203',days:'زمان حضور: قابل ثبت',demo:true},
        {name:'استاد نمونه ج',role:'تصویرسازی',office:'T-206',days:'زمان حضور: قابل ثبت',demo:true},
        {name:'استاد نمونه د',role:'مدیریت گروه',office:'T-103',days:'زمان حضور: قابل ثبت',demo:true}
      ]
    },
    {id:'art-office',node:'artOffice',phase:'p3',name:'دفتر گروه هنر',tag:'اداری / هنر',category:'اداری',summary:'مرجع پیگیری مسائل گروه هنر؛ محل و شماره دقیق اتاق باید میدانی تایید شود.',x:458,y:330,shape:'rect',w:61,h:44,features:['پیگیری امور گروه','پرسش از مدیر گروه'],dataStatus:'حضور در فاز ۳ از توضیحات دانشجو؛ موقعیت دقیق نمایشی',floors:[{id:'0',label:'طبقه همکف',rooms:[{id:'a101',code:'A-01',name:'دفتر گروه - نمونه',type:'office',x:200,y:140,w:300,h:170}]}],faculty:[]},
    {id:'art-studio',node:'artStudio',phase:'p3',name:'آتلیه‌های هنر',tag:'فضای آموزشی',category:'آتلیه',summary:'مجموعه آموزشی هنر؛ نام و محل دقیق کلاس‌ها نیازمند بررسی است.',x:370,y:419,shape:'rect',w:66,h:49,features:['آتلیه','کلاس عملی'],dataStatus:'نمایشی',floors:[],faculty:[]},
    {id:'photography',node:'photography',phase:'p2',name:'فضاهای عکاسی',tag:'عکاسی',category:'کارگاه',summary:'محل برگزاری بخش مهمی از درس‌های عکاسی در فاز ۲؛ ساختمان دقیق نمایشی است.',x:578,y:307,shape:'rect',w:91,h:70,features:['عکاسی','کارگاه'],dataStatus:'کاربری فاز بر اساس توضیحات دانشجو؛ ساختمان نمایشی',floors:[],faculty:[]},
    {id:'fashion',node:'fashion',phase:'p2',name:'طراحی و دوخت',tag:'کارگاه',category:'آموزشی',summary:'بخشی از فضاهای رشته‌های طراحی و دوخت؛ موقعیت دقیق نیازمند تایید.',x:504,y:274,shape:'rect',w:65,h:55,features:['طراحی لباس','آموزش عملی'],dataStatus:'نمایشی',floors:[],faculty:[]},
    {id:'general',node:'general',phase:'p1',name:'ساختمان دروس عمومی',tag:'آموزشی',category:'آموزشی',summary:'نمونه ساختمان کلاس‌های عمومی در فاز ۱؛ نام و جانمایی دقیق باید تایید شود.',x:935,y:374,shape:'rect',w:99,h:73,features:['کلاس‌های عمومی'],dataStatus:'نمایشی',floors:[],faculty:[]},
    {id:'education',node:'education',phase:'p1',name:'دفتر آموزش',tag:'خدمات دانشجویی',category:'اداری',summary:'نقطه نمایشی برای پاسخ به سوال «دفتر آموزش کجاست؟»؛ موقعیت واقعی هنوز تایید نشده.',x:865,y:339,shape:'rect',w:75,h:60,features:['درخواست آموزشی','پیگیری واحدها'],dataStatus:'مکان فرضی صرفا برای تست MVP',floors:[{id:'0',label:'همکف (نمونه)',rooms:[{id:'e01',code:'E-01',name:'پذیرش آموزش',type:'office',x:200,y:140,w:300,h:170}]}],faculty:[]},
    {id:'library',node:'library',phase:'p1',name:'کتابخانه',tag:'خدمات فرهنگی',category:'خدمات',summary:'برای پیدا کردن منابع و محل مطالعه؛ مکان نقطه روی نقشه نمونه است.',x:728,y:365,shape:'rect',w:76,h:66,features:['مطالعه','امانت کتاب'],dataStatus:'وجود خدمات از ویژه‌نامه؛ جای نقطه نمایشی',floors:[],faculty:[]},
    {id:'sculpture',node:'sculpture',phase:'p4',name:'کارگاه مجسمه‌سازی',tag:'کارگاه',category:'کارگاه',summary:'یکی از کارگاه‌های ذکرشده در فاز ۴؛ موقعیت داخلی دقیق هنوز ثبت نشده.',x:193,y:354,shape:'rect',w:69,h:56,features:['مجسمه‌سازی'],dataStatus:'کاربری فاز از توضیحات دانشجو؛ ساختمان نمایشی',floors:[],faculty:[]},
    {id:'printshop',node:'printshop',phase:'p4',name:'چاپ دستی',tag:'کارگاه',category:'کارگاه',summary:'کارگاه چاپ دستی در فاز ۴؛ اطلاعات ساختمان و زمان استفاده نمونه است.',x:224,y:423,shape:'rect',w:62,h:53,features:['چاپ دستی'],dataStatus:'کاربری فاز از توضیحات دانشجو؛ نقطه نمایشی',floors:[],faculty:[]},
    {id:'sports',node:'sports',phase:'p4',name:'سالن ورزشی',tag:'ورزشی',category:'خدمات',summary:'دسترسی به فضاهای ورزشی؛ محل نشانگر روی نقشه نمایشی است.',x:1084,y:436,shape:'rect',w:77,h:57,features:['ورزش'],dataStatus:'نمایشی',floors:[],faculty:[]},
    {id:'pool',node:'pool',phase:null,name:'استخر',tag:'ورزش',category:'خدمات',summary:'فضای ورزشی پشت فازها، مطابق توضیحات دانشجو؛ مکان دقیق تایید نشده.',x:1076,y:302,shape:'ellipse',w:74,h:48,features:['استخر'],dataStatus:'محل نمایشی',floors:[],faculty:[]},
    {id:'greenhouse',node:'greenhouse',phase:null,name:'گلخانه',tag:'آموزشی / گیاه‌شناسی',category:'خدمات',summary:'فضای مربوط به رشته‌های گیاه‌شناسی در پشت فازها؛ محدوده نمونه است.',x:1030,y:172,shape:'rect',w:88,h:64,features:['گیاه‌شناسی'],dataStatus:'محل نمایشی',floors:[],faculty:[]},
    {id:'cafeteria',node:'cafeteria',phase:null,name:'سلف دانشجویی',tag:'خدمات رفاهی',category:'خدمات',summary:'محل نمونه برای نمایش مسیریابی به سلف؛ موقعیت واقعی باید مشخص شود.',x:1000,y:418,shape:'rect',w:71,h:53,features:['غذا','رفاه'],dataStatus:'محل نمایشی',floors:[],faculty:[]}
  ],
  faq:[
    {id:'q1',q:'دفتر آموزش کجاست؟',a:'در نسخه نمایشی می‌توانی مسیر «دفتر آموزش» را روی نقشه ببینی. نقطه دقیق دفتر آموزش هنوز باید از دانشگاه استعلام شود.',destination:'education',tags:['آموزش','اداری','واحد']},
    {id:'q2',q:'چطور به ساختمان ترنج برسم؟',a:'مبدا را انتخاب کن، سپس «نمایش مسیر» را بزن. با ورود به صفحه ترنج، فهرست دو طبقه هم نمایش داده می‌شود.',destination:'toranj',tags:['ترنج','فاز ۳','کلاس']},
    {id:'q3',q:'دفتر مدیر گروه هنر کجاست؟',a:'طبق اطلاعات دانشجو، دفتر گروه هنر در فاز ۳ است. اتاق مشخص در این MVP صرفا نمایشی است و نیاز به بررسی دارد.',destination:'art-office',tags:['مدیر گروه','اساتید','هنر']},
    {id:'q4',q:'کلاس‌های عمومی معمولا کجاست؟',a:'طبق توضیح دانشجو، بیشتر درس‌های عمومی در فاز ۱ برگزار می‌شوند. برای کلاس مشخص، برنامه هفتگی ملاک است.',destination:'general',tags:['فاز یک','دروس عمومی']},
    {id:'q5',q:'کارگاه عکاسی کجاست؟',a:'بر اساس توضیحات دانشجو، فاز ۲ از محل‌های اصلی درس‌های عکاسی است. نشانه این ساختمان روی نقشه نمایشی است.',destination:'photography',tags:['دوربین','عکاسی','فاز دو']},
    {id:'q6',q:'کارگاه چاپ دستی را چطور پیدا کنم؟',a:'کارگاه چاپ دستی در فاز ۴ نیز وجود دارد. برای پیدا کردن مسیر از مبدا انتخابی، راهنمای تصویری را باز کن.',destination:'printshop',tags:['چاپ دستی','هنر','فاز چهار']},
    {id:'q7',q:'کارگاه مجسمه‌سازی کجاست؟',a:'طبق توضیحات دانشجو، فاز ۴ شامل کارگاه مجسمه‌سازی است.',destination:'sculpture',tags:['مجسمه','فاز ۴']},
    {id:'q8',q:'کتابخانه دانشگاه کجاست؟',a:'بخش کتابخانه در راهنما دیده می‌شود؛ محل نشانگر فعلا آزمایشی است.',destination:'library',tags:['کتاب','مطالعه']},
    {id:'q9',q:'سلف دانشگاه را از کجا پیدا کنم؟',a:'می‌توانی مسیر سلف را در نمونه تعاملی ببینی. قبل از نصب عمومی باید نشانه آن تایید شود.',destination:'cafeteria',tags:['غذا','ناهار']},
    {id:'q10',q:'استخر و باشگاه کجاست؟',a:'مطابق توضیحات دانشجو، بخشی از فضاهای ورزشی پشت فازها قرار دارند. موقعیت دقیق روی نقشه نمایشی است.',destination:'pool',tags:['ورزش','باشگاه']},
    {id:'q11',q:'اساتید هنر کجا دفتر دارند؟',a:'در صفحه ساختمان ترنج، تب «اساتید و اتاق‌ها» نمونه‌ای از یک دفترچه قابل جست‌وجوی استادان وجود دارد؛ داده‌ها ساختگی‌اند.',destination:'toranj',openFaculty:true,tags:['اساتید','اتاق استاد','دفتر']},
    {id:'q12',q:'اگر شماره کلاس را بدانم چه کار کنم؟',a:'نام کلاس یا کد نمونه مثل T-203 را جست‌وجو کن؛ صفحه ساختمان و طبقه مربوط باز می‌شود.',destination:'toranj',tags:['شماره کلاس','کد اتاق']}
  ],
  helpLinks:[
    {label:'امور آموزشی و انتخاب واحد',detail:'سامانه‌های معرفی‌شده در ویژه‌نامه باید از سایت فعلی دانشگاه بررسی شوند.',icon:'book'},
    {label:'کتابخانه و منابع',detail:'قوانین امانت و ساعات جدید را پیش از انتشار نهایی تایید کنید.',icon:'library'},
    {label:'امور دانشجویی',detail:'سلف، فعالیت‌های فرهنگی و خدمات رفاهی.',icon:'users'},
    {label:'انجمن‌ها و فعالیت‌های دانشجویی',detail:'امکان افزودن تماس انجمن‌های مرتبط با رشته.',icon:'spark'}
  ]
};
