// LAMSA - Dashboard Page


const THEMES = {
  luxury: {
    name: "فاخر أسود وذهبي",
    background: "linear-gradient(135deg,#17120d,#302217 45%,#111)",
    accent: "#d7ad63",
    card: "#211b15",
    text: "#fffaf0"
  },

  cafe: {
    name: "كافيه مودرن",
    background: "linear-gradient(135deg,#f6efe5,#fffaf4)",
    accent: "#9b6b43",
    card: "#ffffff",
    text: "#2d241e"
  },

  fresh: {
    name: "أخضر طبيعي",
    background: "linear-gradient(135deg,#edf5ed,#f8fbf6)",
    accent: "#4f7b59",
    card: "#ffffff",
    text: "#203226"
  },

  modern: {
    name: "مودرن",
    background: "linear-gradient(135deg,#f2f2f2,#ffffff)",
    accent: "#222222",
    card: "#ffffff",
    text: "#171717"
  },

  dark: {
    name: "دارك",
    background: "linear-gradient(135deg,#080808,#1c1c1c)",
    accent: "#ffffff",
    card: "#151515",
    text: "#ffffff"
  }
};


function dashboardPage() {
  const themeCards =
    Object.entries(THEMES)
      .map(([key, theme]) => {

        return `
<div
class="theme-card"
data-theme="${key}"
onclick="selectTheme('${key}')">

<div
class="theme-preview"
style="background:${theme.background}">

<div class="preview-logo">
ل
</div>

<div class="preview-line"></div>
<div class="preview-line short"></div>

</div>

<div class="theme-name">
${theme.name}
</div>

<div
class="theme-check"
id="check-${key}">
✓
</div>

</div>
`;

      })
      .join("");

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>لوحة التحكم | لمسة</title>

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:Arial,sans-serif;
  background:#f5f2ee;
  color:#202020;
}

header{
  background:rgba(255,255,255,.96);
  backdrop-filter:blur(15px);
  min-height:76px;
  border-bottom:1px solid #e8e3dc;
  padding:12px 5%;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:15px;
  position:sticky;
  top:0;
  z-index:50;
}

.brand{
  display:flex;
  align-items:center;
  gap:10px;
}

.logo-mark{
  width:42px;
  height:42px;
  border-radius:13px;
  background:#211d19;
  color:#d9b06a;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:21px;
  font-weight:900;
}

.logo-text{
  font-size:24px;
  font-weight:900;
}

.logo-text small{
  display:block;
  direction:ltr;
  font-size:7px;
  letter-spacing:3px;
  color:#999;
}

.header-actions{
  display:flex;
  gap:8px;
  align-items:center;
}

.preview-btn,
.logout{
  border:0;
  border-radius:11px;
  padding:11px 16px;
  cursor:pointer;
  font-family:inherit;
  font-weight:bold;
}

.preview-btn{
  background:#eee8df;
  color:#5e472e;
}

.logout{
  background:#211d19;
  color:white;
}

main{
  max-width:1200px;
  margin:auto;
  padding:28px 16px 60px;
}

.welcome{
  position:relative;
  overflow:hidden;
  background:
    radial-gradient(circle at 80% 20%,rgba(216,176,106,.35),transparent 30%),
    linear-gradient(135deg,#29231e,#151311);
  color:white;
  border-radius:24px;
  padding:30px;
  margin-bottom:20px;
  box-shadow:0 18px 45px rgba(0,0,0,.12);
}

.welcome:after{
  content:"ل";
  position:absolute;
  left:30px;
  top:-20px;
  font-size:180px;
  font-weight:900;
  color:rgba(255,255,255,.035);
}

.welcome h1{
  margin:0 0 9px;
  font-size:30px;
}

.welcome p{
  margin:0;
  color:#ddd;
  line-height:1.8;
}

.grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:16px;
}

.card{
  background:white;
  border:1px solid #e8e3dc;
  border-radius:20px;
  padding:22px;
  box-shadow:0 7px 25px rgba(0,0,0,.025);
}

.card h2{
  margin:0 0 16px;
  font-size:21px;
}

label{
  display:block;
  margin:14px 0 7px;
  font-weight:bold;
}

input,
textarea,
select{
  width:100%;
  padding:13px;
  border:1px solid #ddd7cf;
  border-radius:11px;
  font:inherit;
  outline:none;
  background:#fff;
}

input:focus,
textarea:focus,
select:focus{
  border-color:#b5864e;
}

textarea{
  min-height:90px;
  resize:vertical;
}

.save{
  margin-top:15px;
  width:100%;
  padding:13px;
  border:0;
  border-radius:11px;
  background:#211d19;
  color:white;
  font:inherit;
  font-weight:bold;
  cursor:pointer;
}

.message{
  margin-top:10px;
  min-height:20px;
  color:#53704d;
  font-size:13px;
}

.menu-link{
  display:block;
  background:#f6f2ec;
  color:#6d5133;
  padding:14px;
  border-radius:11px;
  margin-top:12px;
  word-break:break-all;
  text-decoration:none;
}

.menu-open{
  display:inline-block;
  margin-top:10px;
  background:#211d19;
  color:white;
  text-decoration:none;
  padding:11px 17px;
  border-radius:10px;
  font-weight:bold;
}

.full{
  grid-column:1/-1;
}

.category-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  border:1px solid #eee9e2;
  border-radius:12px;
  padding:12px;
  margin-top:9px;
  background:#fffdfa;
}

.add{
  background:#211d19;
  color:white;
  border:0;
  border-radius:10px;
  padding:11px 15px;
  margin-top:10px;
  cursor:pointer;
  font-family:inherit;
}

.danger{
  background:#f8eeee;
  color:#8d3030;
  border:0;
  border-radius:8px;
  padding:8px 11px;
  cursor:pointer;
  font-family:inherit;
}

.item-row{
  border:1px solid #eee9e2;
  border-radius:15px;
  padding:13px;
  margin-top:10px;
  display:flex;
  justify-content:space-between;
  gap:12px;
  align-items:center;
  background:#fff;
}

.item-main{
  display:flex;
  gap:12px;
  align-items:center;
  min-width:0;
}

.item-image{
  width:70px;
  height:70px;
  border-radius:12px;
  object-fit:cover;
  background:#eee;
  flex:none;
}

.item-info{
  min-width:0;
}

.item-name{
  font-weight:bold;
  font-size:17px;
}

.small{
  font-size:13px;
  color:#777;
  line-height:1.7;
}

.item-actions{
  display:flex;
  gap:7px;
  flex:none;
}

.section-title{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}

.themes{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:10px;
}

.theme-card{
  position:relative;
  border:2px solid transparent;
  border-radius:15px;
  padding:7px;
  background:#faf9f7;
  cursor:pointer;
  transition:.2s;
}

.theme-card:hover{
  transform:translateY(-2px);
}

.theme-card.selected{
  border-color:#b2834c;
}

.theme-preview{
  height:110px;
  border-radius:10px;
  padding:13px;
  overflow:hidden;
  position:relative;
}

.preview-logo{
  width:28px;
  height:28px;
  border-radius:9px;
  background:rgba(255,255,255,.18);
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:900;
  font-size:14px;
}

.preview-line{
  height:7px;
  width:70%;
  border-radius:20px;
  background:rgba(255,255,255,.45);
  margin-top:15px;
}

.preview-line.short{
  width:45%;
  margin-top:7px;
}

.theme-name{
  text-align:center;
  padding:9px 2px 4px;
  font-size:12px;
  font-weight:bold;
}

.theme-check{
  position:absolute;
  top:9px;
  left:9px;
  width:22px;
  height:22px;
  border-radius:50%;
  background:#b2834c;
  color:white;
  display:none;
  align-items:center;
  justify-content:center;
  font-size:12px;
}

.theme-card.selected .theme-check{
  display:flex;
}

.background-box{
  margin-top:18px;
  padding-top:18px;
  border-top:1px solid #eee9e2;
}

.backgrounds{
  display:flex;
  gap:9px;
  flex-wrap:wrap;
}

.bg-option{
  width:60px;
  height:60px;
  border-radius:13px;
  border:3px solid transparent;
  cursor:pointer;
}

.bg-option.selected{
  border-color:#b2834c;
}

.bg-1{
  background:linear-gradient(135deg,#201a15,#5b4127);
}

.bg-2{
  background:linear-gradient(135deg,#f4e7d5,#fffaf3);
}

.bg-3{
  background:linear-gradient(135deg,#dcebdc,#f8fff7);
}

.bg-4{
  background:linear-gradient(135deg,#222,#555);
}

.bg-5{
  background:linear-gradient(135deg,#efe1cf,#d3a66c,#6d4b2e);
}

.logo-preview{
  display:flex;
  gap:15px;
  align-items:center;
  padding:15px;
  background:#faf8f5;
  border-radius:14px;
  margin-top:12px;
}

.logo-preview img{
  width:65px;
  height:65px;
  object-fit:contain;
  border-radius:12px;
  background:white;
}

.no-logo{
  width:65px;
  height:65px;
  border-radius:12px;
  background:#211d19;
  color:#d9b06a;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:30px;
  font-weight:900;
}

@media(max-width:900px){

  .themes{
    grid-template-columns:repeat(3,1fr);
  }

}

@media(max-width:700px){

  header{
    padding:11px 14px;
  }

  .header-actions{
    gap:5px;
  }

  .preview-btn,
  .logout{
    padding:9px 10px;
    font-size:12px;
  }

  .grid{
    grid-template-columns:1fr;
  }

  .full{
    grid-column:auto;
  }

  .themes{
    grid-template-columns:repeat(2,1fr);
  }

  .item-row{
    align-items:flex-start;
  }

  .item-main{
    align-items:flex-start;
  }

  .item-actions{
    flex-direction:column;
  }

}

</style>

</head>

<body>

<header>

<div class="brand">

<div class="logo-mark">
ل
</div>

<div class="logo-text">
لمسة
<small>LAMSA</small>
</div>

</div>

<div class="header-actions">

<button
class="preview-btn"
onclick="openMenu()">
👀 معاينة المنيو
</button>

<button
class="logout"
onclick="logout()">
تسجيل الخروج
</button>

</div>

</header>

<main>

<section class="welcome">

<h1 id="welcome">
أهلاً بك 👋
</h1>

<p>
من هنا تقدر تدير مطعمك ومنيوك وتختار شكل المنيو بنفسك.
</p>

</section>

<div class="grid">

<section class="card">

<h2>
🏪 بيانات المطعم
</h2>

<label>اسم المطعم</label>

<input id="restaurantName">

<label>الوصف</label>

<textarea id="restaurantDescription"></textarea>

<label>رقم الهاتف</label>

<input id="restaurantPhone">

<label>العنوان</label>

<input id="restaurantAddress">

<label>
🖼️ رابط شعار المطعم
</label>

<input
id="restaurantLogo"
placeholder="https://...">

<div class="logo-preview">

<div id="logoPreviewBox">
<div class="no-logo">ل</div>
</div>

<div class="small">
يفضل استخدام صورة PNG أو WEBP بخلفية شفافة.
</div>

</div>

<button
class="save"
onclick="saveRestaurant()">
حفظ بيانات المطعم
</button>

<div
id="restaurantMessage"
class="message">
</div>

</section>


<section class="card">

<h2>
🔗 رابط المنيو
</h2>

<p class="small">
ده الرابط الذي سيشاهده العملاء.
</p>

<a
id="menuLink"
class="menu-link"
target="_blank">
جاري التحميل...
</a>

<a
id="openMenuButton"
class="menu-open"
target="_blank">
فتح المنيو
</a>

</section>


<section class="card full">

<div class="section-title">

<h2>
🎨 تصميم المنيو
</h2>

<span class="small">
اختار الشكل المناسب لمطعمك
</span>

</div>

<div class="themes">

${themeCards}

</div>

<div class="background-box">

<h3>
🖼️ خلفية المنيو
</h3>

<p class="small">
اختار خلفية جاهزة الآن، وسنضيف خلفيات أكثر لاحقًا.
</p>

<div class="backgrounds">

<div
class="bg-option bg-1"
data-bg="bg1"
onclick="selectBackground('bg1')">
</div>

<div
class="bg-option bg-2"
data-bg="bg2"
onclick="selectBackground('bg2')">
</div>

<div
class="bg-option bg-3"
data-bg="bg3"
onclick="selectBackground('bg3')">
</div>

<div
class="bg-option bg-4"
data-bg="bg4"
onclick="selectBackground('bg4')">
</div>

<div
class="bg-option bg-5"
data-bg="bg5"
onclick="selectBackground('bg5')">
</div>

</div>

</div>

<button
class="save"
onclick="saveDesign()">
حفظ تصميم المنيو
</button>

<div
id="designMessage"
class="message">
</div>

</section>


<section class="card">

<h2>
📂 أقسام المنيو
</h2>

<input
id="categoryName"
placeholder="مثال: المشروبات">

<button
class="add"
onclick="addCategory()">
+ إضافة قسم
</button>

<div id="categories"></div>

</section>


<section class="card">

<h2>
🍽️ إضافة صنف
</h2>

<label>اسم الصنف</label>

<input
id="itemName"
placeholder="مثال: برجر لحم">

<label>السعر</label>

<input
id="itemPrice"
type="number"
step="0.01"
placeholder="150">

<label>القسم</label>

<select id="itemCategory">

<option value="">
بدون قسم
</option>

</select>

<label>الوصف</label>

<textarea
id="itemDescription"
placeholder="وصف الصنف">
</textarea>

<label>رابط الصورة</label>

<input
id="itemImage"
placeholder="https://...">

<button
class="save"
onclick="addItem()">
إضافة الصنف
</button>

<div
id="itemMessage"
class="message">
</div>

</section>


<section class="card full">

<h2>
📋 أصناف المنيو
</h2>

<div id="items">
جاري التحميل...
</div>

</section>

</div>

</main>

<script>

let restaurant = null;
let categories = [];
let items = [];

let selectedTheme = "modern";
let selectedBackground = "";


async function api(url, options = {}){

  const response =
    await fetch(
      url,
      {
        ...options,
        credentials:"same-origin",
        headers:{
          "Content-Type":"application/json",
          ...(options.headers || {})
        }
      }
    );

  const data =
    await response.json();

  if(!response.ok || !data.ok){
    throw new Error(
      data.error || "حدث خطأ"
    );
  }

  return data;
}


async function load(){

  try{

    const me =
      await api("/api/me");

    document.getElementById(
      "welcome"
    ).textContent =
      "أهلاً بك يا " +
      me.user.name +
      " 👋";


    const restaurantData =
      await api("/api/restaurant");

    restaurant =
      restaurantData.restaurant;


    document.getElementById(
      "restaurantName"
    ).value =
      restaurant.name || "";


    document.getElementById(
      "restaurantDescription"
    ).value =
      restaurant.description || "";


    document.getElementById(
      "restaurantPhone"
    ).value =
      restaurant.phone || "";


    document.getElementById(
      "restaurantAddress"
    ).value =
      restaurant.address || "";


    document.getElementById(
      "restaurantLogo"
    ).value =
      restaurant.logo || "";


    selectedTheme =
      restaurant.theme || "modern";


    selectedBackground =
      restaurant.background || "";


    updateThemeUI();
    updateBackgroundUI();
    updateLogoPreview();


    const link =
      location.origin +
      "/menu/" +
      restaurant.slug;


    document.getElementById(
      "menuLink"
    ).href = link;

    document.getElementById(
      "menuLink"
    ).textContent = link;

    document.getElementById(
      "openMenuButton"
    ).href = link;


    await loadCategories();
    await loadItems();

  }catch(error){

    location.href="/login";

  }

}


function openMenu(){

  if(!restaurant){
    return;
  }

  window.open(
    "/menu/" + restaurant.slug,
    "_blank"
  );

}


function selectTheme(theme){

  selectedTheme = theme;

  updateThemeUI();

}


function updateThemeUI(){

  document
    .querySelectorAll(".theme-card")
    .forEach(card => {

      card.classList.toggle(
        "selected",
        card.dataset.theme === selectedTheme
      );

    });

}


function selectBackground(bg){

  selectedBackground = bg;

  updateBackgroundUI();

}


function updateBackgroundUI(){

  document
    .querySelectorAll(".bg-option")
    .forEach(option => {

      option.classList.toggle(
        "selected",
        option.dataset.bg === selectedBackground
      );

    });

}


async function saveDesign(){

  try{

    await saveRestaurantData();

    document.getElementById(
      "designMessage"
    ).textContent =
      "تم حفظ تصميم المنيو ✓";

  }catch(error){

    document.getElementById(
      "designMessage"
    ).textContent =
      error.message;

  }

}


async function saveRestaurant(){

  try{

    await saveRestaurantData();

    document.getElementById(
      "restaurantMessage"
    ).textContent =
      "تم حفظ بيانات المطعم ✓";

    updateLogoPreview();

  }catch(error){

    document.getElementById(
      "restaurantMessage"
    ).textContent =
      error.message;

  }

}


async function saveRestaurantData(){

  await api(
    "/api/restaurant",
    {
      method:"PUT",
      body:JSON.stringify({

        name:
          document.getElementById(
            "restaurantName"
          ).value,

        description:
          document.getElementById(
            "restaurantDescription"
          ).value,

        phone:
          document.getElementById(
            "restaurantPhone"
          ).value,

        address:
          document.getElementById(
            "restaurantAddress"
          ).value,

        logo:
          document.getElementById(
            "restaurantLogo"
          ).value,

        theme:
          selectedTheme,

        background:
          selectedBackground

      })
    }
  );

}


function updateLogoPreview(){

  const url =
    document.getElementById(
      "restaurantLogo"
    ).value.trim();

  const box =
    document.getElementById(
      "logoPreviewBox"
    );

  if(!url){

    box.innerHTML =
      '<div class="no-logo">ل</div>';

    return;
  }

  box.innerHTML =
    '<img ' +
    'src="' + escapeHtml(url) + '" ' +
    'alt="شعار المطعم" ' +
    'onerror="this.style.display=\\'none\\'">';

}


async function loadCategories(){

  const data =
    await api("/api/categories");

  categories =
    data.categories;

  renderCategories();

}


function renderCategories(){

  const box =
    document.getElementById("categories");

  const select =
    document.getElementById("itemCategory");

  box.innerHTML = "";

  select.innerHTML =
    '<option value="">بدون قسم</option>';


  categories.forEach(category => {

    const row =
      document.createElement("div");

    row.className =
      "category-row";

    row.innerHTML =
      '<strong>' +
      escapeHtml(category.name) +
      '</strong>' +

      '<button ' +
      'class="danger" ' +
      'onclick="removeCategory(\\'' +
      category.id +
      '\\')">' +
      'حذف' +
      '</button>';

    box.appendChild(row);


    const option =
      document.createElement("option");

    option.value =
      category.id;

    option.textContent =
      category.name;

    select.appendChild(option);

  });


  if(!categories.length){

    box.innerHTML =
      '<div class="small">' +
      'لم تتم إضافة أقسام بعد.' +
      '</div>';

  }

}


async function addCategory(){

  const name =
    document.getElementById(
      "categoryName"
    ).value.trim();

  if(!name){
    return;
  }

  try{

    await api(
      "/api/categories",
      {
        method:"POST",
        body:JSON.stringify({name})
      }
    );

    document.getElementById(
      "categoryName"
    ).value = "";

    await loadCategories();

  }catch(error){

    alert(error.message);

  }

}


async function removeCategory(id){

  if(!confirm("هل تريد حذف هذا القسم؟")){
    return;
  }

  try{

    await api(
      "/api/categories/" + id,
      {
        method:"DELETE"
      }
    );

    await loadCategories();
    await loadItems();

  }catch(error){

    alert(error.message);

  }

}


async function loadItems(){

  const data =
    await api("/api/items");

  items =
    data.items;

  renderItems();

}


function renderItems(){

  const box =
    document.getElementById("items");

  box.innerHTML = "";


  if(!items.length){

    box.innerHTML =
      '<div class="small">' +
      'لم تتم إضافة أصناف بعد.' +
      '</div>';

    return;
  }


  items.forEach(item => {

    const row =
      document.createElement("div");

    row.className =
      "item-row";


    let image =
      '<div class="no-logo">ل</div>';

    if(item.image){

      image =
        '<img ' +
        'class="item-image" ' +
        'src="' +
        escapeHtml(item.image) +
        '" ' +
        'alt="' +
        escapeHtml(item.name) +
        '">';
    }


    const categoryText =
      item.category_name
        ? " — " +
          escapeHtml(item.category_name)
        : "";


    row.innerHTML =
      '<div class="item-main">' +

        image +

        '<div class="item-info">' +

          '<div class="item-name">' +
            escapeHtml(item.name) +
          '</div>' +

          '<div class="small">' +
            Number(item.price).toFixed(2) +
            ' جنيه' +
            categoryText +
          '</div>' +

          '<div class="small">' +
            escapeHtml(item.description || "") +
          '</div>' +

        '</div>' +

      '</div>' +

      '<div class="item-actions">' +

        '<button ' +
        'class="danger" ' +
        'onclick="editItem(\\'' +
        item.id +
        '\\')">' +
        'تعديل' +
        '</button>' +

        '<button ' +
        'class="danger" ' +
        'onclick="removeItem(\\'' +
        item.id +
        '\\')">' +
        'حذف' +
        '</button>' +

      '</div>';


    box.appendChild(row);

  });

}


async function addItem(){

  try{

    const name =
      document.getElementById(
        "itemName"
      ).value.trim();

    const price =
      document.getElementById(
        "itemPrice"
      ).value;

    const category_id =
      document.getElementById(
        "itemCategory"
      ).value;

    const description =
      document.getElementById(
        "itemDescription"
      ).value;

    const image =
      document.getElementById(
        "itemImage"
      ).value;


    await api(
      "/api/items",
      {
        method:"POST",
        body:JSON.stringify({
          name,
          price,
          category_id,
          description,
          image
        })
      }
    );


    document.getElementById(
      "itemName"
    ).value = "";

    document.getElementById(
      "itemPrice"
    ).value = "";

    document.getElementById(
      "itemDescription"
    ).value = "";

    document.getElementById(
      "itemImage"
    ).value = "";

    document.getElementById(
      "itemMessage"
    ).textContent =
      "تم إضافة الصنف ✓";


    await loadItems();

  }catch(error){

    document.getElementById(
      "itemMessage"
    ).textContent =
      error.message;

  }

}


async function editItem(id){

  const item =
    items.find(x => x.id === id);

  if(!item){
    return;
  }


  const name =
    prompt(
      "اسم الصنف:",
      item.name
    );

  if(name === null){
    return;
  }


  const price =
    prompt(
      "السعر:",
      item.price
    );

  if(price === null){
    return;
  }


  const description =
    prompt(
      "الوصف:",
      item.description || ""
    );

  if(description === null){
    return;
  }


  const category =
    prompt(
      "اكتب اسم القسم أو اتركه كما هو:",
      item.category_name || ""
    );


  let categoryId =
    item.category_id || "";


  if(category !== null && category.trim()){

    const found =
      categories.find(
        x =>
          x.name.trim() ===
          category.trim()
      );

    if(found){
      categoryId = found.id;
    }

  }


  try{

    await api(
      "/api/items/" + id,
      {
        method:"PUT",
        body:JSON.stringify({

          name,
          price,
          description,

          category_id:
            categoryId,

          image:
            item.image || ""

        })
      }
    );

    await loadItems();

  }catch(error){

    alert(error.message);

  }

}


async function removeItem(id){

  if(!confirm("هل تريد حذف هذا الصنف؟")){
    return;
  }

  try{

    await api(
      "/api/items/" + id,
      {
        method:"DELETE"
      }
    );

    await loadItems();

  }catch(error){

    alert(error.message);

  }

}


async function logout(){

  await fetch(
    "/api/logout",
    {
      method:"POST",
      credentials:"same-origin"
    }
  );

  location.href="/";

}


function escapeHtml(value){

  return String(value || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}


load();

</script>


<footer class="lamsa-footer">
  <div>M / Mohamed abdalaziem</div>
  <div>جميع الحقوق محفوظة © 2026</div>
</footer>
<style>
.lamsa-footer{
  width:100%;
  padding:18px 16px;
  text-align:center;
  background:rgba(15,15,15,.96);
  color:#fff;
  border-top:1px solid rgba(255,255,255,.12);
  font-size:13px;
  line-height:1.8;
}
.lamsa-footer div:first-child{
  font-weight:700;
  letter-spacing:.2px;
}
.lamsa-footer div:last-child{
  opacity:.72;
}
</style>

</body>

</html>
`;
}


// =========================
// PUBLIC MENU
// =========================


export { dashboardPage };
