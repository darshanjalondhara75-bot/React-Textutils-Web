import React, { useState } from 'react';
import './pages.css';

const Contact = ({ theme }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Update page title and meta when component mounts
  React.useEffect(() => {
    document.title = 'Contact WordCounter - Get in Touch with Our Support Team';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact WordCounter support team for help with text processing tools. Get in touch via email, phone, or our contact form. We\'re here to assist you with all your text manipulation needs.');
    }
    
    // Add structured data for Contact page
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact WordCounter",
      "description": "Contact page for WordCounter support and inquiries",
      "url": "https://wordcounter.com/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "WordCounter",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Service",
          "email": "support@wordcounter.com",
          "telephone": "+1-555-123-4567",
          "areaServed": "Worldwide",
          "availableLanguage": "English"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Text Street",
          "addressLocality": "Web City",
          "postalCode": "12345",
          "addressCountry": "US"
        }
      }
    };
    
    // Add or update structured data script
    let scriptTag = document.querySelector('script[data-page="contact"]');
    if (scriptTag) {
      scriptTag.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-page', 'contact');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main className={`page-content ${theme}-mode`} role="main" aria-label="Contact WordCounter">
      <header className="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch with our support team</p>
      </header>
      
      <div className="contact-content">
        <section className="contact-info" aria-labelledby="contact-info-heading">
          <h2 id="contact-info-heading">Get in Touch</h2>
          <p>
            We'd love to hear from you! Whether you have questions about our text processing tools,
            need technical support, or want to provide feedback, we're here to help.
            Please fill out the form or contact us using the information below.
          </p>
          
          <address className="contact-details" aria-label="Contact Information">
            <h3>Contact Information</h3>
            <p>
              <strong>📧 Email:</strong>
              <a href="mailto:support@wordcounter.com" rel="noopener noreferrer">
                support@wordcounter.com
              </a>
            </p>
            <p>
              <strong>📱 Phone:</strong>
              <a href="tel:+15551234567" rel="noopener noreferrer">
                +1 (555) 123-4567
              </a>
            </p>
            <p>
              <strong>📍 Address:</strong> 123 Text Street, Web City, 12345
            </p>
            <p>
              <strong>🕒 Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (EST)
            </p>
          </address>
        </section>
        
        <section className="contact-form-section" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading">Send Us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit} aria-label="Contact form">
            <div className="form-group">
              <label htmlFor="name">
                Name: <span className="required" aria-label="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                aria-describedby="name-help"
              />
              <small id="name-help" className="form-help">Please enter your full name</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                Email: <span className="required" aria-label="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                aria-describedby="email-help"
              />
              <small id="email-help" className="form-help">We'll use this to respond to your message</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">
                Message: <span className="required" aria-label="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                required
                aria-describedby="message-help"
              />
              <small id="message-help" className="form-help">Please describe how we can help you</small>
            </div>
            
            <button type="submit" className="submit-btn" aria-label="Send message">
              Send Message
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Contact;