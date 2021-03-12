# Automatically generates email address for users without one and updates their email field.
# Email address is generated from givenname and sn property, with dot '.' between and @domain appended after. 

# Configure for your domain below:
# email address domain
$domain = '@example.com'

# Search base - you can provide top-level object of your LDAP to scan all users or 
# any OU to scan users in specific organizational units.
$searchBase = "dc=domain,dc=local"

# List of account this script should ignore.
$ignoredAccounts = 'demo','admin'

function Remove-StringLatinCharacters
{
    PARAM ([string]$String)
    [Text.Encoding]::ASCII.GetString([Text.Encoding]::GetEncoding("Cyrillic").GetBytes($String))
}

$users = Get-ADUser -Filter * -SearchBase $searchBase -Properties samaccountname,givenname,sn,mail
Foreach ($user in $users){
     $usermail=$user.mail
     $username=$user.givenname
     $usersn=$user.sn
     $usersam=$user.SamAccountName
     if($usermail -notmatch "\S" -and $username -match "\S" -and $usersn -match "\S" -and $ignoredAccounts -notcontains $usersam){
        $usernewmail=$($username + '.' + $usersn + $domain).ToLower()
        $usernewmail = Remove-StringLatinCharacters $usernewmail
        
        Write-Host 'Email address empty:' $username $usersn ' proposed: ' $usernewmail
        Write-Host 'Updating email for ' $usersam

        Set-ADUser $usersam -EmailAddress $usernewmail
    }
}