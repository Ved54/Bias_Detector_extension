console.log("Content script loaded");

function scrapePageContent() {
  const text = document.body.innerText || '';
  return text;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scrapeContent") {
    console.log("Scraping content");
    const content = scrapePageContent();
    sendResponse({ content: content });
  }
});