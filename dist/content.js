(()=>{"use strict";var e;chrome.runtime.onMessage.addListener((function(e,t,n){"displayAnswer"===e.action&&(function(e){var t=document.getElementById("interview-assistant-popup");t&&t.remove();var n=document.createElement("div");n.id="interview-assistant-popup",n.style.position="fixed",n.style.bottom="80px",n.style.right="20px",n.style.width="300px",n.style.maxHeight="200px",n.style.overflowY="auto",n.style.backgroundColor="white",n.style.color="black",n.style.padding="15px",n.style.borderRadius="8px",n.style.boxShadow="0 2px 10px rgba(0, 0, 0, 0.2)",n.style.zIndex="9999",n.style.fontSize="14px";var s=document.createElement("div");s.innerHTML="&times;",s.style.position="absolute",s.style.top="5px",s.style.right="10px",s.style.cursor="pointer",s.style.fontSize="18px",s.addEventListener("click",(function(){return n.remove()}));var o=document.createElement("div");o.textContent=e,n.appendChild(s),n.appendChild(o),document.body.appendChild(n),setTimeout((function(){document.body.contains(n)&&n.remove()}),3e4)}(e.answer),n({success:!0}))})),(e=document.createElement("div")).id="interview-assistant-button",e.innerHTML="🎙️",e.style.position="fixed",e.style.bottom="20px",e.style.right="20px",e.style.width="50px",e.style.height="50px",e.style.borderRadius="50%",e.style.backgroundColor="#4285F4",e.style.color="white",e.style.display="flex",e.style.justifyContent="center",e.style.alignItems="center",e.style.fontSize="24px",e.style.cursor="pointer",e.style.zIndex="9999",e.style.boxShadow="0 2px 10px rgba(0, 0, 0, 0.2)",e.addEventListener("click",(function(){chrome.runtime.sendMessage({action:"openPopup"})})),document.body.appendChild(e)})();