var ss = SpreadsheetApp.getActiveSpreadsheet();
var ui = SpreadsheetApp.getUi();
var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(dataSheetName);
var config = null;
var startMsg = "Pressing OK will start script execution which, depending on dataset volume, may take a long time. Please DO NOT make any changes in the worksheet during execution. You can minimize the browser or change tabs. You will be notified when script finishes execution.";

function initConfig(){
  var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  var configValues = configSheet.getDataRange().getValues();
  var subject = configValues[0][1];
  var template = configValues[1][1]; 
  var recipient = configValues[2][1]; 
  var columns = configValues[3][1].split('\n').filter(Boolean);
  var ignoredMails = configValues[4][1].split('\n').filter(Boolean);
  var ccMails = configValues[5][1].split('\n').filter(Boolean);
  return {
    topic: subject,
    template: template,
    recipient: recipient,
    columns: columns,
    ignoredMails: ignoredMails
  }
}

function debug(){
  var config = initConfig();
  var recipients = ['first@first.com','second@second.com','ignorethisaddress@domain.com'].filter(function(r){
        return config.ignoredMails.indexOf(r) >= 0 ? false : true
  });
  Logger.log(recipients);
}

function onOpen(e) {
  ui.createMenu("Mail")
  .addItem('Prepare drafts', 'draft')
  .addItem('Send immediately', 'send')
  .addItem('Reset sheet', 'reset')
  .addToUi();
}

function prepareDrafts(config) {
  var conv = SheetConverter.init();
  var sheets = ss.getSheets();
  var signature = getUserSignature();
  sheets.forEach(function(sheet){
    if(sheet.getName().indexOf('sub') !== -1){
      var html = conv.convertRange2html(sheet.getDataRange());
      var htmlBody = getMailContent(config.template, html, signature);
      GmailApp.createDraft('enter@emails.abc', config.subject, '',{
        htmlBody: htmlBody
      });
    }
  });
}

function draft(){
  showAlert(startMsg);
 
  autodraft({mode: "draft"});
  
  var htmlOutput = HtmlService
  .createHtmlOutputFromFile('progress');
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Done');
}

function send(){
  showAlert(startMsg);
 
  autodraft({mode: "send"});
  
  var htmlOutput = HtmlService
  .createHtmlOutputFromFile('progress_send');
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Done');
}

function filterRecipients(recipientColumn){
  var counter = 0;
  var recipientSheetMap = {};
  var recipientRange = dataSheet.getDataRange();
  for(i = 2; i <= recipientRange.getNumRows(); i++){
    var cell = recipientRange.getCell(i, recipientColumn);
    var recipientGroupName = cell.getValue();
    var sheetName = recipientSheetMap[recipientGroupName];
    var sheet = null;
    if (sheetName !== undefined){
      sheet = getSheetByName('sub' + sheetName);
    } else {
      sheet = createFilteredDataSheet('sub' + counter);
      recipientSheetMap[recipientGroupName] = counter;
      counter++;
    }
    var sourceRange = dataSheet.getRange(i, 1, 1, recipientRange.getNumColumns());
    var destRange = sheet.getRange(sheet.getDataRange().getNumRows() + 1, 1, 1, recipientRange.getNumColumns());
    sourceRange.copyTo(destRange);
  }
}

function cleanDataSheet(selectedColumns){
  var uColumns = getHeading();
  for( i = 1; i <= uColumns.getNumColumns(); i++){
    var cell = uColumns.getCell(1, i);
    var cellValue = cell.getValue();
    if(cellValue.length == 0){
      break;
    }
    if(selectedColumns.indexOf(cellValue) < 0){
      dataSheet.deleteColumn(i);
      i--;
    }
  }
}

function showAlert(text){
  ui.alert(text)
}

function findUniqueRecipientGroups(){
  var ss = SpreadsheetApp.getActiveSheet();
  var recipientsColumn = 10;
  var range = ss.getRange(2, 10, ss.getLastRow(), 1)
  var values = [].concat.apply([], range.getValues());
  var uniqueValues = values.filter(onlyUnique);
  Logger.log(uniqueValues);
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function isEmpty(s){
  s.isEmpty();
}

function getColumnByName(name, row){
  var range = dataSheet.getRange(row, 1, 1, dataSheet.getLastColumn());
  for(i = 1; i < range.getNumColumns(); i++){
    if( range.getCell(row, i).getValue() == name){
      return i;
    }
  }
}

function createFilteredDataSheet(sheetName){
  var newSheet = ss.insertSheet(sheetName);
  getHeading().copyTo(newSheet.getDataRange());
  return newSheet;
}

function getHeading(){
  return dataSheet.getRange(1, 1, 1, dataSheet.getLastColumn());
}

function deleteSubSheets(){
  var sheets = ss.getSheets().forEach(function(sheet){
    if(sheet.getName().indexOf('sub') !== -1){
      ss.deleteSheet(sheet);
    }
  });
}

function getSheetByName(sheetName){
  return ss.getSheetByName(sheetName);
}

function getMailContent(template, content, signature){
  var html = template.split('\n');
  var tabIndex = html.indexOf('<tab>');
  html[tabIndex] = content;
  html.push('<br><br>-- ');
  html.push(signature);
  return html.join('<br>');
}

function getUserSignature(){
  return Gmail.Users.Settings.SendAs.list("me").sendAs.filter(function(account){if(account.isDefault){return true}})[0].signature;
}

function reset(){
  deleteSubSheets();
  dataSheet.clear();
}