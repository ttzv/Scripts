# G Suite Directory Contacts Sync
Google Apps Script created to synchronize selected G Suite Directory user information with data stored in worksheet.

Main drive behind this script was to provide a centralized and easy access to phone numbers among employees. For example, if an employee wants to contact someone all it takes now is to type their name in the search bar - the directory entry will have the most recent phone number.

Apps Script allows us to set execution rules, so we can configure it to run periodically. In my job, the script currently runs once a week and keeps the directory updated.

# How it works
The worksheet acts as a main data source. Users in directory are identified by **UserKey** attribute - **Mail** column in worksheet.

If UserKey is found the script tries to update related User in Directory with information from worksheet - currently updated attributes are: phone numbers, location, company and position.
Below you can see how columns are mapped to Contact fields. Please note the user email is not updated as it is used to identify User in Directory.

![Mapping](https://user-images.githubusercontent.com/35802406/125933053-bb36ce05-6e23-40e2-bb92-b94424cb09be.JPG)

In case when UserKey does not exist or cannot be updated the error is logged and sent via email to configured address - variable **infoEmail** in **Configuration.gs**.

# Configuration
All configurable parameters can be found in Configuration.gs file.

## How to configure columns
Column to Directory mapping is stored in Column object where keys are Directory attributes and values correspond to column order number. 

I plan to implement some sort of validation between column names (text values in first row) and column ordering. The idea would be to compare text value in the worksheet to the value in ColumnId object, something along the lines of:

`getHeading().getCell(0, Column.city).getValue() == ColumnId.city`

# How to run it
Create a new Google Apps Script project: [My Projects](https://script.google.com/u/0/home/my)
Copy everything from:
`SirectoryUpdate.gs`
`SheetParse.gs`
`logs.html`
`unaccent.gs`
`Configuration.gs`
to corresponding files.

Configure the script to your needs in Configuration.gs file.

Add AdminDirectory Service.

Execute the runSync() function. You will be prompted for additional permissions.

Done!
