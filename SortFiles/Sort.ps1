$dirList = ls
Foreach ($n in $dirList.Name){
    $nLength=$n.length
    If ($nLength -gt 6){
        $nFile = $n
	    $nResult=$n.substring(0, $nLength-5)
	    #$nResult
        $user = Get-ADUser -Filter {Name -eq $nResult}
        if($user -ne $null){
            $userCity = ($user.DistinguishedName.Split(","))[1].substring(3)
            $cDir = Get-Location
            $sourcePath = "$($cDir)\$nFile"
            #$sourcePath
            $targetPath = "$($cDir)\$userCity"
            #$targetPath
            $pExists = Test-Path $targetPath
            if(-not $pExists){
                New-Item -Path $targetPath -ItemType "directory"
            }
            Move-Item -Path $sourcePath -Destination $targetPath
            Write-Host "Moving file $($sourcePath) to $($targetPath)\$nFile"             
        }
    }
}
