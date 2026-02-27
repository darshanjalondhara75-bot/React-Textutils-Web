@echo off
echo ===============================================
echo SSL Certificate System Test
echo ===============================================
echo.

echo Testing basic SSL script functionality...
echo This will check if the SSL renewal script is properly configured.

powershell -ExecutionPolicy Bypass -File "ssl-renewal.ps1" -Domain "wordcounter.com" -Email "test@wordcounter.com" -RenewalThresholdDays 30

echo.
echo SSL system test completed!
echo Check the logs directory for results.
pause