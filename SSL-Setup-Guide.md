# SSL Certificate Setup & HTTPS Configuration Guide

## 🔒 SSL Certificate Setup for TextUtils

### Overview
This guide will help you set up SSL certificates with automated 90-day renewal using Let's Encrypt (free SSL certificates).

## 🎯 What's Included

### 1. SSL Certificate Configuration
- Let's Encrypt integration
- 90-day automated renewal
- Multiple hosting platform guides
- Development SSL setup

### 2. HTTPS Configuration
- Force HTTPS redirects
- HSTS headers
- Security headers
- Mixed content prevention

### 3. Automated Renewal System
- Cron job setup
- Certificate monitoring
- Renewal alerts
- Health checks

## 🏗️ Deployment Options

### Option 1: Netlify (Recommended for React)
```bash
# Netlify handles SSL automatically
# Just connect your GitHub repository
# SSL is provided via Let's Encrypt
# Automatic renewal included
```

### Option 2: Vercel
```bash
# Vercel provides automatic SSL
# Zero configuration required
# Global CDN included
```

### Option 3: GitHub Pages
```bash
# GitHub Pages supports custom domains with SSL
# Requires custom domain configuration
# Let's Encrypt integration available
```

### Option 4: Traditional Web Hosting
- cPanel hosting with SSL addon
- Apache/Nginx configuration
- Let's Encrypt manual setup

## 🛠️ Let's Encrypt Setup (Manual)

### 1. Install Certbot
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-apache

# CentOS/RHEL
sudo yum install certbot python3-certbot-apache

# macOS
brew install certbot
```

### 2. Obtain Certificate
```bash
# For Apache
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com

# For Nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Standalone mode
sudo certbot certonly --standalone -d yourdomain.com
```

### 3. Auto-Renewal Setup
```bash
# Add to crontab
sudo crontab -e

# Add this line for daily check
0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx
```

## 🔧 Local Development SSL

### Create Self-Signed Certificate
```bash
# Generate private key
openssl genrsa -out localhost-key.pem 2048

# Generate certificate
openssl req -new -x509 -key localhost-key.pem -out localhost-cert.pem -days 365 -subj "/CN=localhost"

# React Development
# Update package.json
"start": "HTTPS=true SSL_CRT_FILE=localhost-cert.pem SSL_KEY_FILE=localhost-key.pem react-scripts start"
```

### Vite Development SSL
```bash
# Update vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    https: true,
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost-cert.pem')
  }
})
```

## 🌐 Hosting Platform Specific Guides

### Netlify SSL Setup
1. Connect GitHub repository
2. Configure custom domain in Site Settings
3. Netlify automatically provisions SSL
4. Automatic renewal included

### Vercel SSL Setup
1. Deploy from GitHub repository
2. Add custom domain in project settings
3. Vercel automatically configures SSL
4. Zero-downtime deployments

### Cloudflare SSL
1. Add site to Cloudflare
2. Configure DNS settings
3. Enable SSL/TLS encryption
4. Set to "Full (Strict)" mode

## 🔒 Security Headers Configuration

### Apache (.htaccess)
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
```

### Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📊 SSL Monitoring & Maintenance

### Certificate Monitoring
```bash
# Check certificate expiry
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Test SSL configuration
curl -I https://yourdomain.com

# Check certificate chain
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### Renewal Monitoring Script
```bash
#!/bin/bash
# ssl-monitor.sh

DOMAIN="yourdomain.com"
RENEWAL_DAYS=30

expiry_date=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
expiry_epoch=$(date -d "$expiry_date" +%s)
current_epoch=$(date +%s)
days_until_expiry=$(( ($expiry_epoch - $current_epoch) / 86400 ))

if [ $days_until_expiry -lt $RENEWAL_DAYS ]; then
    echo "SSL certificate for $DOMAIN expires in $days_until_expiry days!"
    # Send alert email or notification
    echo "SSL certificate renewal needed for $DOMAIN" | mail -s "SSL Renewal Alert" admin@yourdomain.com
fi
```

## 🎯 Best Practices

### 1. Certificate Security
- Use strong cipher suites
- Enable HSTS
- Configure OCSP stapling
- Use certificate transparency

### 2. Performance Optimization
- Enable HTTP/2
- Use session resumption
- Implement certificate caching
- Optimize TLS handshake

### 3. Monitoring & Alerts
- Monitor certificate expiry
- Set up renewal alerts
- Track SSL grade (A+ target)
- Regular security scans

## 🚀 Quick Start Checklist

- [ ] Choose hosting platform (Netlify/Vercel recommended)
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure HTTPS redirects
- [ ] Add security headers
- [ ] Test SSL configuration
- [ ] Set up monitoring
- [ ] Configure automated renewal

## 📞 Support & Troubleshooting

### Common Issues
1. **Mixed Content Warnings**
   - Update all HTTP links to HTTPS
   - Check for hardcoded HTTP URLs

2. **Certificate Errors**
   - Verify DNS propagation
   - Check domain ownership

3. **Renewal Failures**
   - Verify cron job setup
   - Check certbot configuration

### Testing Tools
- SSL Labs: https://www.ssllabs.com/ssltest/
- Why No Padlock: https://www.whynopadlock.com/
- SSL Checker: https://www.sslshopper.com/ssl-checker.html

Your TextUtils website will have professional-grade SSL security with automated 90-day renewal!