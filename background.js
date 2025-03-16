async function analyzeBiasWithGroq(content) {
  const apiKey = "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"; // Replace with your Groq API key
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
          content: `Analyze the following text for bias. Provide only:
          1. A percentage (0-100%) indicating the level of bias (0% = completely unbiased, 100% = extremely biased)
          2. A short summary explaining why the text is biased, unbiased, or neutral.
          Format your response as: "[percentage]% biased - [summary]"\n\n${content}` // Limit to avoid token issues
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