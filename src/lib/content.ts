// Company content from the Dehqan Farms Export Catalogue 2026 (EN/AR).
import type { Spec } from "@/components/SpecCards";

export const ABOUT = {
  kicker: "Our company", kicker_ar: "شركتنا",
  title: "About Us", title_ar: "من نحن",
  sub: "From Afghan farms to your market: authentic, naturally dried produce sourced directly from the growers.",
  sub_ar: "من المزارع الأفغانية إلى أسواقكم: منتجات أصيلة مجففة طبيعياً، تُورَّد مباشرةً من مزارعيها.",
  body: "Dehqan Farms Export is an export company specialising in the finest dried fruits, nuts and mountain products of Afghanistan. By working directly with farmers in the growing regions, we bring you the true taste of the harvest: from the world-famous raisins of Kandahar to pure mountain honey from Badakhshan and Takhar and Shilajit from Badakhshan, carefully selected, graded and packed for international buyers.",
  body_ar: "دهقان فارمز للتصدير شركة تصدير متخصصة في أجود الفواكه المجففة والمكسرات والمنتجات الجبلية الأفغانية. ومن خلال عملنا المباشر مع المزارعين في مناطق الزراعة، نقدّم لكم الطعم الحقيقي للحصاد: من زبيب قندهار المشهور عالمياً إلى العسل الجبلي الصافي من بدخشان وتخار والشيلاجيت من بدخشان، يُنتقى ويُصنَّف ويُعبَّأ بعناية للمشترين الدوليين.",
  network: {
    title: "A Growing Network of Farmers", title_ar: "شبكة مزارعين متنامية",
    body: "We represent a growing network of major farmers across Afghanistan’s key growing zones. By sourcing directly from the farm, we help growers earn first-hand and bring you consistent quality straight from the source.",
    body_ar: "نمثّل شبكة متنامية من كبار المزارعين في أهم مناطق الزراعة في أفغانستان. ومن خلال الشراء المباشر من المزرعة نساعد المزارعين على جني أرباحهم مباشرةً، ونقدّم لكم جودة ثابتة من المصدر.",
  },
};

export const PILLARS = [
  { n: "01", title: "Direct from Farmers", title_ar: "مباشرةً من المزارعين", body: "No middlemen. Fair prices for growers, better value and full traceability for you.", body_ar: "دون وسطاء: أسعار عادلة للمزارعين، وقيمة أفضل وإمكانية تتبّع كاملة لكم." },
  { n: "02", title: "Authentic Origin", title_ar: "أصالة المصدر", body: "Raisins from Kandahar and other regions, honey from Badakhshan and Takhar, Shilajit from Badakhshan.", body_ar: "زبيب من قندهار ومناطق أخرى، وعسل من بدخشان وتخار، وشيلاجيت من بدخشان." },
  { n: "03", title: "Quality Selection", title_ar: "انتقاء الجودة", body: "Products sorted and graded by size, colour and quality before packing.", body_ar: "تُفرز المنتجات وتُصنَّف حسب الحجم واللون والجودة قبل التعبئة." },
  { n: "04", title: "Tailored to You", title_ar: "مصمَّم لاحتياجكم", body: "Different grades, qualities and packaging options to suit each buyer.", body_ar: "درجات وجودات وخيارات تعبئة متنوعة تناسب كل مشترٍ." },
];

export const STEPS = [
  { n: 1, title: "Send your inquiry", title_ar: "أرسلوا استفساركم", body: "Tell us the products, grades and quantities you need.", body_ar: "أخبرونا بالمنتجات والدرجات والكميات التي تحتاجونها." },
  { n: 2, title: "Receive samples & quote", title_ar: "استلموا العيّنات والعرض", body: "We provide product samples and a competitive offer.", body_ar: "نوفر لكم عيّنات من المنتجات وعرضاً تنافسياً." },
  { n: 3, title: "Confirm your order", title_ar: "أكّدوا طلبكم", body: "We agree on specifications, grades and packaging to suit you.", body_ar: "نتفق على المواصفات والدرجات والتعبئة بما يناسبكم." },
];

export const PACKAGING = {
  title: "Packaging", title_ar: "التعبئة",
  body: "Packing in cartons or bags in the sizes you need, with private labelling available. Packaging specifications and minimum order quantities are available on request.",
  body_ar: "تعبئة في كراتين أو أكياس بالأحجام التي تحتاجونها، مع إمكانية وضع علامتكم الخاصة. مواصفات التعبئة والحد الأدنى للطلب متوفرة عند الطلب.",
};

export const SAFFRON_SPECS: Spec[] = [
  { label: "Origin", label_ar: "المنشأ", value: "Herat, Afghanistan", value_ar: "هرات، أفغانستان" },
  { label: "Grade", label_ar: "الدرجة", value: "A+", value_ar: "+A" },
  { label: "Harvest", label_ar: "القطاف", value: "100% Handpicked", value_ar: "مقطوف يدوياً 100%" },
];

export const SHILAJIT_SPECS: Spec[] = [
  { label: "Origin", label_ar: "المنشأ", value: "Badakhshan, Afghanistan", value_ar: "بدخشان، أفغانستان" },
  { label: "Local name", label_ar: "الاسم المحلي", value: "Mumiyai", value_ar: "موميايي" },
  { label: "Form", label_ar: "الشكل", value: "Natural block & bottled", value_ar: "قطعة طبيعية ومعبأ" },
];

export const REGIONS = [
  { name: "Kandahar", name_ar: "قندهار", what: "World-famous raisins", what_ar: "الزبيب المشهور عالمياً", img: "/products/golden-raisins.jpg", href: "/products?category=raisins" },
  { name: "Herat", name_ar: "هرات", what: "Grade A+ saffron – red gold", what_ar: "زعفران +A – الذهب الأحمر", img: "/products/saffron-front.jpg", href: "/products?category=saffron" },
  { name: "Badakhshan", name_ar: "بدخشان", what: "Mountain honey & Shilajit", what_ar: "العسل الجبلي والشيلاجيت", img: "/products/shilajit.jpg", href: "/products?category=shilajit" },
  { name: "Takhar", name_ar: "تخار", what: "High-meadow mountain honey", what_ar: "عسل المروج الجبلية", img: "/products/honey-golden.jpg", href: "/products?category=honey" },
];
