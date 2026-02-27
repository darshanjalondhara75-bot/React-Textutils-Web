# SSL Certificate Generation Script for WordCounter (PowerShell)
# Creates self-signed certificates for development and production setup

Write-Host "🔒 Generating SSL certificates for WordCounter..." -ForegroundColor Green

# Create SSL directory
if (!(Test-Path "ssl")) {
    New-Item -ItemType Directory -Path "ssl" | Out-Null
}

# Generate private key
Write-Host "📝 Generating private key..." -ForegroundColor Yellow
$privateKey = New-Object System.Security.Cryptography.RSACryptoServiceProvider
$privateKey.KeySize = 2048
$privateKey.ExportCspKey($true) | Out-Null

# Save private key
$privateKeyPem = @"
-----BEGIN PRIVATE KEY-----
$([Convert]::ToBase64String($privateKey.ExportCspBlob($true)))
-----END PRIVATE KEY-----
"@
$privateKeyPem | Out-File -FilePath "ssl\wordcounter-key.pem" -Encoding UTF8

# Generate certificate
Write-Host "🎫 Creating self-signed certificate..." -ForegroundColor Yellow
$cert = New-SelfSignedCertificate -Subject "CN=localhost,O=WordCounter,C=US" -FriendlyName "WordCounter Dev Cert" -NotAfter (Get-Date).AddDays(90)

# Export certificate
Export-Certificate -Cert $cert -FilePath "ssl\wordcounter-cert.cer" | Out-Null

# Generate PEM format for React
$certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
$certBase64 = [Convert]::ToBase64String($certBytes)
$certPem = @"
-----BEGIN CERTIFICATE-----
$certBase64
-----END CERTIFICATE-----
"@
$certPem | Out-File -FilePath "ssl\wordcounter-cert.pem" -Encoding UTF8

# Create bundle file
$bundlePem = @"
$certPem
$privateKeyPem
"@
$bundlePem | Out-File -FilePath "ssl\wordcounter-bundle.pem" -Encoding UTF8

# Set certificate expiration date info
$expirationDate = $cert.NotAfter.ToString("yyyy-MM-dd")
Write-Host "✅ SSL certificates generated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Generated files:" -ForegroundColor Cyan
Write-Host "   ssl\wordcounter-key.pem - Private key"
Write-Host "   ssl\wordcounter-cert.pem - Self-signed certificate"
Write-Host "   ssl\wordcounter-cert.cer - Certificate (DER format)"
Write-Host "   ssl\wordcounter-bundle.pem - Certificate bundle"
Write-Host ""
Write-Host "⚠️  Certificate expires on: $expirationDate (90 days)" -ForegroundColor Yellow
Write-Host "🔄 For production, use Let's Encrypt for proper certificates" -ForegroundColor Yellow
Write-Host ""

# Update package.json for HTTPS development
Write-Host "🔧 Configuring package.json for HTTPS development..." -ForegroundColor Yellow

# Update package.json start script
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$originalStartScript = $packageJson.scripts.start
$packageJson.scripts.start = "HTTPS=true SSL_CRT_FILE=ssl\wordcounter-cert.pem SSL_KEY_FILE=ssl\wordcounter-key.pem react-scripts start"
$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"

Write-Host "✅ Updated package.json for HTTPS development" -ForegroundColor Green
Write-Host "🚀 Use 'npm start' to run with HTTPS" -ForegroundColor Cyan