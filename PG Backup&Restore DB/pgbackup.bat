   @echo off
   cd %~dp0
   for /f "tokens=1-4 delims=/ " %%i in ("%date%") do (
     set dow=%%i
     set month=%%j
     set day=%%k
     set year=%%l
   )
   For /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
   
   set datestr=%dow%-%month%-%day%_%mytime%
   echo datestr is %datestr%
       
   set BACKUP_FILE=itemdb_%datestr%.backup
   echo backup file name is %BACKUP_FILE%
   SET PGPASSWORD=admin
   echo on
   ..\bin\pg_dump -h localhost -p 5432 -U postgres -F c -b -v -f %BACKUP_FILE% itemdb