# SSL Certificate Automated Renewal Script for WordCounter
# This script monitors certificate expiration and renews when needed

param(
    [string]$Domain = "wordcounter.com",
    [int]$RenewalThresholdDays = 30,
    [string]$Email = "admin@wordcounter.com",
    [switch]$InitialSetup,
    [switch]$DailyCheck,
    [int]$DaysUntilExpiry = 90
)

Write-Host "🔄 SSL Certificate Renewal Monitor for WordCounter" -ForegroundColor Green
Write-Host "Domain: $Domain" -ForegroundColor Cyan
Write-Host "Renewal Threshold: $RenewalThresholdDays days" -ForegroundColor Cyan
Write-Host ""

# Function to check certificate expiry
function Test-CertificateExpiry {
    param([string]$Domain)
    
    try {
        $request = [System.Net.WebRequest]::Create("https://$Domain")
        $request.Method = "HEAD"
        $response = $request.GetResponse()
        $cert = $request.ServicePoint.Certificate
        
        # Parse certificate expiry
        $expiryDate = $cert.GetExpirationDateString()
        $certExpiryDate = [DateTime]::Parse($expiryDate)
        $daysRemaining = ($certExpiryDate - (Get-Date)).Days
        
        return @{
            DaysRemaining = $daysRemaining
            ExpiryDate = $certExpiryDate
            IsValid = $certExpiryDate -gt (Get-Date)
        }
    }
    catch {
        Write-Host "❌ Error checking certificate: $($_.Exception.Message)" -ForegroundColor Red
        return @{ DaysRemaining = 0; ExpiryDate = (Get-Date); IsValid = $false }
    }
}

# Function to install Certbot
function Install-Certbot {
    Write-Host "🔧 Checking Certbot installation..." -ForegroundColor Yellow
    
    # Check if certbot is already installed
    if (Get-Command certbot -ErrorAction SilentlyContinue) {
        Write-Host "✅ Certbot is already installed" -ForegroundColor Green
        return $true
    }
    
    # Try to install certbot using Chocolatey
    try {
        Write-Host "Installing Certbot via Chocolatey..." -ForegroundColor Yellow
        choco install certbot -y
        return $true
    }
    catch {
        # If Chocolatey fails, try winget
        try {
            Write-Host "Trying winget installation..." -ForegroundColor Yellow
            winget install Certbot.Certbot
            return $true
        }
        catch {
            Write-Host "❌ Failed to install Certbot automatically" -ForegroundColor Red
            Write-Host "Please install Certbot manually from: https://certbot.eff.org/" -ForegroundColor Yellow
            return $false
        }
    }
}

# Function to renew certificate with Let's Encrypt
function Renew-LetsEncryptCertificate {
    param([string]$Domain, [string]$Email)
    
    Write-Host "🔄 Starting Let's Encrypt certificate renewal..." -ForegroundColor Yellow
    
    try {
        # Install Certbot if not available
        if (!(Install-Certbot)) {
            return $false
        }
        
        # Ensure email is provided
        if ([string]::IsNullOrWhiteSpace($Email)) {
            Write-Host "❌ Email address is required for Let's Encrypt" -ForegroundColor Red
            return $false
        }
        
        # Renew certificate using certbot
        Write-Host "🔐 Renewing certificate for $Domain..." -ForegroundColor Yellow
        $certbotArgs = @(
            "renew",
            "--email", $Email,
            "--domain", $Domain,
            "--agree-tos",
            "--non-interactive",
            "--force-renewal"
        )
        
        $processInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processInfo.FileName = "certbot"
        $processInfo.Arguments = $certbotArgs -join " "
        $processInfo.RedirectStandardOutput = $true
        $processInfo.RedirectStandardError = $true
        $processInfo.UseShellExecute = $false
        $processInfo.CreateNoWindow = $true
        
        $process = New-Object System.Diagnostics.Process
        $process.StartInfo = $processInfo
        $process.Start()
        $processOutput = $process.StandardOutput.ReadToEnd()
        $processError = $process.StandardError.ReadToEnd()
        $process.WaitForExit()
        
        if ($process.ExitCode -eq 0) {
            Write-Host "✅ Certificate renewal completed successfully!" -ForegroundColor Green
            Write-Host "📝 Renewal output: $processOutput" -ForegroundColor Cyan
            return $true
        } else {
            Write-Host "❌ Certificate renewal failed with exit code: $($process.ExitCode)" -ForegroundColor Red
            Write-Host "Error output: $processError" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Certificate renewal failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to send notification
function Send-RenewalNotification {
    param([string]$Subject, [string]$Message)
    
    Write-Host "📧 Sending notification: $Subject" -ForegroundColor Cyan
    
    try {
        # Try to send email notification using Windows built-in SMTP
        $smtpServer = "smtp.gmail.com"
        $smtpPort = 587
        $fromEmail = $Email
        $toEmail = $Email
        
        # Create email message body with better formatting
        $emailBody = @"
SSL Certificate Notification for WordCounter
============================================

Subject: $Subject
Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Domain: $Domain

Message:
$Message

---
This is an automated notification from your SSL certificate monitoring system.
If you received this in error, please contact your system administrator.
"@
        
        # Try to send email (will prompt for credentials if not already set)
        Write-Host "🔑 Attempting to send email via SMTP..." -ForegroundColor Yellow
        
        # Create credential object (you may need to set this up)
        $securePassword = Read-Host "Enter your email password (App Password recommended)" -AsSecureString
        $credential = New-Object System.Management.Automation.PSCredential($Email, $securePassword)
        
        $mailParams = @{
            From = $fromEmail
            To = $toEmail
            Subject = $Subject
            Body = $emailBody
            SmtpServer = $smtpServer
            Port = $smtpPort
            UseSsl = $true
            Credential = $credential
        }
        
        Send-MailMessage @mailParams
        Write-Host "✅ Email notification sent successfully!" -ForegroundColor Green
        Write-Host "📧 Email sent to: $Email" -ForegroundColor Cyan
    }
    catch {
        Write-Host "⚠️  Email notification failed: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "📝 Notification logged locally for review" -ForegroundColor Yellow
        
        # Log notification to file as backup
        $logEntry = @"

=== SSL RENEWAL NOTIFICATION LOG ===
Date: $(Get-Date)
To: $Email
Subject: $Subject
Domain: $Domain
Message: $Message
Error: $($_.Exception.Message)

====================================
"@
        
        # Ensure log directory exists
        if (!(Test-Path "logs")) {
            New-Item -ItemType Directory -Path "logs" -Force | Out-Null
        }
        
        Add-Content -Path "logs\ssl-renewal-notifications.log" -Value $logEntry
        Write-Host "📝 Notification logged to: logs\ssl-renewal-notifications.log" -ForegroundColor Cyan
        
        # Alternative: Send notification via webhook (if configured)
        if ($env:WEBHOOK_URL) {
            try {
                $webhookPayload = @{
                    text = "🔒 SSL Certificate Alert - $Domain"
                    attachments = @(
                        @{
                            color = "warning"
                            text = "$Subject`n$Message`nDate: $(Get-Date)"
                        }
                    )
                }
                
                Invoke-RestMethod -Uri $env:WEBHOOK_URL -Method Post -Body ($webhookPayload | ConvertTo-Json -Depth 10) -ContentType "application/json"
                Write-Host "✅ Webhook notification sent successfully!" -ForegroundColor Green
            }
            catch {
                Write-Host "⚠️  Webhook notification also failed" -ForegroundColor Yellow
            }
        }
    }
}

# Function to log SSL monitoring results
function Write-LogEntry {
    param([string]$Message, [string]$Level = "INFO")
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    # Ensure log directory exists
    if (!(Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" -Force | Out-Null
    }
    
    # Write to log file
    Add-Content -Path "logs\ssl-monitoring.log" -Value $logEntry
    
    # Also display to console with color coding
    switch ($Level) {
        "ERROR" { Write-Host $logEntry -ForegroundColor Red }
        "WARNING" { Write-Host $logEntry -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $logEntry -ForegroundColor Green }
        default { Write-Host $logEntry -ForegroundColor Cyan }
    }
}

# Function to update SSL status tracking
function Update-SSLStatusTracking {
    param($CertStatus)
    
    $trackingData = @{
        LastCheck = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Domain = $Domain
        DaysRemaining = $CertStatus.DaysRemaining
        ExpiryDate = $CertStatus.ExpiryDate.ToString("yyyy-MM-dd")
        Status = if ($CertStatus.IsValid) { "Valid" } else { "Invalid" }
        RenewalThreshold = $RenewalThresholdDays
        NeedsRenewal = $CertStatus.DaysRemaining -lt $RenewalThresholdDays
    }
    
    # Save tracking data
    $trackingData | ConvertTo-Json -Depth 10 | Out-File -FilePath "logs\ssl-status.json" -Encoding UTF8
    
    return $trackingData
}

# Function to check if renewal is needed based on 90-day cycle
function Test-RenewalRequired {
    param($CertStatus)
    
    # Check if certificate is within 30 days of expiry (standard threshold)
    $withinThreshold = $CertStatus.DaysRemaining -lt $RenewalThresholdDays
    
    # Check if certificate is older than 60 days (for proactive renewal)
    $daysOld = 90 - $CertStatus.DaysRemaining  # Assume 90-day certs from Let's Encrypt
    $isOld = $daysOld -gt 60
    
    # Check if last renewal was more than 60 days ago
    $lastRenewalDate = if (Test-Path "logs\ssl-status.json") {
        (Get-Content "logs\ssl-status.json" | ConvertFrom-Json).LastCheck
    } else { $null }
    
    $needsProactiveRenewal = $false
    if ($lastRenewalDate) {
        $lastRenewal = [DateTime]::Parse($lastRenewalDate)
        $daysSinceRenewal = ((Get-Date) - $lastRenewal).Days
        $needsProactiveRenewal = $daysSinceRenewal -gt 60
    }
    
    return @{
        WithinThreshold = $withinThreshold
        IsOld = $isOld
        NeedsProactive = $needsProactiveRenewal
        ShouldRenew = $withinThreshold -or $needsProactiveRenewal
    }
}

# Main monitoring and renewal logic
Write-Host "🔍 Starting SSL Certificate Monitoring for $Domain" -ForegroundColor Green
Write-Host "📅 Current Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "⏰ Let's Encrypt Certificate Cycle: 90 days" -ForegroundColor Cyan
Write-Host "⚠️  Renewal Threshold: $RenewalThresholdDays days" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White

# Check certificate status
$certStatus = Test-CertificateExpiry -Domain $Domain
Write-LogEntry "Certificate check completed. Days remaining: $($certStatus.DaysRemaining)"

if ($certStatus.DaysRemaining -lt 0) {
    Write-Host "🚨 CRITICAL: Certificate has EXPIRED!" -ForegroundColor Red
    Write-LogEntry "Certificate has EXPIRED for $Domain!" -Level "ERROR"
    
    $alertSubject = "🚨 URGENT: SSL Certificate EXPIRED - $Domain"
    $alertMessage = "CRITICAL: SSL certificate for $Domain has EXPIRED on $($certStatus.ExpiryDate). Website may show security warnings. Immediate renewal required!"
    Send-RenewalNotification -Subject $alertSubject -Message $alertMessage
} else {
    Write-Host "✅ Certificate status: $($certStatus.DaysRemaining) days remaining" -ForegroundColor Green
    
    # Test if renewal is required
    $renewalCheck = Test-RenewalRequired -CertStatus $certStatus
    
    if ($renewalCheck.ShouldRenew) {
        Write-Host "🔄 Renewal required!" -ForegroundColor Yellow
        Write-LogEntry "Renewal triggered - Within threshold: $($renewalCheck.WithinThreshold), Old cert: $($renewalCheck.IsOld), Proactive: $($renewalCheck.NeedsProactive)"
        
        # Send renewal notification
        $renewalReason = if ($renewalCheck.WithinThreshold) {
            "Certificate expires in $($certStatus.DaysRemaining) days (threshold: $RenewalThresholdDays days)"
        } else {
            "Proactive renewal (certificate is $($certStatus.DaysRemaining) days old)"
        }
        
        $alertSubject = "SSL Certificate Renewal - $Domain"
        $alertMessage = "Renewal initiated for $Domain. Reason: $renewalReason. Certificate expires on $($certStatus.ExpiryDate)."
        Send-RenewalNotification -Subject $alertSubject -Message $alertMessage
        
        # Attempt renewal if certificate is valid and domain is reachable
        if ($certStatus.IsValid) {
            Write-Host "🔄 Attempting certificate renewal..." -ForegroundColor Yellow
            $renewalResult = Renew-LetsEncryptCertificate -Domain $Domain -Email $Email
            
            if ($renewalResult) {
                Write-Host "✅ Certificate renewed successfully!" -ForegroundColor Green
                Write-LogEntry "Certificate renewal completed successfully for $Domain" -Level "SUCCESS"
                
                $successSubject = "✅ SSL Certificate Renewal SUCCESS - $Domain"
                $successMessage = "Certificate successfully renewed for $Domain. New expiry date will be updated in next check."
                Send-RenewalNotification -Subject $successSubject -Message $successMessage
            } else {
                Write-Host "❌ Certificate renewal failed!" -ForegroundColor Red
                Write-LogEntry "Certificate renewal failed for $Domain" -Level "ERROR"
            }
        } else {
            Write-Host "❌ Cannot renew: Certificate is invalid or domain is unreachable" -ForegroundColor Red
            Write-LogEntry "Cannot renew certificate - domain unreachable or invalid certificate" -Level "ERROR"
        }
    } else {
        Write-Host "✅ Certificate is healthy, no renewal needed yet" -ForegroundColor Green
        Write-LogEntry "Certificate is healthy, no renewal required"
    }
}

# Update status tracking
$trackingData = Update-SSLStatusTracking -CertStatus $certStatus
Write-Host "📊 Status tracking updated" -ForegroundColor Cyan

# Generate renewal report
$reportData = @{
    CheckDate = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Domain = $Domain
    DaysRemaining = $certStatus.DaysRemaining
    ExpiryDate = $certStatus.ExpiryDate.ToString("yyyy-MM-dd")
    Status = if ($certStatus.IsValid) { "Valid" } else { "Invalid" }
}

$reportPath = "ssl-renewal-report.json"
$reportData | ConvertTo-Json | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "📊 Renewal report saved to: $reportPath" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔄 Setting up automated monitoring schedule..." -ForegroundColor Yellow

# Create a scheduled task for daily monitoring (Windows Task Scheduler)
$taskName = "WordCounter-SSL-Renewal-Monitor"
$taskScriptPath = $PSCommandPath

if ($InitialSetup) {
    # Create daily monitoring task
    $taskAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$taskScriptPath`" -Domain $Domain -RenewalThresholdDays $RenewalThresholdDays -Email $Email -DailyCheck"
    $taskTrigger = New-ScheduledTaskTrigger -Daily -At 9:00AM
    $taskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
    
    try {
        # Remove existing task if it exists
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
        
        # Register new task
        Register-ScheduledTask -TaskName $taskName -Action $taskAction -Trigger $taskTrigger -Settings $taskSettings -Description "Automated SSL certificate monitoring and renewal for WordCounter" | Out-Null
        Write-Host "✅ Daily monitoring task created: $taskName" -ForegroundColor Green
        Write-Host "⏰ Scheduled to run daily at 9:00 AM" -ForegroundColor Cyan
        
        # Create weekly renewal check task
        $weeklyTaskName = "WordCounter-SSL-Weekly-Check"
        $weeklyAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$taskScriptPath`" -Domain $Domain -RenewalThresholdDays 30 -Email $Email"
        $weeklyTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 6:00AM
        
        Register-ScheduledTask -TaskName $weeklyTaskName -Action $weeklyAction -Trigger $weeklyTrigger -Settings $taskSettings -Description "Weekly detailed SSL certificate check for WordCounter" | Out-Null
        Write-Host "✅ Weekly check task created: $weeklyTaskName" -ForegroundColor Green
        Write-Host "⏰ Scheduled to run weekly on Sunday at 6:00 AM" -ForegroundColor Cyan
        
    } catch {
        Write-Host "⚠️  Could not create scheduled tasks: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "💡 Manual task setup required. Use Windows Task Scheduler" -ForegroundColor Cyan
    }
}

# Generate final monitoring report
$finalReport = @{
    SetupDate = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Domain = $Domain
    Email = $Email
    RenewalThresholdDays = $RenewalThresholdDays
    CertificateStatus = @{
        DaysRemaining = $certStatus.DaysRemaining
        ExpiryDate = $certStatus.ExpiryDate.ToString("yyyy-MM-dd")
        IsValid = $certStatus.IsValid
    }
    MonitoringEnabled = if ($InitialSetup) { "Daily + Weekly" } else { "Manual" }
    NextCheck = if ($InitialSetup) { "Daily at 9:00 AM" } else { "Run script manually" }
}

$finalReport | ConvertTo-Json -Depth 10 | Out-File -FilePath "logs\ssl-monitoring-setup.json" -Encoding UTF8

Write-Host ""
Write-Host "🎯 SSL Certificate Monitoring Setup Complete!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   • Domain: $Domain" -ForegroundColor White
Write-Host "   • Email: $Email" -ForegroundColor White
Write-Host "   • Days Remaining: $($certStatus.DaysRemaining)" -ForegroundColor White
Write-Host "   • Status: $(if ($certStatus.IsValid) { 'Valid' } else { 'Invalid' })" -ForegroundColor White
Write-Host "   • Monitoring: $(if ($InitialSetup) { 'Automated (Daily + Weekly)' } else { 'Manual' })" -ForegroundColor White
Write-Host ""
Write-Host "📁 Generated Files:" -ForegroundColor Cyan
Write-Host "   • logs\ssl-monitoring.log - Activity log" -ForegroundColor White
Write-Host "   • logs\ssl-status.json - Current certificate status" -ForegroundColor White
Write-Host "   • logs\ssl-monitoring-setup.json - Setup configuration" -ForegroundColor White
Write-Host "   • logs\ssl-renewal-notifications.log - Notification log" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "   • Check logs regularly for monitoring status" -ForegroundColor White
Write-Host "   • Ensure email notifications are working" -ForegroundColor White
Write-Host "   • Test renewal process monthly" -ForegroundColor White
Write-Host "   • Monitor certificate expiry dates" -ForegroundColor White
Write-Host ""

# Display helpful commands
Write-Host "🔧 Useful Commands:" -ForegroundColor Cyan
Write-Host "   • Check status: .\ssl-renewal.ps1 -Domain $Domain -Email $Email" -ForegroundColor White
Write-Host "   • Force renewal: .\ssl-renewal.ps1 -Domain $Domain -Email $Email -InitialSetup" -ForegroundColor White
Write-Host "   • View logs: Get-Content logs\ssl-monitoring.log" -ForegroundColor White
Write-Host "   • Check task status: Get-ScheduledTask -TaskName '$taskName'" -ForegroundColor White
Write-Host ""

if ($certStatus.DaysRemaining -lt $RenewalThresholdDays) {
    Write-Host "⚠️  ATTENTION: Certificate expires in $($certStatus.DaysRemaining) days!" -ForegroundColor Yellow
    Write-Host "   Consider running manual renewal if automated process fails." -ForegroundColor Yellow
}

Write-Host "✅ SSL monitoring system is now active and monitoring your certificates!" -ForegroundColor Green