$plist = Get-Printer
Write-Host "Installed printers"
$i = 1
Foreach ($p in $plist.Name) {
    Write-Host $i'. '$p
    $i++
}
$input = Read-Host -Prompt 'Printer numbers that should be deleted (separate using spaces)'
$inpArr = $input -Split ' '
if($inpArr){
$inpArr.Length
$j
    Foreach($j in $inpArr) {
        $pName = $plist.Name[$j-1]
        Write-Host 'Deleting printer'$pName
        Remove-Printer -Name $pName
    }
} else {
    Write-Host "Number not provided."
}


