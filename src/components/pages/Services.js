import React from 'react';
import './pages.css';
import SystemResourceMonitor from '../SystemResourceMonitor';

const Services = ({ theme = 'light' }) => {
  // Update page title and meta when component mounts
  React.useEffect(() => {
    document.title = 'WordCounter Services - Comprehensive Text Processing & Analysis Tools';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore WordCounter services: text analysis, case conversion, formatting tools, character counting, and more. Professional text processing solutions for all your needs.');
    }
    
    // Add structured data for Services page
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ServicePage",
      "name": "WordCounter Services",
      "description": "Comprehensive text processing and analysis services",
      "url": "https://wordcounter.com/services",
      "mainEntity": {
        "@type": "WebApplication",
        "name": "WordCounter",
        "serviceType": "Text Processing Tools",
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Text Processing Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Text Analysis",
                "description": "Word count, character count, reading time estimation, and complexity analysis"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Text Transformation",
                "description": "Case conversion, character removal, formatting cleanup"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Text Generation",
                "description": "Sample text, placeholder content, formatted text generation"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Text Formatting",
                "description": "Consistent formatting and content cleanup"
              }
            }
          ]
        }
      }
    };
    
    // Add or update structured data script
    let scriptTag = document.querySelector('script[data-page="services"]');
    if (scriptTag) {
      scriptTag.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-page', 'services');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, []);

  return (
    <main className="page-content" role="main" aria-label="WordCounter Services">
      <header className="page-header">
        <h1>Our Services</h1>
        <p>Comprehensive text processing and analysis solutions</p>
      </header>
      
      <section className="services-grid" aria-label="Available Services">
        <article className="service-card" role="article">
          <header>
            <h2>Text Analysis</h2>
          </header>
          <p>
            Comprehensive text analysis including accurate word count, character count,
            reading time estimation, and text complexity analysis. Get detailed insights
            into your text content with professional-grade analytics.
          </p>
          <footer>
            <span className="service-tag">Analysis</span>
          </footer>
        </article>
        
        <article className="service-card" role="article">
          <header>
            <h2>Text Transformation</h2>
          </header>
          <p>
            Convert text cases (uppercase, lowercase, title case, camel case),
            remove unwanted characters, clean formatting, and transform text
            to various formats with precision and ease.
          </p>
          <footer>
            <span className="service-tag">Conversion</span>
          </footer>
        </article>
        
        <article className="service-card" role="article">
          <header>
            <h2>Text Generation</h2>
          </header>
          <p>
            Generate sample text, placeholder content, and formatted text
            for testing, development, and content creation purposes.
            Perfect for designers and developers.
          </p>
          <footer>
            <span className="service-tag">Generation</span>
          </footer>
        </article>
        
        <article className="service-card" role="article">
          <header>
            <h2>Text Formatting</h2>
          </header>
          <p>
            Format text according to specifications, clean up messy content,
            ensure consistent formatting, and apply professional styling
            to your written content.
          </p>
          <footer>
            <span className="service-tag">Formatting</span>
          </footer>
        </article>
      </section>
      
      <section aria-labelledby="cta-heading" className="services-cta">
        <h2 id="cta-heading">Ready to Get Started?</h2>
        <p>
          All our text processing services are completely free to use.
          Start using our tools now and experience the convenience of professional text manipulation.
        </p>
      </section>
      
      <section aria-labelledby="monitor-heading">
        <h2 id="monitor-heading" style={{ textAlign: 'center', margin: '40px 0 20px' }}>
          System Resource Monitor
        </h2>
        <SystemResourceMonitor theme={theme} />
      </section>
    </main>
  );
};

export default Services;