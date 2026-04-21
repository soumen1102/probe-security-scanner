import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { ScanResult, GroundingSource, ScanConfig } from "../types";

/**
 * GeminiProxy: Encapsulates all interactions with the Gemini API.
 */
export class GeminiProxy {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        timeout: 120000 // 2 minutes timeout to accommodate deep scans
      }
    });
  }

  /**
   * Performs a real-time AI-powered forensic scan of a target URL.
   */
  async performUrlScan(
    url: string,
    language: 'en' | 'hi' = 'en',
    config: ScanConfig
  ): Promise<{ result: ScanResult; sources: GroundingSource[] }> {
    const languageName = language === 'hi' ? 'Hindi' : 'English';

    // Construct advanced analysis modules based on user configuration
    const modules = [];
    if (config.hosting) modules.push("- ADVANCED HOSTING REPUTATION: Perform a deep-dive into the server's IP history, ASN reputation, and proximity to known malicious infrastructure (bulletproof hosting, C2 nodes).");
    if (config.security) modules.push("- CRYPTOGRAPHIC & PROTOCOL AUDIT: Conduct a granular evaluation of SSL/TLS certificate chains, cipher suite strength, and advanced security headers (HSTS, CSP, Permissions-Policy, etc.).");
    if (config.dns) modules.push("- DNS INTEL & INTEGRITY: Analyze nameserver authority, DNSSEC validation, and historical record changes to detect subtle poisoning or hijacking attempts.");
    if (config.waf) modules.push("- WAF & EDGE ARCHITECTURE: Identify and profile edge protection layers (Cloudflare, Akamai, AWS WAF) and evaluate their configuration efficacy.");
    if (config.assets) modules.push("- BEHAVIORAL ASSET ANALYSIS: Scan for obfuscated JS payloads, malicious telemetry endpoints, and deceptive DOM manipulation scripts.");
    if (config.history) modules.push("- HISTORICAL THREAT FORENSICS: Cross-reference global breach databases and real-time threat feeds for any incidents involving this URL in the last 24-48 hours.");
    if (config.attack) modules.push("- THREAT VECTOR MODELING: Map potential attack surfaces for Ransomware, Phishing, and Advanced Persistent Threat (APT) activity.");
    if (config.stack) modules.push("- ZERO-DAY STACK ANALYSIS: Identify the technology stack and cross-reference it with the latest CVE and zero-day vulnerability reports.");

    const prompt = `AUDIT TARGET: ${url}
    TIMESTAMP: ${new Date().toISOString()}
    PERSONA: You are an Elite Cybersecurity Forensic AI Engine.
    LANGUAGE: Return all content in ${languageName}.
    
    OBJECTIVE:
    Perform an exhaustive, real-time forensic security audit of the target URL. You MUST utilize the Google Search tool to ingest the absolute latest threat intelligence, security advisories, and infrastructure reports.
    
    TASKS:
    ${modules.join('\n    ')}
    
    GUIDELINES:
    - If a module is disabled in the config, return null for that object.
    - Calculate a 'Master Rating' (0-100) where 100 is virtually immune and 0 is actively malicious.
    - Provide a technical, data-driven 'Executive Summary'.
    - Be extremely specific about identified providers, CVE IDs, and threat actor signatures.
    
    OUTPUT FORMAT: Strict JSON matching the defined schema.`;

    // Define the JSON schema for structured output
    const properties: any = {
      masterRating: { type: Type.NUMBER, description: "Overall security score 0-100." },
      summary: { type: Type.STRING, description: "High-level forensic summary." }
    };
    
    const required = ["masterRating", "summary"];

    if (config.hosting) {
      properties.hostingReputation = {
        type: Type.OBJECT,
        properties: { 
          score: { type: Type.NUMBER }, 
          details: { type: Type.STRING }, 
          status: { type: Type.STRING, description: "Clean, Suspicious, or Malicious" } 
        },
        required: ["score", "details", "status"]
      };
      required.push("hostingReputation");
    }
    if (config.security) {
      properties.securityPosture = {
        type: Type.OBJECT,
        properties: { 
          tlsStatus: { type: Type.STRING }, 
          tlsRating: { type: Type.STRING, description: "A+ through F" }, 
          headers: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          details: { type: Type.STRING } 
        },
        required: ["tlsStatus", "tlsRating", "headers", "details"]
      };
      required.push("securityPosture");
    }
    if (config.dns) {
      properties.dnsSecurity = {
        type: Type.OBJECT,
        properties: { 
          score: { type: Type.NUMBER }, 
          provider: { type: Type.STRING }, 
          dnssecEnabled: { type: Type.BOOLEAN }, 
          details: { type: Type.STRING } 
        },
        required: ["score", "provider", "dnssecEnabled", "details"]
      };
      required.push("dnsSecurity");
    }
    if (config.waf) {
      properties.wafProtection = {
        type: Type.OBJECT,
        properties: { 
          detected: { type: Type.BOOLEAN }, 
          provider: { type: Type.STRING }, 
          details: { type: Type.STRING } 
        },
        required: ["detected", "provider", "details"]
      };
      required.push("wafProtection");
    }
    if (config.assets) {
      properties.maliciousAssets = {
        type: Type.OBJECT,
        properties: { 
          cookiesFound: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          jsVulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          summary: { type: Type.STRING } 
        },
        required: ["cookiesFound", "jsVulnerabilities", "summary"]
      };
      required.push("maliciousAssets");
    }
    if (config.history) {
      properties.incidentHistory = {
        type: Type.OBJECT,
        properties: {
          breaches: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                title: { type: Type.STRING }, 
                date: { type: Type.STRING }, 
                reference: { type: Type.STRING }, 
                link: { type: Type.STRING } 
              }, 
              required: ["title", "date", "reference", "link"] 
            } 
          },
          legalCharges: { type: Type.STRING },
          recordFound: { type: Type.BOOLEAN }
        },
        required: ["breaches", "legalCharges", "recordFound"]
      };
      required.push("incidentHistory");
    }
    if (config.attack) {
      properties.attackPotential = {
        type: Type.OBJECT,
        properties: { 
          threatLevel: { type: Type.STRING, description: "Low, Medium, High" }, 
          attackTypes: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          analysis: { type: Type.STRING } 
        },
        required: ["threatLevel", "attackTypes", "analysis"]
      };
      required.push("attackPotential");
    }
    if (config.stack) {
      properties.stackVulnerabilities = {
        type: Type.OBJECT,
        properties: { 
          frameworks: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          cves: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          details: { type: Type.STRING } 
        },
        required: ["frameworks", "cves", "details"]
      };
      required.push("stackVulnerabilities");
    }

    console.log("Initializing Forensic Scan for:", url);
    
    let attempts = 0;
    const maxAttempts = 3;
    let lastError: any = null;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: prompt,
          config: {
            systemInstruction: "You are an elite cybersecurity forensic AI engine. Your goal is to perform exhaustive, multi-layered security audits using real-time intelligence. You analyze infrastructure, cryptographic strength, historical breach data, and behavioral patterns to identify even the most subtle threats. You must be technical, objective, and thorough. CRITICAL: Ensure your JSON response is complete and perfectly formatted. Do not truncate the output.",
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: properties,
              required: required
            },
            thinkingConfig: { 
              thinkingLevel: ThinkingLevel.LOW
            },
            maxOutputTokens: 8192 // Ensure we have enough tokens for a complete response
          },
        });

        console.log(`Forensic Scan Response Received (Attempt ${attempts})`);
        let rawJson = response.text.trim();
        console.log("Raw JSON Length:", rawJson.length);
        
        let result: ScanResult;
        try {
          result = JSON.parse(rawJson);
        } catch (parseError: any) {
          console.error(`Failed to parse Gemini response as JSON on attempt ${attempts}:`, rawJson);
          
          // Basic JSON repair attempt for truncated responses
          if (attempts === maxAttempts) {
            try {
              console.log("Attempting basic JSON repair...");
              // If it ends abruptly, try to close open arrays/objects
              // This is a naive heuristic but can save a slightly truncated response
              let repairedJson = rawJson;
              if (repairedJson.endsWith('":')) repairedJson += '""';
              if (repairedJson.endsWith('":[')) repairedJson += ']';
              
              const openBraces = (repairedJson.match(/\{/g) || []).length;
              const closeBraces = (repairedJson.match(/\}/g) || []).length;
              const openBrackets = (repairedJson.match(/\[/g) || []).length;
              const closeBrackets = (repairedJson.match(/\]/g) || []).length;
              
              for (let i = 0; i < openBrackets - closeBrackets; i++) repairedJson += ']';
              for (let i = 0; i < openBraces - closeBraces; i++) repairedJson += '}';
              
              result = JSON.parse(repairedJson);
              console.log("JSON repair successful!");
            } catch (repairError) {
              const err = new Error("JSON Parse Error: The AI returned an incomplete or invalid response format.");
              (err as any).rawResponse = rawJson;
              (err as any).originalError = parseError.message;
              (err as any).stack = parseError.stack;
              throw err;
            }
          } else {
            lastError = parseError;
            continue; // Retry
          }
        }
        
        result.url = url;
        result.timestamp = new Date().toISOString();

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: GroundingSource[] = groundingChunks
          .filter((chunk: any) => chunk.web)
          .map((chunk: any) => ({
            title: chunk.web.title || (language === 'hi' ? 'खतरा खुफिया स्रोत' : 'Threat Intel Source'),
            uri: chunk.web.uri
          }));

        return { result, sources };
      } catch (error: any) {
        console.error(`Gemini API Error during performUrlScan (Attempt ${attempts}):`, error);
        lastError = error;
        if (attempts >= maxAttempts) {
          // Throw the raw error object so the UI can extract status, stack, and details
          throw lastError;
        }
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw lastError;
  }

  /**
   * Internal test case to verify Gemini API connectivity and basic functionality.
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: "Respond with 'OK' if you are functional.",
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });
      return response.text.includes("OK");
    } catch (e) {
      console.error("Gemini API Test Failed:", e);
      return false;
    }
  }
}

/**
 * Legacy wrapper for backward compatibility.
 */
export const performUrlScan = async (
  url: string,
  language: 'en' | 'hi' = 'en',
  config: ScanConfig
): Promise<{ result: ScanResult; sources: GroundingSource[] }> => {
  const apiKey = (globalThis as any).process?.env?.API_KEY || process.env.GEMINI_API_KEY || "";
  const proxy = new GeminiProxy(apiKey);
  return proxy.performUrlScan(url, language, config);
};