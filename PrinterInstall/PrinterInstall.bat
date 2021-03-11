@echo off

REM Installs printer with provided IP and name.
REM Make sure you have appropriate .inf driver for your printer in ./Driver folder next to this script.
REM By default script installs two versions of the same printer with following configuration:
REM 1. Grayscale and one-sided printing
REM 2. Color and two-sided printing
REM Some additional configuration on lines 46 and 52-54 is required for this to work.
REM Script tested for Konica Minolta C353 and Universal PCL drivers.

pushd "%~dp0"
setlocal EnableDelayedExpansion
set ip=%1

set printColorSuffix=(Color)

if [!ip!] == [] (
	set /p ip="Printer IP: "
)

set printName=%2

if [!printName!] == [] (
	set /p printName="Printer name: "
)

echo Searching driver .inf
cd Driver
FOR /F "tokens=* USEBACKQ" %%F IN (`dir Driver /s /b *.inf`) DO (
SET driverPath=%%F
)
IF driverPath.==. GOTO nodriver
cd ..

ECHO .inf path: %driverPath%
echo.
echo Installing printer:
echo IP: !ip!
echo Name: !printName!
echo Driver: !driverPath!
echo.


REM Change language in line below to match your locale, default en-US.
REM To check your locale use (Get-WinSystemLocale).Name in PowerShell
cscript %WINDIR%\System32\Printing_Admin_Scripts\pl-PL\Prnport.vbs -a -r IP_!ip! -h !ip! -o raw -n 9100

set printColorName="%printName% %printColorSuffix%"

REM Change <printerModel> to your printer model. For example: "KONICA MINOLTA Universal PCL5" for Konica Minolta PCL5 driver.
REM Correct driver name is required, the script will fail if you provide incorrect
rundll32 printui.dll,PrintUIEntry /ia /m "<printerModel>" /f "%driverPath%"
rundll32 printui.dll,PrintUIEntry /if /b "%printName%" /f "%driverPath%" /r "IP_!ip!" /m "<printerModel>"
rundll32 printui.dll,PrintUIEntry /if /b %printColorName% /f "%driverPath%" /r "IP_!ip!" /m "<printerModel>"
echo Configuring printer preferences
powershell $PNA = '%printName%';Set-PrintConfiguration -PrinterName $PNa -Color 0 -DuplexingMode OneSided

set default=%3
if [!default!]==[N] GOTO skipDefault
if [!default!] == [] (
	set /p default="Do you want to set %printName% as a default printer? (Y/N) "
)
if %default%==Y ( 
	echo Setting as default
	rundll32 printui.dll,PrintUIEntry /y /n "%printName%"
) else (GOTO skipDefault)

:skipDefault
GOTO end
:nodriver
echo Driver missing
:end
echo The end
popd