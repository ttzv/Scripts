const dataSheet = ss.getSheetByName(dataSheetName);

function getSheetUserInfo() {
  let dataRange = dataSheet.getDataRange();
  let contacts = dataRange.getValues().reduce( (acc, dataRow, index) => {
    if (index > 0 && isValidatedRow(dataRow)) {
      acc.push(createUserInfo(dataRow));
    }
    return acc;
  }, [])
  return contacts;
}

function createUserInfo(data){
  let emails = extractEmails(data);
  let phones = extractPhones(data);
  return {
      //fullName: `${data[Column.givenName]} ${data[Column.familyName]}`,
      //givenName: data[Column.givenName],
      //familyName: data[Column.familyName],
      //emails: emails.emails, //only alternative emails because primaryEmail cannot be here
      userKey: emails.primaryEmail,
      notes: data[Column.notes],
      phones: phones,
      organizations: [{
        name: data[Column.companyName],
        primary: true,
        location: data[Column.city],
        title: data[Column.title]
      }]
    };
}

function isValidatedRow(data){
  return data[Column.emails].length !== 0;
}

/* Extracts emails from e-mail column, if there are more than one first of them is assumed as a primary email and userKey.
    Separators can be either comma or newline (or both). secondary emails are saved as type: work
    CURRENTLY EMAILS ARE NOT SYNCHRONIZED TO GOOGLE DIRECTORY
*/
function extractEmails(data){
  let emails = data[Column.emails];
  emails = unaccent(emails).trim();
  emails = emails.replace(new RegExp(/[,; ]/g), "")
  emails = emails.split("\n");
  let emailsObj = emails.reduce((acc, email, index) => {
    if(index === 0){
      acc.primaryEmail = email;
    }  
    if(!acc.emails) {
      acc.emails = [];
    }
    acc.emails.push({
      address: email,
      // primary: false,
      type: "work"
      });
    return acc;
  },{})
  return emailsObj;
}

function extractPhones(data){
  let phones = [];
  let work_mobile = data[Column.workMobile];
  let work = data[Column.work];
  let isPrimary = true;
  splitPhones(work_mobile).forEach((phone, index) => {
    let customType = `Work mobile ${index+1}`;
    let phoneObj = {value: phone,
                    primary: isPrimary};
    if(index === 0){
      phoneObj.type = "work_mobile";
    } else {
      phoneObj.customType = customType;
    }
    phones.push(phoneObj);
    isPrimary = false;
  }); 
  splitPhones(work).forEach((phone, index) => {
    let customType = `Work ${index+1}`;
    let phoneObj = {value: phone,
                    primary: isPrimary};
    if(index === 0){
      phoneObj.type = "work";
    } else {
      phoneObj.customType = customType;
    }
    phones.push(phoneObj);
    isPrimary = false;
  })
  return phones;
}

function splitPhones(phoneCellValue){
  let phoneStr = phoneCellValue.toString();
  let separator = "\n";
  Logger.log(`phn:${phoneStr}`)
  if(!phoneStr.includes(separator)){
    separator = ",";
  }
  return phoneStr.split(separator).map(phone => {
    return phone.trim().replace(new RegExp(/\s*[Ww]ew./g), ",");
  }).filter(phone => phone.length >= 9);
}

// Todo: compare ColumnsId and Columns object, stop script execution if values does not correspond to each other.
function checkHeadingsValidity(){

}

// This is needed for debug purposes
function findUser(data, userKey){
  for(i=0; i<data.length; i++){
    if (data[i].userKey === userKey){
      return data[i];
    }
  }
  return null;
}
