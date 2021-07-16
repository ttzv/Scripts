var dataRange = dataSheet.getDataRange();
var numCols = dataRange.getNumColumns();
var conv = SheetConverter.init();

function autodraft(options) {
  var config = initConfig();
  var mode = options.mode;
  
  cleanDataSheet(config.columns);
  
  var data = filterDataByRecipient(config);
  var userSignature = getUserSignature();
  
  data.forEach(function(d){
    var recipients = createEmailsFromRecipients(d).filter(function(r){
      return config.ignoredMails.indexOf(r) >= 0 ? false : true
    });
    var sheet = createFilteredDataSheet(d.name);
    dataRange.copyFormatToRange(sheet, 1, d.data.length, 1, numCols);
    var targetRange = sheet.getRange(2, 1, d.data.length, numCols);
    targetRange.setValues(d.data);
    var htmlDataRange = sheet.getDataRange();
    if(mode === "send"){
      sendEmail(
        recipients, 
        config.topic, 
        getMailContent(
          config.template,
          getRangeHtml(htmlDataRange),
          userSignature
        )
      )
    }
    if(mode === "draft"){
      createDraft(
        recipients, 
        config.topic, 
        getMailContent(
          config.template,
          getRangeHtml(htmlDataRange),
          userSignature
        )
      )
    }
    ss.deleteSheet(sheet);
  });
}

function filterDataByRecipient(config){
  
  var dataValues = dataRange.getValues();
  
  var recipientColumnIndex = getColumnByName(config.recipient, 1) - 1;
  var unique = [];
  var nameToIndex = {};
  return dataValues.reduce(function(total, currentValue, currentIndex){
    if (currentIndex !== 0){
      var recipient = currentValue[recipientColumnIndex];
      if(unique.indexOf(recipient) < 0){
        var object = {name:'',
                      data: [],
                      recipients:''
                     };
        unique.push(recipient);
        var cnt = unique.length - 1;
        nameToIndex[recipient] = cnt;
        object.name = 'sub' + cnt;
        object.data.push(currentValue);
        object.recipients = recipient;
        total.push(object);
      } else {
        total[nameToIndex[recipient]].data.push(currentValue);
      }
    }
    return total;
  }, []);
}

function getRangeHtml(range){
  return conv.convertRange2html(range);
}

function createDraft(recipients, subject, htmlBody){
  GmailApp.createDraft(recipients.join(','), subject, '',{
    htmlBody: htmlBody
  });
}

function sendEmail(recipients, subject, htmlBody){
  GmailApp.sendEmail(recipients.join(','), subject, '',{
    htmlBody: htmlBody,
    cc: ccMails.join(',')
  });
}

function applyColumnFormattingToRange(range){
  
}

function createEmailsFromRecipients(data){
  var recipientArr = data.recipients.split(', ');
  return recipientArr.map(function(r){
    var splitRec = unaccent(r).toLowerCase().split(' ');
    return splitRec[1] + '.' + splitRec[0] + domain;
  });
}


