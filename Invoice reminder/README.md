# Invoice reminder
Script that extends functionality of a worksheet with customizable option to send invoice reminders to groups of users.  
This is a custom solution that automates a task that had to be done manually before.  
I had to meet the following requirements when designing this solution:
* Create a mail template with dynamic content - list of overdue invoices.
* Find a way to form an HTML table that could be injected into mail content, ideally preserve formatting.
* Parse dataset and create separate groups of recipients.
* Automatically create email address from implementing person's name.
* Append user signature to every message. 
* Send reminders using Gmail account of an user that launched a script.

# How does it work
In this solution the Spreadsheet contains two sheets:  
**Data sheet** - where users can paste data, for example from ERP software.  
**Config sheet** - where users can configure script behavior to their needs.

Taking a look at Config Sheet:

![invoicerem2](https://user-images.githubusercontent.com/35802406/125944539-c7e8756c-6a01-47c2-a589-032dfb95afe0.png)

I did my best to make this self-explanatory.  
What's worth mentioning is the **<tab>** field - location of this field determines where the HTML table will be inserted.

## Configuration
Summarizing, you can configure:
* Mail topic
* Mail content
* Which column should be used to form recipient email address (Recipient column)  
* Which columns should be included in HTML table (columns not included here will be deleted)
* A list of emails which should't receive a reminder
* A CC address - for example for testing purposes, every message will also be sent to this address.

## Data sheet
Data with column headers must be pasted in this sheet. There is no need to delete unneeded column as you can configure it in the Config sheet.
![invoicerem1](https://user-images.githubusercontent.com/35802406/125949711-301881dc-9e90-43e3-9b59-a71e9e805b45.png)
  
## HTML table
For creating an HTML table I used a great library created by [mogsdad](https://github.com/mogsdad) - [SheetConverter](https://github.com/mogsdad/SheetConverter)

## Performance
At first, I called getRange() method every time I needed to read a new value from a sheet. The script was **very** slow.  
When I learned about the fact it makes an API call I changed the logic to read the whole dataset and make API calls only where it is really necessary.  
This small change made the executiom proces about thrice as fast.
  
# Example
  
Select suitable option from **Mail** menu above toolbar.  
  ![image](https://user-images.githubusercontent.com/35802406/125951179-ed15e538-6d44-48cf-9234-d860a46a1a48.png)
  
  You will be notified with the following dialog:  
  ![image](https://user-images.githubusercontent.com/35802406/125951348-c8238ed9-4463-4595-9bb7-97975858db4d.png)
  
  When everything completes your recipients will see similar message:  
  ![invoicerem4](https://user-images.githubusercontent.com/35802406/125951440-46fca6b5-7b53-4e9e-ba63-c1fa4f15a219.png)

  
You can make your own copy of [this spreadsheet](https://docs.google.com/spreadsheets/d/14s5h3SrtYj8BSssdgKTfu7yjDt2566ZiGRdnAZ_UtSM/edit?usp=sharing) and try it out.
