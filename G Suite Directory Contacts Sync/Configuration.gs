// Configuration parameters.

// Sheet
const devSheet = "https://docs.google.com/spreadsheets/d/156ggVgwecLBF3r7exFvT_m_z6T65rsWtfzMFCgkpEhY/edit"; //sheet used for testing
const prodSheet = "https://docs.google.com/spreadsheets/d/156ggVgwecLBF3r7exFvT_m_z6T65rsWtfzMFCgkpEhY/edit"; //sheet used in production
const ss = SpreadsheetApp.openByUrl(prodSheet); //set for devSheet of prodSheet
const dataSheetName = 'Contacts'; //your datasheet name with contacts goes here

// Columns configuration, more info how it works can be found in readme.md
const ColumnId = {
    companyName: "Company",
    city: "Office",
    givenName: "Name",
    familyName: "Surname",
    title: "Position",
    workMobile: "Mobile phone number",
    work: "Phone number",
    emails: "Mail",
    notes: "Notes"
  }
  
  const Column = {
    companyName: 1,
    city: 2,
    givenName: 3,
    familyName: 4,
    title: 5,
    workMobile: 6,
    work: 7,
    emails: 8,
    notes: 9
  }

// Email addresses
const domain = 'yourdomain.com';
const infoEmail = 'infoEmail@yourdomain.com';
const testEmail = 'testEmail@yourdomain.com';


