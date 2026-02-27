import React from 'react';
import './SocialShare.css';

const SocialShare = ({
  title = "WordCounter - Free Text Manipulation Tools",
  description = "Free online text manipulation tools including word counter, case converter, text formatter, character counter, and more.",
  url = "https://textutils.com",
  className = ""
}) => {
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=texttools,textutils`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const share = (platform) => {
    window.open(
      shareLinks[platform], 
      'share', 
      'width=600,height=400,scrollbars=no,resizable=no'
    );
  };

  return (
    <div className={`social-share ${className}`} aria-label="Share WordCounter">
      <h3>Share WordCounter</h3>
      <div className="share-buttons">
        <button
          onClick={() => share('facebook')}
          className="share-btn facebook"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <span className="share-icon">📘</span>
          Facebook
        </button>
        
        <button
          onClick={() => share('twitter')}
          className="share-btn twitter"
          aria-label="Share on Twitter"
          title="Share on Twitter"
        >
          <span className="share-icon">🐦</span>
          Twitter
        </button>
        
        <button
          onClick={() => share('linkedin')}
          className="share-btn linkedin"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
        >
          <span className="share-icon">💼</span>
          LinkedIn
        </button>
        
        <button
          onClick={() => share('reddit')}
          className="share-btn reddit"
          aria-label="Share on Reddit"
          title="Share on Reddit"
        >
          <span className="share-icon">🔴</span>
          Reddit
        </button>
        
        <button
          onClick={() => share('whatsapp')}
          className="share-btn whatsapp"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
        >
          <span className="share-icon">💬</span>
          WhatsApp
        </button>
        
        <button
          onClick={() => share('email')}
          className="share-btn email"
          aria-label="Share via Email"
          title="Share via Email"
        >
          <span className="share-icon">📧</span>
          Email
        </button>
      </div>
    </div>
  );
};

export default SocialShare;