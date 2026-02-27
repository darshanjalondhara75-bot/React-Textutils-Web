import React from 'react';
import './pages.css';

const About = () => {
  // Update page title and meta when component mounts
  React.useEffect(() => {
    document.title = 'About WordCounter - Learn About Our Free Text Processing Tools';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about WordCounter - a comprehensive platform for text manipulation including word counter, character counter, case converter, and text formatting tools. Discover our mission and features.');
    }
    
    // Add structured data for About page
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About WordCounter",
      "description": "Learn about WordCounter and our comprehensive text processing tools",
      "url": "https://wordcounter.com/about",
      "mainEntity": {
        "@type": "Organization",
        "name": "WordCounter",
        "description": "Free online text manipulation and processing tools",
        "url": "https://wordcounter.com"
      }
    };
    
    // Add or update structured data script
    let scriptTag = document.querySelector('script[data-page="about"]');
    if (scriptTag) {
      scriptTag.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-page', 'about');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, []);

  return (
    <main className="page-content" role="main" aria-label="About WordCounter">
      <header className="page-header">
        <h1>About WordCounter</h1>
        <p>Learn more about our comprehensive text processing platform</p>
      </header>
      
      <section className="about-content" aria-labelledby="mission-heading">
        <h2 id="mission-heading">Our Mission</h2>
        <p>
          WordCounter is designed to make text manipulation simple and efficient for everyone.
          Whether you need to count words, analyze text, perform case conversions, or clean up formatting,
          our comprehensive suite of tools is here to help streamline your text processing workflow.
        </p>
        
        <h2>Key Features</h2>
        <ul aria-label="WordCounter features">
          <li>
            <strong>Word Counter:</strong> Accurate word, character, and paragraph counting
          </li>
          <li>
            <strong>Case Converter:</strong> Transform text between uppercase, lowercase, title case, and more
          </li>
          <li>
            <strong>Text Formatter:</strong> Clean up messy text and apply consistent formatting
          </li>
          <li>
            <strong>Text Analysis:</strong> Reading time estimation, complexity analysis, and statistics
          </li>
          <li>
            <strong>Theme Support:</strong> Dark and light modes for comfortable usage
          </li>
        </ul>
        
        <article>
          <h3>Why Choose WordCounter?</h3>
          <p>
            Our platform combines powerful text processing capabilities with an intuitive interface,
            making complex text operations accessible to everyone from students to professionals.
            All our tools are completely free to use with no registration required.
          </p>
        </article>
      </section>
    </main>
  );
};

export default About;