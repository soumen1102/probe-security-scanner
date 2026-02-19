import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, GroundingSource, ScanConfig } from "../types";

/**
 * Performs a real-time AI-powered forensic scan of a target URL.
 * Leverages Gemini 3 Pro with Google Search grounding for live threat intelligence.
 */
export const performUrlScan = async (
  url: string, 
  language: 'en' | 'hi' = 'en',
  config: ScanConfig
): Promise<{ result: ScanResult; sources: GroundingSource[] }> => {
  // Always create a new instance to ensure we pick up the most current API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const languageName = language === 'hi' ? 'Hindi' : 'English';

  // Construct analysis modules based on user configuration
  const modules = [];
  if (config.hosting) modules.push("- REAL-TIME HOSTING ANALYSIS: Determine if the server/IP/ASN has a malicious reputation. Check for proximity to known bulletproof hosting or C2 clusters.");
  if (config.security) modules.push("- LIVE CRYPTOGRAPHIC AUDIT: Evaluate current SSL/TLS certificate chains, protocol support, and security headers (HSTS, CSP, XFO).");
  if (config.dns) modules.push("- DNS INTEL: Analyze nameserver reputation, DNSSEC deployment, and recent records for signs of domain hijacking or poisoning.");
  if (config.waf) modules.push("- WAF/EDGE PROFILING: Identify if the target is shielded by WAF providers like Cloudflare, Akamai, or AWS.");
  if (config.assets) modules.push("- MALICIOUS TELEMETRY: Search for reports of harmful JS payloads, data-exfiltration endpoints, or deceptive redirects linked to this domain.");
  if (config.history) modules.push("- INCIDENT FORENSICS: Search for historical data breaches, active phishing campaigns, or legal takedowns involving this URL in the last 48 hours.");
  if (config.attack) modules.push("- ATTACK VECTOR MAPPING: Identify potential Phishing, Ransomware distribution, or Command & Control (C2) activity.");
  if (config.stack) modules.push("- STACK VULNERABILITIES: Cross-reference the identified tech stack with the latest CVE databases for zero-day exposure.");

  const prompt = `AUDIT TARGET: ${url}
  TIMESTAMP: ${new Date().toISOString()}
  PERSONA: You are a Lead SOC Analyst and Forensic Expert.
  LANGUAGE: Return all content in ${languageName}.
  
  OBJECTIVE:
  Perform a deep, real-time forensic security audit of the target URL. You must use the Google Search tool to find the absolute latest (real-time) information regarding threat reports, blacklists, and infrastructure changes.
  
  TASKS:
  ${modules.join('\n  ')}
  
  GUIDELINES:
  - If a module is disabled in the config, return null for that object.
  - Calculate a 'Master Rating' (0-100) where 100 is virtually immune and 0 is actively malicious.
  - Provide a concise but technical 'Executive Summary'.
  - Be precise about names of hosting providers, WAFs, and specific threat actors if detected.
  
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

  // Use Gemini 3 Pro for complex reasoning and search capabilities
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: properties,
        required: required
      },
      // Allocating a large thinking budget for deep architectural and threat analysis
      thinkingConfig: { thinkingBudget: 16000 }
    },
  });

  const rawJson = response.text.trim();
  const result: ScanResult = JSON.parse(rawJson);
  
  // Attach metadata
  result.url = url;
  result.timestamp = new Date().toISOString();

  // Extract grounding sources (URLs) as required by API guidelines when using googleSearch
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: GroundingSource[] = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title || (language === 'hi' ? 'खतरा खुफिया स्रोत' : 'Threat Intel Source'),
      uri: chunk.web.uri
    }));

  return { result, sources };
};