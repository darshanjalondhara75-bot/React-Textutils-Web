import React, { useState } from "react";
import "./WordCounter.css";

function WordCounter({ theme, showAlert }) {
  const [text, setText] = useState("");

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleUpperCase = () => {
    setText(text.toUpperCase());
    if (showAlert) {
      showAlert("Text converted to uppercase successfully!", "success", 1500);
    }
  };

  const handleLowerCase = () => {
    setText(text.toLowerCase());
    if (showAlert) {
      showAlert("Text converted to lowercase successfully!", "success", 1500);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      if (showAlert) {
        showAlert("Text copied to clipboard successfully!", "success", 1500);
      }
    } catch (err) {
      if (showAlert) {
        showAlert("Failed to copy text to clipboard", "danger", 1500);
      }
    }
  };

  const handleCLearText = () => {
    setText("");
    if (showAlert) {
      showAlert("Text cleared successfully!", "success", 1500);
    }
  };

  const handleRemoveExtraSpaces = () => {
    let newText = text.split(/[ ]+/);
    setText(newText.join(" "));
    if (showAlert) {
      showAlert("Extra spaces removed successfully!", "success", 1500);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <div className={`word-counter-container ${theme}-mode`}>
      <h2>Word Counter</h2>
      <textarea
        className="text-input"
        placeholder="Enter your text here..."
        value={text}
        onChange={handleTextChange}
      />
      <div className="button-container">
        <button onClick={handleUpperCase} disabled={text.length === 0}>Uppercase</button>
        <button onClick={handleLowerCase} disabled={text.length === 0}>Lowercase</button>
        <button onClick={handleCopyText} disabled={text.length === 0}>Copy Text</button>
        <button onClick={handleCLearText} disabled={text.length === 0}>Clear Text</button>
        <button onClick={handleRemoveExtraSpaces} disabled={text.length === 0}>Remove Extra Spaces</button>
      </div>
      <div className="count-stats">
        <p className="word-count">Word Count: {wordCount}</p>
        <p className="char-count">Character Count: {charCount}</p>
      </div>
    </div>
  );
}

export default WordCounter;
