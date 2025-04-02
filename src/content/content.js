// Create a floating button that opens the popup
const createFloatingButton = () => {
    const button = document.createElement('div');
    button.id = 'interview-assistant-button';
    button.innerHTML = '🎙️';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#4285F4';
    button.style.color = 'white';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    button.style.fontSize = '24px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    button.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    
    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });
    
    document.body.appendChild(button);
  };
  
  // Create the answer popup
  const createAnswerPopup = (answer) => {
    // Remove existing popup if any
    const existingPopup = document.getElementById('interview-assistant-popup');
    if (existingPopup) {
      existingPopup.remove();
    }
    
    const popup = document.createElement('div');
    popup.id = 'interview-assistant-popup';
    popup.style.position = 'fixed';
    popup.style.bottom = '80px';
    popup.style.right = '20px';
    popup.style.width = '300px';
    popup.style.maxHeight = '200px';
    popup.style.overflowY = 'auto';
    popup.style.backgroundColor = 'white';
    popup.style.color = 'black';
    popup.style.padding = '15px';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '9999';
    popup.style.fontSize = '14px';
    
    const closeButton = document.createElement('div');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '18px';
    closeButton.addEventListener('click', () => popup.remove());
    
    const content = document.createElement('div');
    content.textContent = answer;
    
    popup.appendChild(closeButton);
    popup.appendChild(content);
    document.body.appendChild(popup);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (document.body.contains(popup)) {
        popup.remove();
      }
    }, 30000);
  };
  
  // Listen for messages from the popup or background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'displayAnswer') {
      createAnswerPopup(message.answer);
      sendResponse({ success: true });
    }
  });
  
  // Initialize the content script
  createFloatingButton();