# G Suite Directory Contacts Sync
Google Apps Script created to synchronize selected G Suite Directory user information with data stored in worksheet.

Main drive behind this script was to provide a centralized and easy access to phone numbers among employees. For example, if an employee wants to contact someone all it takes now is to type their name in the search bar - the directory entry will have the most recent phone number.

With the Apps Script posibility of setting the execution rules we can configure it to run periodically. In my job, the script currently runs once a week and keeps the directory updated.

# How it works
The worksheet acts as a main data source. Users in directory are identified by <b>UserKey</b> attribute - <b>Mail</b> column in worksheet.

If UserKey is found the script tries to update related User in Directory with information from worksheet - currently updated attributes are: phone numbers, location, company and position.

In case when UserKey does not exist or cannot be updated the error is logged and sent via email to configured address - variable <b>infoEmail</b> in <b>Configuration.gs</b>.

# Configuration
All configurable parameters can be found in Configuration.gs. The 
# Example