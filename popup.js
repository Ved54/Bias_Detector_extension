document.getElementById("checkBias").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "scrapeContent" }, (response) => {
      chrome.runtime.sendMessage({ action: "analyzeContent", content: response.content });
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "biasResult") {
    document.getElementById("result").innerText = message.result;
  }
});