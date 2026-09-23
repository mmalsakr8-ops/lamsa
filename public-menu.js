import { html } from '../utils.js';
import { THEMES } from '../config.js';
import { escapeHtml } from '../utils.js';

function publicMenuPage(
  restaurant,
  categories,
  items
) {

  const theme =
    THEMES[restaurant.theme]
      || THEMES.modern;

  let background =
    theme.background;

  const customBackground =
    restaurant.background || "";

  const customBackgrounds = {

    bg1:
      "linear-gradient(135deg,#201a15,#5b4127)",

    bg2:
      "linear-gradient(135deg,#f4e7d5,#fffaf3)",

    bg3:
      "linear-gradient(135deg,#dcebdc,#f8fff7)",

    bg4:
      "linear-gradient(135deg,#222,#555)",

    bg5:
      "linear-gradient(135deg,#efe1cf,#d3a66c,#6d4b2e)"

  };


  if(customBackgrounds[customBackground]){
    background =
      customBackgrounds[customBackground];
  }


  let sections = "";


  for(const category of categories){

    const categoryItems =
      items.filter(
        item =>
          item.category_id === category.id
      );

    if(!categoryItems.length){
      continue;
    }


    let itemHtml = "";


    for(const item of categoryItems){

      let imageHtml = "";

      if(item.image){

        imageHtml =
          '<img class="item-image" ' +
          'src="' +
          escapeHtml(item.image) +
          '" ' +
          'alt="' +
          escapeHtml(item.name) +
          '">';

      }


      let descriptionHtml = "";

      if(item.description){

        descriptionHtml =
          '<p>' +
          escapeHtml(item.description) +
          '</p>';

      }


      itemHtml +=
        '<article class="item">' +

          imageHtml +

          '<div class="item-info">' +

            '<div class="item-top">' +

              '<h3>' +
                escapeHtml(item.name) +
              '</h3>' +

              '<strong>' +
                Number(item.price).toFixed(2) +
                ' ج' +
              '</strong>' +

            '</div>' +

            descriptionHtml +

          '</div>' +

        '</article>';

    }


    sections +=
      '<section class="category">' +

        '<div class="category-title">' +

          '<span></span>' +

          '<h2>' +
            escapeHtml(category.name) +
          '</h2>' +

          '<span></span>' +

        '</div>' +

        '<div class="items">' +
          itemHtml +
        '</div>' +

      '</section>';

  }


  const uncategorized =
    items.filter(
      item =>
        !item.category_id
    );


  if(uncategorized.length){

    let otherItems = "";


    for(const item of uncategorized){

      let imageHtml = "";

      if(item.image){

        imageHtml =
          '<img class="item-image" ' +
          'src="' +
          escapeHtml(item.image) +
          '" ' +
          'alt="' +
          escapeHtml(item.name) +
          '">';

      }


      let descriptionHtml = "";

      if(item.description){

        descriptionHtml =
          '<p>' +
          escapeHtml(item.description) +
          '</p>';

      }


      otherItems +=
        '<article class="item">' +

          imageHtml +

          '<div class="item-info">' +

            '<div class="item-top">' +

              '<h3>' +
                escapeHtml(item.name) +
              '</h3>' +

              '<strong>' +
                Number(item.price).toFixed(2) +
                ' ج' +
              '</strong>' +

            '</div>' +

            descriptionHtml +

          '</div>' +

        '</article>';

    }


    sections +=
      '<section class="category">' +

        '<div class="category-title">' +

          '<span></span>' +

          '<h2>أصناف أخرى</h2>' +

          '<span></span>' +

        '</div>' +

        '<div class="items">' +
          otherItems +
        '</div>' +

      '</section>';

  }


  let restaurantDescription = "";

  if(restaurant.description){

    restaurantDescription =
      '<p class="restaurant-description">' +
      escapeHtml(restaurant.description) +
      '</p>';

  }


  let logoHtml =
    '<div class="logo-fallback">ل</div>';


  if(restaurant.logo){

    logoHtml =
      '<img class="restaurant-logo" ' +
      'src="' +
      escapeHtml(restaurant.logo) +
      '" ' +
      'alt="' +
      escapeHtml(restaurant.name) +
      '">';
  }


  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1">

<title>
${escapeHtml(restaurant.name)} | لمسة
</title>

<style>

*{
  box-sizing:border-box;
}

html{
  scroll-behavior:smooth;
}

body{
  margin:0;
  font-family:Arial,sans-serif;
  background:${background};
  color:${theme.text};
  min-height:100vh;
}

.page{
  min-height:100vh;
  background:
    radial-gradient(
      circle at 20% 10%,
      rgba(255,255,255,.12),
      transparent 30%
    );
}

.hero{
  padding:45px 18px 35px;
  text-align:center;
}

.restaurant-logo,
.logo-fallback{
  width:92px;
  height:92px;
  border-radius:28px;
  margin:0 auto 18px;
  object-fit:contain;
  background:rgba(255,255,255,.14);
  box-shadow:0 15px 45px rgba(0,0,0,.14);
}

.logo-fallback{
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:45px;
  font-weight:900;
  color:${theme.accent};
}

.hero h1{
  margin:0;
  font-size:clamp(30px,7vw,52px);
  letter-spacing:-1px;
}

.restaurant-description{
  max-width:650px;
  margin:14px auto 0;
  line-height:1.9;
  opacity:.78;
}

.powered{
  display:inline-block;
  margin-top:18px;
  padding:7px 13px;
  border-radius:30px;
  background:rgba(255,255,255,.1);
  font-size:11px;
  opacity:.65;
}

.menu{
  max-width:900px;
  margin:auto;
  padding:15px 15px 60px;
}

.category{
  margin-bottom:40px;
}

.category-title{
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:center;
  gap:12px;
  margin-bottom:17px;
}

.category-title span{
  height:1px;
  background:${theme.accent};
  opacity:.35;
}

.category-title h2{
  margin:0;
  color:${theme.accent};
  font-size:25px;
  white-space:nowrap;
}

.items{
  display:grid;
  gap:12px;
}

.item{
  background:${theme.card};
  color:${theme.text};
  border:1px solid rgba(255,255,255,.09);
  border-radius:18px;
  padding:12px;
  display:flex;
  gap:14px;
  align-items:center;
  box-shadow:0 10px 35px rgba(0,0,0,.08);
}

.item-image{
  width:92px;
  height:92px;
  object-fit:cover;
  border-radius:14px;
  flex:none;
  background:#eee;
}

.item-info{
  flex:1;
  min-width:0;
}

.item-top{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:14px;
}

.item h3{
  margin:0;
  font-size:18px;
  line-height:1.5;
}

.item strong{
  color:${theme.accent};
  white-space:nowrap;
  font-size:17px;
}

.item p{
  margin:7px 0 0;
  opacity:.65;
  line-height:1.7;
  font-size:14px;
}

.footer{
  text-align:center;
  padding:25px 15px 35px;
  opacity:.55;
  font-size:12px;
}

@media(max-width:600px){

  .hero{
    padding-top:32px;
  }

  .restaurant-logo,
  .logo-fallback{
    width:78px;
    height:78px;
    border-radius:22px;
  }

  .item{
    align-items:flex-start;
  }

  .item-image{
    width:76px;
    height:76px;
  }

  .item-top{
    flex-direction:column;
    gap:3px;
  }

  .item strong{
    font-size:15px;
  }

  .category-title h2{
    font-size:21px;
  }

}

.footer-brand{font-weight:800;font-size:22px;letter-spacing:2px;}
.footer-copy{margin-top:7px;font-size:12px;opacity:.8;}
</style>

</head>

<body>

<div class="page">

<header class="hero">

${logoHtml}

<h1>
${escapeHtml(restaurant.name)}
</h1>

${restaurantDescription}

<div class="powered">
LAMSA • لمسة
</div>

</header>

<main class="menu">

${sections}

</main>

<footer class="footer">
<div class="footer-brand">LAMSA</div>
<div class="footer-copy">الحقوق محفوظة بواسطة M/mohamed abdalaziem</div>
</footer>

</div>

</body>

</html>
`;
}


// =========================
// ERROR MENU
// =========================
