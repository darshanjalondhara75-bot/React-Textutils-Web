#!/bin/bash

# SSL Certificate Generation Script for WordCounter
# Creates self-signed certificates for development and production setup

set -e

echo "🔒 Generating SSL certificates for WordCounter..."

# Create SSL directory
mkdir -p ssl

# Generate private key
echo "📝 Generating private key..."
openssl genrsa -out ssl/wordcounter-key.pem 2048

# Generate certificate signing request
echo "📋 Creating certificate signing request..."
openssl req -new -key ssl/wordcounter-key.pem -out ssl/wordcounter.csr -subj "/C=US/ST=State/L=City/O=WordCounter/CN=localhost"

# Generate self-signed certificate (valid for 90 days for testing)
echo "🎫 Creating self-signed certificate..."
openssl x509 -req -in ssl/wordcounter.csr -signkey ssl/wordcounter-key.pem -out ssl/wordcounter-cert.pem -days 90

# Generate production-ready certificate template (for Let's Encrypt)
echo "📦 Creating production certificate template..."
openssl req -new -x509 -key ssl/wordcounter-key.pem -out ssl/production-cert.pem -days 365 -subj "/C=US/ST=State/L=City/O=WordCounter/CN=wordcounter.com" -addext "subjectAltName=DNS:wordcounter.com,DNS:www.wordcounter.com"

# Create certificate bundle for production
echo "🔗 Creating certificate bundle..."
cat ssl/wordcounter-cert.pem ssl/wordcounter-key.pem > ssl/wordcounter-bundle.pem

# Set proper permissions
chmod 600 ssl/*.pem
chmod 644 ssl/*.crt
chmod 644 ssl/*.csr

echo "✅ SSL certificates generated successfully!"
echo ""
echo "📁 Generated files:"
echo "   ssl/wordcounter-key.pem - Private key"
echo "   ssl/wordcounter-cert.pem - Self-signed certificate (90 days)"
echo "   ssl/production-cert.pem - Production template (365 days)"
echo "   ssl/wordcounter-bundle.pem - Certificate bundle"
echo "   ssl/wordcounter.csr - Certificate signing request"
echo ""
echo "⚠️  Note: Use the production-cert.pem template with Let's Encrypt for live deployment"
echo "🔄 Certificate renewal: Run this script every 90 days or set up automated renewal"
echo ""
echo "🚀 For development, use wordcounter-cert.pem"
echo "🌐 For production, use Let's Encrypt to get proper certificates"