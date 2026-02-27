import React from 'react';
import WordCounter from '../WordCounter';
import SocialShare from '../SocialShare';

const Home = ({ theme, showAlert }) => {
  // Update page title and meta when component mounts
  React.useEffect(() => {
    document.title = 'WordCounter - Free Text Manipulation & Word Counter Tools';

    // Ensure main meta description is preserved for homepage
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'WordCounter - Free online text manipulation tools including word counter, case converter, text formatter, character counter, and more. Process your text instantly with our easy-to-use tools.');
    }

    // Add structured data for Homepage
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "WordCounter - Home",
      "description": "Free online text manipulation tools including word counter, case converter, text formatter, character counter, and more.",
      "url": "https://wordcounter.com/home",
      "mainEntity": {
        "@type": "WebApplication",
        "name": "WordCounter",
        "url": "https://wordcounter.com",
        "description": "Comprehensive text manipulation and processing platform",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "featureList": [
          "Word Counter",
          "Character Counter",
          "Case Converter",
          "Text Formatter",
          "Text Analysis Tools"
        ]
      }
    };

    // Add or update structured data script
    let scriptTag = document.querySelector('script[data-page="home"]');
    if (scriptTag) {
      scriptTag.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-page', 'home');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, []);

  return (
    <main className="page-content" role="main" aria-label="WordCounter Home">
      <header className="page-header">
        <h1>Welcome to WordCounter</h1>
        <p>Your comprehensive solution for text manipulation and processing</p>
        <p className="subtitle">
          Process your text instantly with our professional-grade tools.
          No registration required - completely free to use.
        </p>
      </header>

      <section aria-labelledby="tools-heading" className="main-tools-section">
        <h2 id="tools-heading" className="sr-only">Text Processing Tools</h2>
        <WordCounter theme={theme} showAlert={showAlert} />
      </section>

      <section aria-labelledby="quick-features-heading" className="quick-features">
        <h2 id="quick-features-heading">Why Choose WordCounter?</h2>
        <div className="features-grid">
          <article className="feature-card">
            <h3>⚡ Fast & Accurate</h3>
            <p>Get instant results with our optimized text processing algorithms. Accurate word counts, character analysis, and text transformations in milliseconds.</p>
          </article>

          <article className="feature-card">
            <h3>🔒 Privacy First</h3>
            <p>Your text is processed entirely in your browser. No data is sent to our servers, ensuring complete privacy and security of your content.</p>
          </article>

          <article className="feature-card">
            <h3>💯 Completely Free</h3>
            <p>All our text manipulation tools are completely free to use. No hidden fees, no registration required, and no limitations on usage.</p>
          </article>

          <article className="feature-card">
            <h3>📱 Mobile Friendly</h3>
            <p>Access our tools from any device. Our responsive design works perfectly on desktop, tablet, and mobile devices.</p>
          </article>
        </div>
      </section>

      <SocialShare />
    </main>
  );
};

export default Home;