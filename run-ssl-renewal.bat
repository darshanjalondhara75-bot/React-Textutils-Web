@echo off
echo ===============================================
echo SSL Certificate Renewal for WordCounter
echo ===============================================
echo.

REM Set your domain and email here
set DOMAIN=wordcounter.com
set EMAIL=admin@wordcounter.com
set THRESHOLD=30

echo Domain: %DOMAIN%
echo Email: %EMAIL%
echo Renewal Threshold: %THRESHOLD% days
echo.

REM Run the PowerShell script with parameters
powershell -ExecutionPolicy Bypass -File "ssl-renewal.ps1" -Domain %DOMAIN% -Email %EMAIL% -RenewalThresholdDays %THRESHOLD% -InitialSetup

echo.
echo SSL renewal check completed!
echo Check the logs folder for detailed results.
echo.
pause