# Asks for user sAMAccountName and makes it so the user has to
# change their password when they log in for the first time.

$uName = Read-Host -Prompt "User"
Set-ADUser -ChangePasswordAtLogon $true -Identity $uName -Confirm:$false -Verbose