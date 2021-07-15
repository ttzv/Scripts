for /F "tokens=3 delims=: " %%H in ('sc query "openvpnservice" ^| findstr "        STATE"') do (
  if /I "%%H" NEQ "RUNNING" (
   REM Put your code you want to execute here
   REM For example, the following line
   net start "openvpnservice"
  )
)