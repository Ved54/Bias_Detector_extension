async function analyzeBiasWithGroq(content) {
  const apiKey = "your-groq-api-key-here"; // Replace with your Groq API key
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Analyze the following text for bias. Provide a brief assessment stating whether it appears biased and why also give percentage for the same:\n\n${content.substring(0, 2000)}` // Limit to avoid token issues
        }
      ],
      temperature: 1,
      max_completion_tokens: 1024
    })
  });

  const data = await response.json();
  return data.choices[0].message.content || "Error analyzing content";
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzeContent") {
    analyzeBiasWithGroq(message.content).then(result => {
      chrome.runtime.sendMessage({ action: "biasResult", result: result });
    });
    return true; // Keep the message channel open for async response
  }
});
