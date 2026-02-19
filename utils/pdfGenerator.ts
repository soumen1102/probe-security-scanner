import { jsPDF } from 'jspdf';
import { ScanResult, Incident } from '../types';

const pdfTranslations = {
  en: {
    reportTitle: "MASTER CYBER SECURITY FORENSICS REPORT - 2026 AUDIT CYCLE",
    masterRating: "MASTER RATING",
    watermark: "PROBE WEB SECURITY SCANNER",
    confidential: "CONFIDENTIAL INTELLIGENCE",
    profile: "URL Deployment Profile",
    dnsAudit: "DNS Security Audit",
    wafLayer: "WAF Protection Layer",
    crypto: "Cryptographic Integrity",
    hosting: "Hosting Reputation",
    threat: "Threat Vector Analysis",
    stack: "Stack Forensics",
    criticalLog: "CRITICAL INCIDENT FORENSIC LOG",
    incidentTitle: "INCIDENT TITLE",
    date: "DATE",
    source: "SOURCE REFERENCE",
    intelLink: "Intel Source Link",
    labels: {
      url: "URL",
      timestamp: "Timestamp",
      summary: "Executive Summary",
      provider: "Provider",
      dnssec: "DNSSEC",
      active: "Active",
      notDetected: "Not Detected",
      score: "Score",
      details: "Technical Details",
      protection: "Protection Detected",
      tlsStatus: "TLS Status",
      tlsGrade: "TLS Grade",
      headers: "Headers",
      postMortem: "Post-Mortem",
      yes: "YES",
      no: "NO",
      na: "N/A"
    }
  },
  hi: {
    reportTitle: "मास्टर साइबर सुरक्षा फोरेंसिक रिपोर्ट - 2026 ऑडिट चक्र",
    masterRating: "मास्टर रेटिंग",
    watermark: "प्रोब वेब सुरक्षा स्कैनर",
    confidential: "गोपनीय इंटेलिजेंस",
    profile: "URL परिनियोजन प्रोफ़ाइल",
    dnsAudit: "DNS सुरक्षा ऑडिट",
    wafLayer: "WAF सुरक्षा परत",
    crypto: "क्रिप्टोग्राफिक अखंडता",
    hosting: "होस्टिंग प्रतिष्ठा",
    threat: "खतरा वेक्टर विश्लेषण",
    stack: "स्टैक फोरेंसिक",
    criticalLog: "महत्वपूर्ण घटना फोरेंसिक लॉग",
    incidentTitle: "घटना का शीर्षक",
    date: "तारीख",
    source: "स्रोत संदर्भ",
    intelLink: "इंटेलिजेंस स्रोत लिंक",
    labels: {
      url: "URL",
      timestamp: "समय",
      summary: "कार्यकारी सारांश",
      provider: "प्रदाता",
      dnssec: "DNSSEC",
      active: "सक्रिय",
      notDetected: "पता नहीं चला",
      score: "स्कोर",
      details: "तकनीकी विवरण",
      protection: "सुरक्षा का पता चला",
      tlsStatus: "TLS स्थिति",
      tlsGrade: "TLS ग्रेड",
      headers: "हेडर्स",
      postMortem: "पोस्टमार्टम",
      yes: "हाँ",
      no: "नहीं",
      na: "लागू नहीं"
    }
  }
};

export const generatePdfReport = async (result: ScanResult, language: 'en' | 'hi' = 'en') => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;
  // USER REQUEST: Always generate PDF in English regardless of app selection
  const t = pdfTranslations['en'];

  // Header Background
  doc.setFillColor(2, 6, 23);
  doc.rect(0, 0, 210, 50, 'F');
  
  // NEW PROBE LOGO DRAWING
  const cx = 30, cy = 25;
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, 10, 'S');
  doc.setFillColor(30, 41, 59);
  doc.circle(cx, cy, 3, 'FD');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.2);
  doc.line(cx - 12, cy, cx - 8, cy);
  doc.line(cx + 8, cy, cx + 12, cy);
  doc.line(cx, cy - 12, cx, cy - 8);
  doc.line(cx, cy + 8, cx, cy + 12);
  doc.setFillColor(16, 185, 129);
  doc.circle(cx, cy, 1, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PROBE WEB', 50, 27);
  
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(t.reportTitle, 50, 34);
  
  doc.setDrawColor(59, 130, 246);
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(160, 10, 40, 30, 3, 3, 'FD');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(`${result.masterRating}`, 180, 25, { align: 'center' });
  doc.setFontSize(7);
  doc.text(t.masterRating, 180, 32, { align: 'center' });

  const addWatermark = (d: jsPDF) => {
    d.saveGraphicsState();
    d.setTextColor(240, 240, 240);
    d.setFontSize(25);
    d.setFont('helvetica', 'bold');
    d.text(t.watermark, 105, 170, { align: 'center', angle: 45 });
    d.restoreGraphicsState();
  };

  addWatermark(doc);
  y = 65;
  
  const addSection = (title: string, content: string, status?: string) => {
    if (y > 240) { doc.addPage(); y = 20; addWatermark(doc); }
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, 170, 8, 'F');
    doc.setFillColor(59, 130, 246);
    doc.rect(margin, y, 2, 8, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), margin + 5, y + 5.5);
    if (status) {
      doc.setTextColor(0, 0, 0); doc.setFontSize(8);
      doc.text(status.toUpperCase(), 190 - margin, y + 5.5, { align: 'right' });
    }
    y += 14;
    doc.setTextColor(51, 65, 85); doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    const lines = doc.splitTextToSize(content, 160);
    doc.text(lines, margin + 5, y);
    y += (lines.length * 5) + 12;
  };

  addSection(t.profile, `${t.labels.url}: ${result.url}\n${t.labels.timestamp}: ${new Date(result.timestamp).toLocaleString()}\n\n${t.labels.summary}: ${result.summary}`);
  
  if (result.incidentHistory.recordFound && result.incidentHistory.breaches.length > 0) {
    if (y > 200) { doc.addPage(); y = 20; addWatermark(doc); }
    doc.setFillColor(254, 226, 226);
    doc.rect(margin, y, 170, 8, 'F');
    doc.setFillColor(239, 68, 68);
    doc.rect(margin, y, 2, 8, 'F');
    doc.setTextColor(153, 27, 27);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text(t.criticalLog, margin + 5, y + 5.5);
    y += 14;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, 170, 7, 'F');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(t.incidentTitle, margin + 2, y + 4.5);
    doc.text(t.date, margin + 70, y + 4.5);
    doc.text(t.source, margin + 110, y + 4.5);
    y += 7;
    result.incidentHistory.breaches.forEach((inc) => {
      if (y > 260) { doc.addPage(); y = 20; addWatermark(doc); }
      doc.setTextColor(15, 23, 42); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
      doc.text(doc.splitTextToSize(inc.title, 65), margin + 2, y + 4);
      doc.setFont('helvetica', 'normal');
      doc.text(inc.date || t.labels.na, margin + 70, y + 4);
      doc.setTextColor(59, 130, 246);
      doc.textWithLink(t.intelLink, margin + 110, y + 4, { url: inc.link });
      doc.setTextColor(100, 116, 139); doc.setFontSize(6);
      doc.text(doc.splitTextToSize(inc.reference, 160), margin + 2, y + 10);
      y += 18;
    });
    y += 5;
  }

  addSection(t.dnsAudit, `${t.labels.provider}: ${result.dnsSecurity.provider}\n${t.labels.dnssec}: ${result.dnsSecurity.dnssecEnabled ? t.labels.active : t.labels.notDetected}\n${t.labels.score}: ${result.dnsSecurity.score}/100\n\n${t.labels.details}: ${result.dnsSecurity.details}`);
  addSection(t.wafLayer, `${t.labels.protection}: ${result.wafProtection.detected ? t.labels.yes : t.labels.no}\n${t.labels.provider}: ${result.wafProtection.provider}\n\n${t.labels.details}: ${result.wafProtection.details}`);
  addSection(t.crypto, `${t.labels.tlsStatus}: ${result.securityPosture.tlsStatus}\n${t.labels.tlsGrade}: ${result.securityPosture.tlsRating}\n${t.labels.headers}: ${result.securityPosture.headers.join(', ')}\n\n${t.labels.postMortem}: ${result.securityPosture.details}`);
  addSection(t.hosting, result.hostingReputation.details, result.hostingReputation.status);
  addSection(t.threat, result.attackPotential.analysis, result.attackPotential.threatLevel);
  addSection(t.stack, result.stackVulnerabilities.details);

  const pageCount = (doc as any).internal.getNumberOfPages();
  const generationTime = new Date().toLocaleString();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7); doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount} | Generated: ${generationTime} | ${t.confidential} © 2026`, 105, 285, { align: 'center' });
  }

  doc.save(`PROBE_MASTER_REPORT_${result.url.replace(/[^a-z0-9]/gi, '_')}.pdf`);
};