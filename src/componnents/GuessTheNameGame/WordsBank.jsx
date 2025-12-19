export const words = {
  fa: {
    country: {
      easy: [
        "ایران","عراق","چین","هند","ترکیه","قطر","عمان","مصر","ژاپن","کنیا",
        "لیبی","مالی","نپال","پرو","سودان","سوئد","سوریه","یمن","کوبا","لاوس"
      ],
      medium: [
        "المان","فرانسه","ایتالیا","اسپانیا","پرتغال","نروژ","فنلاند","لهستان","رومانی","بلغارستان",
        "مجارستان","یونان","اوکراین","روسیه","صربستان","سنگاپور","تایلند","مالزی","پاکستان","فیلیپین"
      ],
      hard: [
        "اذربایجان","قزاقستان","تاجیکستان","لوکزامبورگ","لیختناشتاین","ماداگاسکار","قرقیزستان","ترکمنستان","سریلانکا","کاستاریکا",
        "ونزوئلا","نیجریه","اتیوپی","زیمبابوه","موزامبیک","کامبوج","السالوادور","نیکاراگوئه","گواتمالا","هندوراس"
      ]
    },

    color: {
      easy: [
        "قرمز","ابی","سبز","زرد","سفید","مشکی","صورتی","بنفش","نقره","طلایی",
        "قهوه‌ای","نارنجی","کرم","سرمه‌ای","لاجوردی","زیتونی","نیلی","یشمی","ارغوانی","خاکستری"
      ].map(w => w.replace("‌","")),
      medium: [
        "فیروزه‌ای","زرشکی","بادمجانی","خرمایی","کبود","دودی","صدفی","گلبهی","یشمیسیر","سبزپسته‌ای",
        "ابیاسمانی","ابیاری","سبزسدری","کرمسیر","قهوه‌ایسوخته","نارنجیتیره","بنفشسیر","زردلیمویی","صورتیچرک","سبزارتشی"
      ].map(w => w.replace("‌","")),
      hard: [
        "لاجوردسیر","زرشکیسیر","دودیسیر","نفتی","نیلیسیر","کبودسیر","صدفیسیر","برنزی","مسی","کهربایی",
        "یشمیسیر","سبززیتونی","ابیلاجوردی","قرمزشرابی","بنفشبادمجانی","قهوه‌ایتلخ","نقره‌ایمات","طلاییمات","خاکستریتیره","سبزیشمی"
      ].map(w => w.replace("‌",""))
    },

    sport: {
      easy: [
        "فوتبال","تنیس","والیبال","بسکتبال","شنا","دو","کشتی","جودو","کاراته","بوکس",
        "گلف","بیسبال","اسکواش","بدمینتون","اسکی","اسنوبرد","تکواندو","قایقرانی","دوچرخه","تیراندازی"
      ],
      medium: [
        "فوتسال","هندبال","واترپلو","راگبی","کریکت","ژیمناستیک","کوهپیمایی","سنگنوردی","پارکور","اسنوبرد",
        "اسنوکر","بولینگ","دارت","شمشیربازی","اسکیت","موتورسواری","کانو","روئینگ","اسکیتسرعت","اسکیتنمایشی"
      ],
      hard: [
        "ماراتن","بیاتلون","ترایاتلون","پنتاتلون","بادسواری","کایتسواری","یخنوردی","غارنوردی","موتوکراس","فرمولیک",
        "اتومبیلرانی","اسکیتبرد","اسکیترویخ","پاراشنا","غواصی","کوهنوردی","اسکیصحرانوردی","اسکیتکراس","واترپولو","شناموزون"
      ]
    },

    fruit: {
      easy: [
        "سیب","موز","هلو","انگور","کیوی","گلابی","لیمو","خرما","انار","هندوانه",
        "طالبی","خربزه","گیلاس","الو","زردالو","نارگیل","انبه","پاپایا","گواوا","لیچی"
      ],
      medium: [
        "توتفرنگی","بلوبری","تمشک","زغالاخته","شاهتوت","کرنبری","پشنفروت","گریفروت","نکتارین","پرتقال",
        "نارنگی","کلمانتین","پوملو","کامکوات","درگونفروت","رامبوتان","لانگان","سالاک","فیسالیس","اکای"
      ],
      hard: [
        "بلکبری","گوجیبری","مولبری","الدربری","هاکلبری","بویسنبری","جامون","ساپودیلا","چیکو","ماراکوجا",
        "سورسوب","کاستارداپل","جکفروت","دوریان","ابیو","کانستلو","لونگانبری","میراکلفروت","کوپواچو","اکی"
      ]
    }
  },

  en: {
    country: {
      easy: [
        "iran","iraq","china","india","turkey","qatar","oman","egypt","japan","kenya",
        "libya","mali","nepal","peru","sudan","sweden","syria","yemen","cuba","laos"
      ],
      medium: [
        "germany","france","italy","spain","portugal","norway","finland","poland","romania","bulgaria",
        "hungary","greece","ukraine","russia","serbia","singapore","thailand","malaysia","pakistan","philippines"
      ],
      hard: [
        "azerbaijan","kazakhstan","tajikistan","luxembourg","liechtenstein","madagascar","kyrgyzstan","turkmenistan","srilanka","costarica",
        "venezuela","nigeria","ethiopia","zimbabwe","mozambique","cambodia","elsalvador","nicaragua","guatemala","honduras"
      ]
    },

    color: {
      easy: [
        "red","blue","green","yellow","white","black","pink","purple","silver","gold",
        "orange","brown","gray","navy","olive","cyan","teal","indigo","beige","maroon"
      ],
      medium: [
        "turquoise","magenta","lavender","coral","mint","peach","plum","amber","ivory","khaki",
        "charcoal","crimson","emerald","sapphire","bronze","copper","jade","ruby","topaz","obsidian"
      ],
      hard: [
        "chartreuse","aquamarine","periwinkle","cerulean","vermilion","fuchsia","ultramarine","viridian","sepia","taupe",
        "ecru","saffron","ochre","alabaster","eggshell","gunmetal","heliotrope","malachite","smaragdine","zinnwaldite"
      ]
    },

    sport: {
      easy: [
        "soccer","tennis","volleyball","basketball","swimming","running","wrestling","judo","karate","boxing",
        "golf","baseball","squash","badminton","skiing","snowboarding","taekwondo","canoeing","cycling","shooting"
      ],
      medium: [
        "futsal","handball","waterpolo","rugby","cricket","gymnastics","hiking","climbing","parkour","snooker",
        "bowling","darts","fencing","skating","motorsport","rowing","kayaking","surfing","archery","skicross"
      ],
      hard: [
        "marathon","biathlon","triathlon","pentathlon","windsurfing","kitesurfing","iceclimbing","caving","motocross","formulaone",
        "autoracing","skateboarding","rollerskating","freediving","mountaineering","ultramarathon","snowkiting","speedskating","curling","powerlifting"
      ]
    },

    fruit: {
      easy: [
        "apple","banana","peach","grape","kiwi","pear","lemon","date","pomegranate","watermelon",
        "melon","cantaloupe","cherry","plum","apricot","coconut","mango","papaya","guava","lychee"
      ],
      medium: [
        "strawberry","blueberry","raspberry","cranberry","blackcurrant","passionfruit","grapefruit","nectarine","orange","mandarin",
        "tangerine","clementine","pomelo","kumquat","dragonfruit","rambutan","longan","salak","physalis","acai"
      ],
      hard: [
        "blackberry","gojiberry","mulberry","elderberry","huckleberry","boysenberry","jamun","sapodilla","chikoo","maracuja",
        "soursop","custardapple","jackfruit","durian","abiu","canistel","lucuma","miraclefruit","cupuaçu","ackee"
      ]
    }
  }
};