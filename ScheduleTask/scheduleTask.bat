@echo off
rem Skrypt dodaje zadanie w harmonogramie z uprawnieniami użytkownika SYSTEM
rem Nazwe zadania podaj w parametrze podczas uruchomienia
rem Przyklad wywolania: scheduleTask.bat NoweZadanie
rem powoduje dodanie zadania o nazwie NoweZadanie do harmonogramu
rem wymaga pliku xml z informacjami o zadaniu, xml musi byc odpowiednio nazwany (nazwa zadania z parametru z dopiskiem _data, np NoweZadanie_data.xml)
rem opcjonalnie mozna dodac plik .bat z akcja do wykonania, nazwa skryptu w pliku xml musi byc taka sama jak nazwa zadania z dopiskiem _script (np NoweZadanie_script.bat)

set task=%1

rem Folder z plikami do Harmonogramu zadania
set taskFolder=%~dp0%taskschd

net session >NUL 2>&1
if NOT %ErrorLevel%==0 (
	echo Uruchom skrypt z prawami administratora
	goto end
)

echo. 

echo Sprawdzanie czy komputer/uzytkownik jest w domenie...
for /F "tokens=2 delims==" %%H in ('set user ^| findstr "USERDOMAIN"') do (
 if /I "%%H" EQU "DOMAIN" (
	echo Komputer/uzytkownik w domenie %%H
	goto skip
 )
 if /I "%%H" NEQ "DOMAIN" (
	echo Dodaj komputer do domeny lub zaloguj sie na konto domenowe
	)
	goto notdomain
)
:notdomain
echo Komputer/uzytkownik %COMPUTERNAME% / %USERNAME& nie jest w domenie, dolacz do domeny a nastepnie uruchom skrypt z prawami administratora
goto end

:skip
echo.

echo Kopiowanie skryptu %task%_script.bat
copy %taskFolder%\%task%_script.bat C:\Windows\Temp\

echo Dodawanie zadania %task%

Schtasks /Create /XML %taskFolder%\%task%_data.xml /tn %task% /ru "SYSTEM"
:end
pause