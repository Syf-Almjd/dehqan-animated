// Dehqan Farms catalogue (Export Catalogue 2026, EN/AR).
// Used as the fallback when Supabase isn't configured, and to generate supabase/seed.sql.
// NOTE: the catalogue has no prices – price_cents / stock below are PLACEHOLDERS. Edit them in /admin.
import type { Category, Coupon, Product, Review } from "./types";

export const BRAND = {
  name: "Dehqan Farms",
  name_ar: "دهقان فارمز",
  company: "Dehqan Farms Export",
  company_ar: "دهقان فارمز للتصدير",
  tagline: "From the Farmer’s Hand",
  tagline_ar: "من يد المزارع",
  intro: "We represent a growing network of major farmers across Afghanistan’s key growing zones. We buy directly from the farm, so the profit reaches the farmer first-hand.",
  intro_ar: "نمثّل شبكة متنامية من كبار المزارعين في أهم مناطق الزراعة في أفغانستان. نشتري مباشرةً من المزرعة، ليكون الربح للمزارع أولًا وبلا وسطاء.",
  email: "rouhullahsayed@gmail.com",
  phone: "+60 11-2191 1840",
  whatsapp: "https://wa.me/601121911840",
  catalogue: "/dehqan-farms-catalogue-2026.pdf",
};

const AF = { origin: "Afghanistan", origin_ar: "أفغانستان" };
const KDH = { origin: "Kandahar & other regions", origin_ar: "قندهار ومناطق أخرى" };

export const demoCategories: Category[] = [
  {
    id: "raisins", slug: "raisins", name: "Raisins", name_ar: "زبيب أفغانستان",
    kicker: "Dried grapes", kicker_ar: "العنب المجفف",
    description: "Led by the world-famous raisins of Kandahar, and sourced from other fine growing regions across Afghanistan.",
    description_ar: "يتصدرها زبيب قندهار المشهور عالمياً، إلى جانب أصناف من مناطق زراعة أخرى في أنحاء أفغانستان.",
    image_url: "/products/about-raisins.jpg", color: "#c99a2e",
    notes: [{
      title: "Grades, qualities & types", title_ar: "الدرجات والجودات والأنواع",
      body: "Our raisins come in a wide range of grades, qualities and types, each selected and prepared to match the preferences of our buyers.",
      body_ar: "يتوفر زبيبنا بمجموعة واسعة من الدرجات والجودات والأنواع، ويُنتقى ويُجهَّز كلٌّ منها بما يلائم رغبات المشترين.",
    }],
  },
  {
    id: "dried-fruits", slug: "dried-fruits", name: "Dried Fruits", name_ar: "الفواكه المجففة",
    kicker: "Apricots · Figs · Mulberries", kicker_ar: "المشمش · التين · التوت",
    description: "Naturally sun-dried in the Afghan sun, with no compromise on taste.",
    description_ar: "مجففة طبيعياً تحت الشمس الأفغانية، دون أي تنازل عن الطعم.",
    image_url: "/products/golden-apricots.jpg", color: "#e07b1f",
    notes: [{
      title: "Figs: grades, qualities & types", title_ar: "التين: الدرجات والجودات والأنواع",
      body: "Our figs are available in various grades, qualities and types, chosen to suit the taste and requirements of each buyer.",
      body_ar: "يتوفر تيننا بدرجات وجودات وأنواع متعددة، تُختار بما يناسب ذوق كل مشترٍ ومتطلباته.",
    }],
  },
  {
    id: "nuts-seeds", slug: "nuts-seeds", name: "Nuts & Seeds", name_ar: "المكسرات والبذور",
    kicker: "Almonds · Walnuts · Pine nuts · Black seed", kicker_ar: "اللوز · الجوز · الصنوبر · الحبة السوداء",
    description: "Crisp, fresh and full of flavour; sorted and packed with care.",
    description_ar: "مقرمشة وطازجة وغنية بالنكهة، تُفرز وتُعبأ بعناية.",
    image_url: "/products/almond-kernels.jpg", color: "#9a6b3f",
  },
  {
    id: "saffron", slug: "saffron", name: "Saffron", name_ar: "الزعفران",
    kicker: "Herat · Red gold", kicker_ar: "هرات · الذهب الأحمر",
    description: "Grade A+, 100% handpicked saffron threads from Herat, known worldwide as red gold.",
    description_ar: "زعفران من الدرجة +A مقطوف يدوياً بنسبة 100% من هرات، يُعرف عالمياً بالذهب الأحمر.",
    image_url: "/products/saffron-front.jpg", color: "#b3261e",
    notes: [{
      title: "Handpicked Herati Saffron", title_ar: "زعفران هرات المقطوف يدوياً",
      body: "Saffron is the dried stigma of the saffron crocus, picked by hand, flower by flower. Prized worldwide as “red gold”, it gives dishes a golden colour, a rich aroma and a distinctive flavour. Our Herati saffron is hand-picked on family farms and offered as Grade A+, ideal for rice dishes, desserts, tea and drinks.",
      body_ar: "الزعفران هو المياسم المجففة لزهرة الزعفران، تُقطف يدوياً زهرةً بعد زهرة. ويُعرف عالمياً بـ«الذهب الأحمر»، إذ يمنح الأطباق لوناً ذهبياً وعطراً غنياً ونكهة مميزة. زعفران هرات لدينا مقطوف يدوياً من مزارع عائلية ويُقدَّم بدرجة +A، مثالي لأطباق الأرز والحلويات والشاي والمشروبات.",
    }],
  },
  {
    id: "honey", slug: "honey", name: "Mountain Honey", name_ar: "العسل الجبلي",
    kicker: "Badakhshan & Takhar", kicker_ar: "بدخشان وتخار",
    description: "Pure honey from the high mountain meadows of Badakhshan and Takhar, far from industrial farming.",
    description_ar: "عسل صافٍ من المروج الجبلية العالية في بدخشان وتخار، بعيداً عن الزراعة الصناعية.",
    image_url: "/products/honey-amber.jpg", color: "#d08a12",
    notes: [
      {
        title: "Pure, naturally harvested", title_ar: "صافٍ ويُحصد طبيعياً",
        body: "Honey gathered from the high mountain meadows of Badakhshan and Takhar: thick, aromatic and naturally harvested, with the character of the wild alpine flowers on which the bees feed.",
        body_ar: "عسل يُجنى من المروج الجبلية العالية في بدخشان وتخار: كثيف القوام وعطري ويُحصد طبيعياً، يحمل طابع أزهار الجبال البرية التي يتغذى عليها النحل.",
      },
      {
        title: "Why Badakhshan & Takhar?", title_ar: "لماذا بدخشان وتخار؟",
        body: "Badakhshan and Takhar, in north-eastern Afghanistan, are among the most remote and unspoiled mountain regions in the world. Their high-altitude pastures and clean mountain air give the honey a distinctive character that buyers around the world look for.",
        body_ar: "تُعدّ بدخشان وتخار في شمال شرق أفغانستان من أكثر المناطق الجبلية عزلةً وبكارةً في العالم، وتمنح مراعيها المرتفعة وهواؤها الجبلي النقي العسلَ طابعاً مميزاً يبحث عنه المشترون حول العالم.",
      },
    ],
  },
  {
    id: "shilajit", slug: "shilajit", name: "Shilajit", name_ar: "الشيلاجيت",
    kicker: "Mountain resin", kicker_ar: "راتنج الجبال",
    description: "Pure Shilajit of Badakhshan, known locally as Mumiyai.",
    description_ar: "شيلاجيت بدخشان الصافي، المعروف محلياً باسم «موميايي».",
    image_url: "/products/shilajit.jpg", color: "#2a2420",
    notes: [
      {
        title: "What is Shilajit?", title_ar: "ما هو الشيلاجيت؟",
        body: "Shilajit is a natural, tar-like substance that seeps from rock crevices in high mountain ranges such as the Himalayas, Hindu Kush, Pamir and Altai. It forms slowly, over centuries, from compressed plant matter and minerals, and is rich in humic and fulvic substances and trace minerals. Known as mumijo or mumiyai in Central Asia and Afghanistan, it has been used in traditional medicine for generations, including Ayurveda.",
        body_ar: "الشيلاجيت مادة طبيعية لزجة تشبه القار، تتسرّب من شقوق الصخور في سلاسل الجبال العالية مثل الهيمالايا والهندوكوش والبامير وألتاي. تتكوّن ببطء على مدى قرون من بقايا النباتات والمعادن المتراكمة، وهي غنية بالأحماض الدبالية (الهيوميك والفولفيك) والمعادن الدقيقة. ويُعرف في آسيا الوسطى وأفغانستان باسم «موميو» أو «موميايي»، وقد استُخدم في الطب التقليدي منذ أجيال، ومنه الطب الأيورفيدي.",
      },
      {
        title: "Shilajit of Badakhshan", title_ar: "شيلاجيت بدخشان",
        body: "Badakhshan, in the Hindu Kush of north-eastern Afghanistan, is a traditional source of Shilajit, collected by local people from high, rocky mountain slopes. Our Badakhshan Shilajit is offered pure and carefully handled, valued for its deep black colour and dense, firm consistency.",
        body_ar: "تُعدّ بدخشان في جبال الهندوكوش شمال شرق أفغانستان مصدراً تقليدياً للشيلاجيت، يجمعه أهل المنطقة من سفوح الجبال الصخرية العالية. ويُقدَّم شيلاجيت بدخشان لدينا نقياً ومُعالَجاً بعناية، ويُقدَّر للونه الأسود الداكن وقوامه الكثيف المتماسك.",
      },
    ],
  },
];

type Seed = {
  slug: string; name: string; name_ar: string; description: string; description_ar: string;
  origin: string; origin_ar: string; unit: string; images: string[];
  price_cents: number; compare_at_cents?: number; stock: number; featured?: boolean; cat: string;
};

const img = (...names: string[]) => names.map((n) => `/products/${n}`);

const seeds: Seed[] = [
  // ── Raisins ──
  { cat: "raisins", slug: "green-raisins", name: "Green Raisins", name_ar: "الزبيب الأخضر", ...KDH, unit: "1 kg", images: img("about-raisins.jpg", "green-raisins.jpg", "cover-raisins.jpg"),
    description: "Kandahar's signature long green raisins: juicy, fragrant and naturally sweet.",
    description_ar: "زبيب قندهار الأخضر الطويل المميّز: عصيري وعطري وحلو المذاق طبيعياً.", price_cents: 1490, stock: 120, featured: true },
  { cat: "raisins", slug: "golden-raisins", name: "Golden Raisins", name_ar: "الزبيب الذهبي", ...KDH, unit: "1 kg", images: img("golden-raisins.jpg"),
    description: "Bright golden-yellow, soft and plump. Ideal for bakery, confectionery and snacking.",
    description_ar: "ذهبي مشرق، طري وممتلئ، مثالي للمخبوزات والحلويات والتسالي.", price_cents: 1390, stock: 110, featured: true },
  { cat: "raisins", slug: "black-raisins", name: "Black Raisins", name_ar: "الزبيب الأسود", ...KDH, unit: "1 kg", images: img("black-raisins.jpg"),
    description: "Deep black with a rich, full-bodied sweetness; naturally sun-dried.",
    description_ar: "أسود داكن بحلاوة غنية ونكهة عميقة، مجفف طبيعياً تحت أشعة الشمس.", price_cents: 1290, stock: 90 },
  { cat: "raisins", slug: "red-raisins", name: "Red Raisins", name_ar: "الزبيب الأحمر", ...KDH, unit: "1 kg", images: img("red-raisins.jpg"),
    description: "Classic reddish-brown raisins with a soft bite and caramel-like sweetness.",
    description_ar: "زبيب كلاسيكي بني محمرّ، طري الملمس بحلاوة تشبه الكراميل.", price_cents: 1290, stock: 90 },
  { cat: "raisins", slug: "seedless-green-raisins", name: "Seedless Green Raisins", name_ar: "زبيب أخضر بلا بذور", ...KDH, unit: "1 kg", images: img("seedless-green-raisins.jpg"),
    description: "Small, uniform green seedless raisins; perfect for retail packs and mixes.",
    description_ar: "زبيب أخضر صغير متجانس وخالٍ من البذور، مناسب لعبوات التجزئة والخلطات.", price_cents: 1350, stock: 100 },
  { cat: "raisins", slug: "light-golden-raisins", name: "Light Golden Raisins", name_ar: "الزبيب الذهبي الفاتح", ...KDH, unit: "1 kg", images: img("light-golden-raisins.jpg"),
    description: "Large pale-golden raisins with a delicate flavour and tender texture.",
    description_ar: "زبيب كبير بلون ذهبي فاتح، بنكهة رقيقة وقوام طري.", price_cents: 1590, stock: 60 },

  // ── Dried fruits ──
  { cat: "dried-fruits", slug: "apricot-halves", name: "Apricot Halves", name_ar: "أنصاف المشمش", ...AF, unit: "500 g", images: img("apricot-halves.jpg"),
    description: "Vivid orange, sweet and pleasantly tangy; a premium choice for retail and industry.",
    description_ar: "برتقالي زاهٍ، حلو بلمسة حامضة لطيفة؛ خيار ممتاز للتجزئة والصناعة.", price_cents: 1190, stock: 80, featured: true },
  { cat: "dried-fruits", slug: "whole-apricots", name: "Whole Apricots", name_ar: "المشمش الكامل", ...AF, unit: "500 g", images: img("whole-apricots.jpg"),
    description: "Traditional sun-dried apricots with the stone: chewy and naturally sweet.",
    description_ar: "مشمش مجفف تقليدياً بالشمس بنواته: مطّاطي القوام وحلو طبيعياً.", price_cents: 990, stock: 80 },
  { cat: "dried-fruits", slug: "golden-apricots", name: "Golden Apricots", name_ar: "المشمش الذهبي", ...AF, unit: "500 g", images: img("golden-apricots.jpg"),
    description: "Soft golden apricot pieces with a honey-like sweetness.",
    description_ar: "قطع مشمش ذهبية طرية بحلاوة تشبه العسل.", price_cents: 1150, stock: 70 },
  { cat: "dried-fruits", slug: "dried-figs", name: "Dried Figs", name_ar: "التين المجفف", ...AF, unit: "500 g", images: img("dried-figs.jpg"),
    description: "Naturally sun-dried figs, soft and rich with a honeyed flavour.",
    description_ar: "تين مجفف طبيعياً تحت الشمس، طري وغني بنكهة عسلية.", price_cents: 1250, stock: 70 },
  { cat: "dried-fruits", slug: "string-figs", name: "String Figs", name_ar: "التين المنظوم", ...AF, unit: "1 string (~1 kg)", images: img("string-figs.jpg", "cover-string-figs.jpg", "string-figs-pile.jpg"),
    description: "Figs strung in long traditional ropes, a market classic with a natural look.",
    description_ar: "تين منظوم في خيوط طويلة تقليدية، صنف كلاسيكي في الأسواق بمظهر طبيعي.", price_cents: 1890, stock: 40, featured: true },
  { cat: "dried-fruits", slug: "dried-mulberries", name: "Dried Mulberries", name_ar: "التوت المجفف", ...AF, unit: "500 g", images: img("dried-mulberries.jpg", "cover-mulberries.jpg"),
    description: "Dark, naturally sweet mulberries; an Afghan favourite and a healthy snack.",
    description_ar: "توت داكن حلو طبيعياً، مفضَّل أفغاني ووجبة خفيفة صحية.", price_cents: 1090, stock: 60 },

  // ── Nuts & seeds ──
  { cat: "nuts-seeds", slug: "in-shell-almonds", name: "In-Shell Almonds", name_ar: "اللوز بقشره", ...AF, unit: "1 kg", images: img("in-shell-almonds.jpg"),
    description: "Whole almonds in their natural shell, sold in-shell to keep the kernel fresh and flavourful.",
    description_ar: "لوز كامل بقشره الطبيعي يُباع بقشره للحفاظ على طزاجة اللب ونكهته.", price_cents: 1690, stock: 70 },
  { cat: "nuts-seeds", slug: "soft-shell-almonds", name: "Soft-Shell Almonds", name_ar: "اللوز رقيق القشرة", ...AF, unit: "1 kg", images: img("soft-shell-almonds.jpg"),
    description: "Papery, easy-crack shells that split naturally to reveal the sweet kernel inside.",
    description_ar: "قشرة رقيقة سهلة الكسر تنشقّ طبيعياً لتكشف عن لبٍّ حلو المذاق.", price_cents: 1890, stock: 60 },
  { cat: "nuts-seeds", slug: "almond-kernels", name: "Almond Kernels", name_ar: "لب اللوز", ...AF, unit: "500 g", images: img("almond-kernels.jpg"),
    description: "Whole almond kernels, clean and uniform, with a sweet and mild taste.",
    description_ar: "حبّات لوز كاملة نظيفة ومتجانسة، بطعم حلو ومعتدل.", price_cents: 1590, stock: 80, featured: true },
  { cat: "nuts-seeds", slug: "walnut-kernels", name: "Walnut Kernels", name_ar: "لب الجوز", ...AF, unit: "500 g", images: img("walnut-kernels.jpg"),
    description: "Light-coloured walnut halves and pieces; mild, creamy and crunchy.",
    description_ar: "أنصاف وقطع جوز فاتحة اللون، معتدلة النكهة، كريمية ومقرمشة.", price_cents: 1490, stock: 70 },
  { cat: "nuts-seeds", slug: "pine-nuts-chilgoza", name: "Pine Nuts (Chilgoza)", name_ar: "الصنوبر (الجلغوزة)", ...AF, unit: "250 g", images: img("pine-nuts.jpg"),
    description: "Shelled pine nuts, ivory in colour, with a soft, buttery texture and delicate sweetness.",
    description_ar: "صنوبر مقشّر بلون عاجي، بقوام طري يشبه الزبدة وحلاوة رقيقة.", price_cents: 2990, stock: 40, featured: true },
  { cat: "nuts-seeds", slug: "black-seed-oil", name: "Black Seed & Oil", name_ar: "الحبة السوداء وزيتها", ...AF, unit: "250 g", images: img("black-seed.jpg"),
    description: "Aromatic black seeds (Nigella) with a strong, spicy and distinctive taste, cleaned and sorted. Also available as 100% pure black seed oil.",
    description_ar: "حبّة سوداء عطرية (حبة البركة) بطعم قوي وحارّ مميّز، منقّاة ومفروزة. ويتوفر أيضاً زيت الحبة السوداء الصافي 100%.", price_cents: 790, stock: 90 },

  // ── Saffron ──
  { cat: "saffron", slug: "herati-saffron", name: "Herati Saffron, Grade A+", name_ar: "زعفران هرات درجة +A", origin: "Herat, Afghanistan", origin_ar: "هرات، أفغانستان", unit: "1 g", images: img("herati-saffron-1.jpg", "herati-saffron-2.jpg", "saffron-front.jpg", "saffron-back.jpg"),
    description: "Grade A+, 100% handpicked saffron threads from Herat, known worldwide as red gold. Ideal for rice dishes, desserts, tea and drinks.",
    description_ar: "زعفران من الدرجة +A مقطوف يدوياً بنسبة 100% من هرات، يُعرف عالمياً بالذهب الأحمر. مثالي لأطباق الأرز والحلويات والشاي والمشروبات.", price_cents: 1290, stock: 150, featured: true },

  // ── Honey ──
  { cat: "honey", slug: "badakhshan-mountain-honey", name: "Mountain Honey", name_ar: "العسل الجبلي", origin: "Badakhshan & Takhar", origin_ar: "بدخشان وتخار", unit: "1 kg jar", images: img("honey-amber.jpg", "honey-golden.jpg", "honey-dark.jpg"),
    description: "Pure honey from the high mountain meadows of Badakhshan and Takhar: thick, aromatic and naturally harvested. Colour, aroma and texture vary naturally with the season and the flowers of each harvest.",
    description_ar: "عسل صافٍ من المروج الجبلية العالية في بدخشان وتخار: كثيف وعطري ويُحصد طبيعياً. يختلف لون العسل وعطره وقوامه طبيعياً باختلاف الموسم وأزهار كل موسم حصاد.", price_cents: 3490, stock: 30, featured: true },

  // ── Shilajit ──
  { cat: "shilajit", slug: "badakhshan-shilajit", name: "Badakhshan Shilajit (Mumiyai)", name_ar: "شيلاجيت بدخشان (موميايي)", origin: "Badakhshan, Afghanistan", origin_ar: "بدخشان، أفغانستان", unit: "50 g", images: img("shilajit.jpg"),
    description: "Pure Shilajit of Badakhshan, known locally as Mumiyai. Valued for its deep black colour and dense, firm consistency. Natural block & bottled.",
    description_ar: "شيلاجيت بدخشان الصافي، المعروف محلياً باسم «موميايي»، يُقدَّر للونه الأسود الداكن وقوامه الكثيف المتماسك. قطعة طبيعية ومعبأ.", price_cents: 3990, stock: 25, featured: true },
];

export const demoProducts: Product[] = seeds.map(({ cat, images, ...s }) => {
  const c = demoCategories.find((c) => c.id === cat)!;
  return {
    ...s, id: s.slug, compare_at_cents: s.compare_at_cents ?? null, featured: s.featured ?? false,
    category_id: c.id, category: { name: c.name, slug: c.slug, name_ar: c.name_ar },
    image_url: images[0], gallery: images, art_kind: "bag", color: c.color, active: true,
  };
});

// No invented reviews – real ones come from customers once Supabase is connected.
export const demoReviews: Review[] = [];

export const demoCoupons: Coupon[] = [
  { code: "WELCOME10", percent_off: 10, amount_off_cents: null, min_subtotal_cents: 0, active: true, expires_at: null },
];
