// 阿Yan蛋糕店 - js/main.js
// 1) 改呢度就得: Google Sheets _demo > contact 嘅 Apps Script Web App URL
// 喺 google-apps-script/Code.gs 部署後，將 URL 貼入下面
const SHEET_ENDPOINT = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // TODO: 換成你真正嘅 Apps Script URL
const WHATSAPP_NUMBER = "85265424488"; // 852-65424488

function pushDL(obj){
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(obj);
}

// 產品篩選 (products.html)
function initFilter(){
  const btns = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");
  if(!btns.length) return;
  btns.forEach(function(b){
    b.addEventListener("click", function(){
      btns.forEach(function(x){x.classList.remove("active")});
      b.classList.add("active");
      const f = b.getAttribute("data-filter");
      cards.forEach(function(c){
        const show = (f==="all" || c.getAttribute("data-category")===f);
        c.style.display = show ? "" : "none";
      });
      pushDL({event:"filter_products", filter_value:f});
    });
  });
}

// 產品詳情展開 + 點擊追蹤
function initProducts(){
  document.querySelectorAll("[data-product]").forEach(function(el){
    el.addEventListener("click", function(){
      const name = el.getAttribute("data-product");
      pushDL({event:"view_product", product_name:name, page_path: location.pathname});
    });
  });
  document.querySelectorAll("[data-whatsapp]").forEach(function(el){
    el.addEventListener("click", function(){
      const product = el.getAttribute("data-whatsapp") || "一般查詢";
      pushDL({event:"whatsapp_click", product_name:product, whatsapp_number: WHATSAPP_NUMBER});
    });
  });
}

// Email 訂閱 -> 寫入 Google Sheets _demo > contact
function initEmailForm(){
  const form = document.getElementById("email-form");
  if(!form) return;
  const success = document.getElementById("email-success");
  const errorBox = document.getElementById("email-error");
  form.addEventListener("submit", async function(e){
    e.preventDefault();
    const emailInput = document.getElementById("email-input");
    const email = (emailInput.value || "").trim();
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      if(errorBox){ errorBox.style.display="block"; errorBox.textContent="請輸入正確嘅 Email，例如 you@example.com"; }
      return;
    }
    if(errorBox) errorBox.style.display="none";
    const payload = {
      email: email,
      source: location.pathname,
      page_title: document.title,
      timestamp: new Date().toISOString()
    };
    pushDL({event:"email_signup_start", email_signup_source: location.pathname});
    // 如果未填 Apps Script URL，就唔好假裝寫入成功
    if(!SHEET_ENDPOINT || SHEET_ENDPOINT.includes("YOUR_SCRIPT_ID")){
      if(success){ success.style.display="block"; success.textContent="已收到！提示：而家係示範模式，未接駁 Google Sheets。請喺 js/main.js 填入 Apps Script URL，之後就會自動寫入 _demo > contact。"; }
      return;
    }
    try{
      const res = await fetch(SHEET_ENDPOINT, {method:"POST", mode:"no-cors", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)});
      if(success){ success.style.display="block"; success.textContent="多謝你！已收到你嘅 Email，有新產品會第一時間通知你。資料已寫入 Google Sheets _demo > contact。"; }
      emailInput.value="";
      pushDL({event:"email_signup_success", email_signup_source: location.pathname});
    }catch(err){
      if(errorBox){ errorBox.style.display="block"; errorBox.textContent="暫時寫入唔到 Sheets，請直接 WhatsApp 852-65424488 聯絡我哋。"; }
      pushDL({event:"email_signup_error"});
    }
  });
}

document.addEventListener("DOMContentLoaded", function(){
  initFilter();
  initProducts();
  initEmailForm();
  pushDL({event:"page_view_custom", page_path: location.pathname, page_title: document.title});
});
