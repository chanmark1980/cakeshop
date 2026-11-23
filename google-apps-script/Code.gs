// Google Apps Script - 寫入 Google Sheets _demo > contact
// 用法:
// 1. 開 Google Sheets, 開一個叫 _demo 嘅試算表 (如果未有)
// 2. 入面開一個分頁叫 contact, 第一行寫: timestamp | email | source | page_title
// 3. 喺 _demo 入面: 擴充功能 > Apps Script, 貼入呢個檔案
// 4. 部署 > 新增部署 > 類型: 網頁應用程式, 執行身分: 我, 存取權: 所有人
// 5. 複製 Web App URL, 貼入 js/main.js 嘅 SHEET_ENDPOINT

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // 如果你個檔案唔係叫 _demo, 下面改成你個檔案名, 或者直接用 getActiveSpreadsheet
    // var ss = SpreadsheetApp.openById("YOUR_SPREADSHEET_ID");
    var sheet = ss.getSheetByName("contact");
    if (!sheet) {
      sheet = ss.insertSheet("contact");
      sheet.appendRow(["timestamp", "email", "source", "page_title"]);
    }
    var data = JSON.parse(e.postData.contents);
    var email = (data.email || "").toString().trim();
    if (!email) {
      return ContentService.createTextOutput(JSON.stringify({ok:false, error:"no email"})).setMimeType(ContentService.MimeType.JSON);
    }
    sheet.appendRow([new Date(), email, data.source || "", data.page_title || ""]);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false, error: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("OK - _demo > contact endpoint is live");
}
