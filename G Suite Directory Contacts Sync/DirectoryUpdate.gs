function runSync() {
  let timestart = Date.now();
  let sheetUserInfo = getSheetUserInfo();
  let errors = []
  sheetUserInfo.forEach(user => {
    let userKey = user.userKey;
    try{
      Logger.log(`Trying to update: ${userKey}`);
      delete user.userKey; // just in case
      AdminDirectory.Users.update(user, userKey);
    } catch (error) {
      errors.push({userKey: userKey, message: error});
    }
  });
  if (errors.length > 0){
    sendMail(infoemail, errors);
  }

  let timeend = Date.now();
  Logger.log(timeend - timestart); //check how long the whole process took
}

function getHeading(){
  return dataSheet.getRange(1, 1, 1, dataSheet.getLastColumn());
}

function test(){
  let data = getSheetUserInfo();
  let userUpdate = findUser(data, "test.user@yourdomain.com");
  Logger.log(userUpdate);
  let userKey = userUpdate.userKey; 
  delete userUpdate.userKey
  AdminDirectory.Users.update(userUpdate, userKey);
}

function errorlogHTML(errors){
  let template = HtmlService.createTemplateFromFile('logs');
  template.errors = errors;
  return template.evaluate().getContent();
}

function sendMail(recipient, templateParams){
  MailApp.sendEmail({
    to: recipient,
    subject: "Google Directory sync errors.",
    htmlBody: errorlogHTML(templateParams),
    noReply: true
  })
}

function listAllUsers() {
  var pageToken;
  var page;
  do {
    page = AdminDirectory.Users.list({
      domain: domain,
      orderBy: 'givenName',
      maxResults: 100,
      pageToken: pageToken
    });
    var users = page.users;
    if (users) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if(user.primaryEmail === ""){
          Logger.log('%s (%s) | (%s)', user.name.fullName, user.primaryEmail, user.aliases);
        }
      }
    } else {
      Logger.log('No users found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
}
