export interface BytezModel {
  id: string;
  name: string;
}

export const BYTEZ_MODELS: BytezModel[] = [
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro (Bytez)" },
  { id: "google/gemini-2.0-flash", name: "Gemini 2.0 Flash (Bytez)" },
  { id: "meta-llama/Llama-3.3-70B-Instruct", name: "Llama 3.3 70B (Bytez)" },
  { id: "deepseek-ai/DeepSeek-R1", name: "DeepSeek R1 (Bytez)" },
];

export async function generateBytezContent(model: string, prompt: string, bytezKey: string, googleKey: string, attachments: any[] = []) {
  if (!bytezKey) {
    throw new Error("Bytez API Key is required.");
  }

  const messages: any[] = [
    { role: "user", content: prompt }
  ];

  // Note: Bytez API for Gemini models might require the provider-key header
  // as per the research in the browser subagent.
  
  const response = await fetch(`https://api.bytez.com/models/v2/${model}`, {
    method: "POST",
    headers: {
      "Authorization": `Key ${bytezKey}`,
      "Content-Type": "application/json",
      ...(googleKey ? { "provider-key": googleKey } : {})
    },
    body: JSON.stringify({
      messages: messages,
      stream: false, // Start with non-streaming for simplicity
      params: {
        temperature: 0.7,
        max_length: 2048
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bytez API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  
  // Based on research, response format is { error: null, output: "..." }
  if (data.error) {
    throw new Error(`Bytez API Error: ${data.error}`);
  }

  return data.output || "No output returned from Bytez.";
}
