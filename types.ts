
export interface Incident {
  title: string;
  date: string;
  reference: string;
  link: string;
}

export interface ScanConfig {
  hosting: boolean;
  security: boolean;
  dns: boolean;
  waf: boolean;
  assets: boolean;
  history: boolean;
  attack: boolean;
  stack: boolean;
}

export interface ScanResult {
  hostingReputation: {
    score: number;
    details: string;
    status: 'Clean' | 'Suspicious' | 'Malicious';
  } | null;
  securityPosture: {
    tlsStatus: string;
    tlsRating: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    headers: string[];
    details: string;
  } | null;
  dnsSecurity: {
    score: number;
    provider: string;
    dnssecEnabled: boolean;
    details: string;
  } | null;
  wafProtection: {
    detected: boolean;
    provider: string;
    details: string;
  } | null;
  maliciousAssets: {
    cookiesFound: string[];
    jsVulnerabilities: string[];
    summary: string;
  } | null;
  incidentHistory: {
    breaches: Incident[];
    legalCharges: string;
    recordFound: boolean;
  } | null;
  attackPotential: {
    threatLevel: 'Low' | 'Medium' | 'High';
    attackTypes: string[];
    analysis: string;
  } | null;
  stackVulnerabilities: {
    frameworks: string[];
    cves: string[];
    details: string;
  } | null;
  masterRating: number;
  summary: string;
  url: string;
  timestamp: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
