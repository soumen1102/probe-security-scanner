
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Download, 
  Loader2, 
  AlertTriangle,
  Server,
  Lock,
  FileCode,
  History,
  Zap,
  Layers,
  Linkedin,
  Palette,
  Globe,
  Database,
  UserCheck,
  Cpu,
  Waves,
  Flame,
  Gem,
  Sparkles,
  Activity,
  ShieldEllipsis,
  Binary,
  Settings as SettingsIcon,
  X,
  Target,
  Shield,
  Briefcase,
  Terminal,
  Eye,
  Crosshair,
  Key,
  Globe2,
  LockKeyhole,
  Scale,
  Timer,
  ExternalLink,
  ChevronRight,
  GlobeIcon,
  Languages,
  Maximize2,
  PlusCircle,
  FileText,
  User,
  ShieldQuestion,
  Coffee,
  Cloud,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Logo } from './components/Logo';
import { Captcha } from './components/Captcha';
import { performUrlScan } from './services/geminiService';
import { ScanResult, GroundingSource, Incident, ScanConfig } from './types';
import { generatePdfReport } from './utils/pdfGenerator';

type Theme = 'slate' | 'midnight' | 'cyber' | 'oceanic' | 'volcanic' | 'emerald' | 'amethyst';
type FontSize = 'xs' | 'sm' | 'md' | 'lg';
type Language = 'en' | 'hi';

const translations = {
  en: {
    tagline: "AI Cyber Intelligence",
    settingsTitle: "Scanner Control",
    fontSize: "Neural Font Size",
    aesthetic: "Aesthetic Overlay",
    language: "Operational Language",
    scanArchitecture: "Scan Architecture",
    operationScenarios: "Core Audit Capabilities",
    intelligence: "Intelligence",
    description: "Distributed AI forensic scan engine auditing web perimeters at neural-speed. Evaluate hosting risk, SSL security, and data breach vectors in real-time.",
    placeholder: "Deployment target URL...",
    initButton: "Initialize Probe",
    elapsed: "ELAPSED",
    probing: "Probing Perimeters",
    auditingTasks: "AUDITING DNS | WAF PROFILING | TLS GRADING | BREACH SCAN",
    masterIndex: "MASTER INTEGRITY INDEX",
    executiveBriefing: "Executive Briefing",
    processingTime: "Total Processing Time",
    seconds: "Seconds",
    score: "Score",
    downloadTitle: "Export Forensic Report",
    downloadCaption: "DOWNLOAD REPORT",
    downloadTooltip: "Report is generated in English only",
    scanNewTarget: "Scan New Target",
    hostingRep: "Hosting Rep",
    securityTls: "Security & TLS",
    assetIntegrity: "Asset Integrity",
    wafProfile: "WAF Profile",
    dnsSecurity: "DNS Security",
    incidentHistory: "Incident History",
    attackIntel: "Attack Intel",
    stackForensics: "Stack Forensics",
    c2Signaling: "C2 Signaling",
    identityPosture: "Identity Posture",
    providerTrust: "Provider Trust",
    tlsGrade: "TLS Grade",
    vulnsAudit: "Vulns Audit",
    codeClean: "Code Signatures Clean",
    perimeter: "Perimeter",
    shielded: "SHIELDED",
    exposed: "EXPOSED",
    auditScore: "Audit Score",
    forensicRecord: "Forensic Record",
    breachFound: "BREACH FOUND",
    noRecord: "NO RECORD",
    intelLog: "Intel Detailed Log",
    threatLevel: "Level",
    trafficAudit: "Traffic Audit",
    trafficDetails: "Evaluating outbound telemetry and potential command & control signaling patterns.",
    legalStance: "Legal Stance",
    legalDetails: "Verification of corporate identity and historical adherence to digital privacy mandates.",
    forensicLogTitle: "Forensic Breach Log",
    verifiedFor: "Verified records for",
    incidentEvent: "Incident Event",
    timeline: "Timeline",
    intelSource: "Intel Source",
    action: "Action",
    intelLink: "Intel Link",
    footerText: "DISTRIBUTED FORENSIC NODE | V1.2-STABLE",
    viewMore: "View More",
    detailsTitle: "Forensic Detail",
    buyCoffee: "Buy me a coffee",
    seoHeader: "Why Use Probe Security Scanner?",
    protectedBy: "Protected by Cloudflare",
    skipped: "Module Skipped",
    roles: {
      secops: "WAF Detection",
      itpro: "SSL/TLS Audit",
      risk: "Vendor Risk",
      security: "Malware Analysis",
      forensics: "C2 Investigation",
      compliance: "Compliance Check",
      general: "Safe Link Check"
    },
    useCaseText: {
      secops: "Instantly validate if web perimeters are protected by Cloudflare, Akamai, or AWS WAF.",
      itpro: "Verify SSL/TLS configurations, protocol support, and certificate validity for any domain.",
      risk: "Scan vendor domains for historical data breaches and legal risks before onboarding.",
      security: "Uncover hidden malicious payloads, deceptive redirects, and invasive tracking scripts.",
      forensics: "Identify Command & Control signaling and suspicious outbound telemetry traffic.",
      compliance: "Ensure DNSSEC, HSTS, and Content Security Policy (CSP) headers are correctly configured.",
      general: "Concerned about a suspicious email link? Probe verifies if a URL is secure and safe to visit."
    }
  },
  hi: {
    tagline: "AI साइबर इंटेलिजेंस",
    settingsTitle: "स्कैनर नियंत्रण",
    fontSize: "न्यूरल फ़ॉन्ट आकार",
    aesthetic: "सौंदर्य ओवरले",
    language: "परिचालन भाषा",
    scanArchitecture: "स्कैन आर्किटेक्चर",
    operationScenarios: "मुख्य ऑडिट क्षमताएं",
    intelligence: "इंटेलिजेंस",
    description: "वितरित AI फोरेंसिक स्कैन इंजन। होस्टिंग जोखिम, SSL सुरक्षा और डेटा उल्लंघन वैक्टर का वास्तविक समय में मूल्यांकन करें।",
    placeholder: "परिनियोजन लक्ष्य URL...",
    initButton: "जांच शुरू करें",
    elapsed: "बीता हुआ समय",
    probing: "पेरिमेटर्स की जांच",
    auditingTasks: "DNS ऑडिट | WAF प्रोफाइलिंग | TLS ग्रेडिंग | उल्लंघन स्कैन",
    masterIndex: "मास्टर अखंडता सूचकांक",
    executiveBriefing: "कार्यकारी जानकारी",
    processingTime: "कुल प्रसंस्करण समय",
    seconds: "सेकंड",
    score: "स्कोर",
    downloadTitle: "फोरेंसिक रिपोर्ट निर्यात करें",
    downloadCaption: "रिपोर्ट डाउनलोड करें",
    downloadTooltip: "रिपोर्ट केवल अंग्रेजी में तैयार की जाती है",
    scanNewTarget: "नया लक्ष्य स्कैन करें",
    hostingRep: "होस्टिंग प्रतिष्ठा",
    securityTls: "सुरक्षा और TLS",
    assetIntegrity: "संपत्ति अखंडता",
    wafProfile: "WAF प्रोफाइल",
    dnsSecurity: "DNS सुरक्षा",
    incidentHistory: "घटना इतिहास",
    attackIntel: "हमला इंटेलिजेंस",
    stackForensics: "स्टैक फोरेंसिक",
    c2Signaling: "C2 सिग्नलिंग",
    identityPosture: "पहचान स्थिति",
    providerTrust: "प्रदाता विश्वास",
    tlsGrade: "TLS ग्रेड",
    vulnsAudit: "कमियों का ऑडिट",
    codeClean: "कोड हस्ताक्षर साफ हैं",
    perimeter: "परिधि",
    shielded: "सुरक्षित",
    exposed: "खुला",
    auditScore: "ऑधिट स्कोर",
    forensicRecord: "फोरेंसिक रिकॉर्ड",
    breachFound: "उल्लंघन मिला",
    noRecord: "कोई रिकॉर्ड नहीं",
    intelLog: "विस्तृत इंटेलिजेंस लॉग",
    threatLevel: "स्तर",
    trafficAudit: "ट्रैफ़िक ऑडिट",
    trafficDetails: "आउटबाउंड टेलीमेट्री और संभावित कमांड एवं कंट्रोल सिग्नलिंग पैटर्न का मूल्यांकन।",
    legalStance: "कानूनी रुख",
    legalDetails: "कॉर्पोरेट पहचान और डिजिटल गोपनीयता शासनादेशों के ऐतिहासिक पालन का सत्यापन।",
    forensicLogTitle: "फोरेंसिक उल्लंघन लॉग",
    verifiedFor: "के लिए सत्यापित रिकॉर्ड",
    incidentEvent: "घटनाक्रम",
    timeline: "समयरेखा",
    intelSource: "इंटेलिजेंस स्रोत",
    action: "कार्रवाई",
    intelLink: "इंटेल लिंक",
    footerText: "वितरित फोरेंसिक नोड | V1.2-स्टेबल",
    viewMore: "और देखें",
    detailsTitle: "फोरेंसिक विवरण",
    buyCoffee: "कॉफी खरीदें",
    seoHeader: "प्रोब सिक्योरिटी स्कैनर का उपयोग क्यों करें?",
    protectedBy: "क्लाउडफ्लेयर द्वारा सुरक्षित",
    skipped: "मॉड्यूल छोड़ दिया गया",
    roles: {
      secops: "WAF पहचान",
      itpro: "SSL/TLS ऑडिट",
      risk: "विक्रेता जोखिम",
      security: "मैलवेयर विश्लेषण",
      forensics: "C2 जांच",
      compliance: "अनुपालन जांच",
      general: "सुरक्षित लिंक जांच"
    },
    useCaseText: {
      secops: "देखें कि क्या वेब परिधि क्लाउडफ्लेयर या AWS WAF द्वारा सुरक्षित है।",
      itpro: "किसी भी डोमेन के लिए SSL/TLS कॉन्फ़िगरेशन और प्रमाणपत्र वैधता सत्यापित करें।",
      risk: "पुराने डेटा उल्लंघन और कानूनी जोखिमों के लिए डोमेन को स्कैन करें।",
      security: "छिपे हुए घातक पेलोड और आक्रामक ट्रैकिंग स्क्रिप्ट का पता लगाएं।",
      forensics: "C2 सिग्नलिंग और संदिग्ध आउटबाउंड टेलीमेट्री ट्रैफिक की पहचान करें।",
      compliance: "सुनिश्चित करें कि DNSSEC, HSTS और CSP हेडर्स सही तरीके से कॉन्फ़िगर किए गए हैं।",
      general: "संदिग्ध ईमेल लिंक मिला? प्रोब सत्यापित करता है कि URL सुरक्षित है या नहीं।"
    }
  }
};

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isCaptchVerified, setIsCaptchaVerified] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('slate');
  const [fontSize, setFontSize] = useState<FontSize>('lg');
  const [language, setLanguage] = useState<Language>('en');
  const [captchaKey, setCaptchaKey] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [detailPopup, setDetailPopup] = useState<{ title: string; content: string } | null>(null);
  
  const [scanConfig, setScanConfig] = useState<ScanConfig>({
    hosting: true,
    security: true,
    dns: true,
    waf: true,
    assets: true,
    history: true,
    attack: true,
    stack: true
  });

  const t = translations[language];

  // Added USE_CASES definition to fix missing variable error
  const USE_CASES = [
    { icon: Shield, role: t.roles.secops, text: t.useCaseText.secops },
    { icon: Lock, role: t.roles.itpro, text: t.useCaseText.itpro },
    { icon: Briefcase, role: t.roles.risk, text: t.useCaseText.risk },
    { icon: Search, role: t.roles.security, text: t.useCaseText.security },
    { icon: Terminal, role: t.roles.forensics, text: t.useCaseText.forensics },
    { icon: Scale, role: t.roles.compliance, text: t.useCaseText.compliance },
    { icon: ShieldQuestion, role: t.roles.general, text: t.useCaseText.general }
  ];

  // Timing states
  const [scanDuration, setScanDuration] = useState<number>(0);
  const [finalDuration, setFinalDuration] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.className = `theme-${theme} font-size-${fontSize}`;
  }, [theme, fontSize]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !isCaptchVerified) return;

    // Smart Validation: Prepend https:// if protocol is missing
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
      setUrl(targetUrl);
    }

    setIsScanning(true);
    setError(null);
    setScanResult(null);
    setScanDuration(0);
    setFinalDuration(null);

    const startTime = Date.now();
    timerRef.current = window.setInterval(() => {
      setScanDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 100);

    try {
      const { result, sources: groundingSources } = await performUrlScan(targetUrl, language, scanConfig);
      setScanResult(result);
      setSources(groundingSources);
      setCaptchaKey(prev => prev + 1);
      setIsCaptchaVerified(false);
      setFinalDuration(Math.floor((Date.now() - startTime) / 1000));
    } catch (err: any) {
      setError(err.message || (language === 'hi' ? 'स्कैनिंग के दौरान एक त्रुटि हुई। कृपया URL की जाँच करें।' : 'An error occurred during scanning. Please check the URL and try again.'));
      setCaptchaKey(prev => prev + 1);
      setIsCaptchaVerified(false);
    } finally {
      setIsScanning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleDownload = () => {
    if (scanResult) {
      generatePdfReport(scanResult, language);
    }
  };

  const handleNewScan = () => {
    setScanResult(null);
    setUrl('');
    setIsCaptchaVerified(false);
    setCaptchaKey(prev => prev + 1);
  };

  const getThemeConfig = () => {
    switch(theme) {
      case 'midnight': return { accent: 'from-purple-500 to-pink-500', textAccent: 'text-purple-400', bg: 'bg-purple-600/20', btn: 'bg-purple-500 border-purple-400 text-white' };
      case 'cyber': return { accent: 'from-emerald-400 to-yellow-400', textAccent: 'text-emerald-400', bg: 'bg-emerald-600/20', btn: 'bg-emerald-500 border-emerald-400 text-slate-950' };
      case 'oceanic': return { accent: 'from-cyan-400 to-blue-600', textAccent: 'text-cyan-400', bg: 'bg-cyan-600/20', btn: 'bg-cyan-500 border-cyan-400 text-slate-950' };
      case 'volcanic': return { accent: 'from-red-600 to-orange-500', textAccent: 'text-red-400', bg: 'bg-red-900/20', btn: 'bg-red-600 border-red-500 text-white' };
      case 'emerald': return { accent: 'from-green-400 to-emerald-600', textAccent: 'text-green-400', bg: 'bg-green-600/20', btn: 'bg-green-500 border-emerald-400 text-slate-950' };
      case 'amethyst': return { accent: 'from-indigo-500 to-purple-600', textAccent: 'text-indigo-400', bg: 'bg-indigo-600/20', btn: 'bg-indigo-600 border-indigo-500 text-white' };
      default: return { accent: 'from-blue-400 to-emerald-400', textAccent: 'text-blue-400', bg: 'bg-blue-600/30', btn: 'bg-blue-500 border-blue-400 text-white' };
    }
  };

  const themeConfig = getThemeConfig();

  const toggleConfig = (key: keyof ScanConfig) => {
    setScanConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ConfigToggle = ({ label, icon: Icon, active, onToggle }: any) => (
    <button 
      onClick={onToggle}
      className={`flex items-center justify-between w-full p-2.5 rounded-xl border transition-all text-[11px] font-bold uppercase tracking-widest ${active ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-600 opacity-60'}`}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} />
        {label}
      </div>
      {active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
    </button>
  );

  const ResultCard = ({ title, icon: Icon, children, className = "", fullContent, skipped }: any) => {
    const isLongText = typeof fullContent === 'string' && fullContent.length > 80;

    return (
      <article className={`result-card bg-slate-900/60 border border-slate-800 rounded-xl p-3 hover:border-blue-500/30 transition-all flex flex-col relative group/card ${className} ${skipped ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg shrink-0">
              <Icon className="text-blue-400" size={16} />
            </div>
            <h3 className="font-bold text-slate-100 tracking-tight text-[10px] sm:text-[11px] uppercase line-clamp-1">{title}</h3>
          </div>
          {isLongText && !skipped && (
            <button 
              onClick={() => setDetailPopup({ title, content: fullContent })}
              className="p-1 bg-slate-800 rounded opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-slate-700"
              title={t.viewMore}
            >
              <Maximize2 size={12} className="text-blue-400" />
            </button>
          )}
        </div>
        <div className="space-y-2 flex-1">
          {skipped ? (
            <div className="h-full flex items-center justify-center italic text-[10px] text-slate-500 font-mono">
              [ {t.skipped} ]
            </div>
          ) : children}
        </div>
      </article>
    );
  };

  return (
    <div className={`min-h-screen text-slate-200 selection:bg-blue-500/30 transition-colors duration-500 pb-4 flex flex-col`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ${themeConfig.bg} blur-[120px] rounded-full transition-all duration-1000`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] ${themeConfig.bg} blur-[120px] rounded-full transition-all duration-1000 opacity-50`}></div>
      </div>

      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo accentColor={themeConfig.accent} size={48} />
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <Cloud size={12} className="text-orange-400" />
              <span className="text-[10px] font-black uppercase text-orange-400 tracking-widest">{t.protectedBy}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex bg-slate-900 p-1 rounded-xl border border-slate-800" aria-label="Language selection">
              {(['en', 'hi'] as Language[]).map((l) => (
                <button 
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-3 py-1.5 text-[10px] rounded-lg transition-all font-black uppercase flex items-center gap-1.5 ${language === l ? 'bg-blue-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  aria-pressed={language === l}
                >
                  <Languages size={12} />
                  {l === 'en' ? 'EN' : 'हि'}
                </button>
              ))}
            </nav>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white"
              aria-label="Settings"
            >
              <SettingsIcon size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Detail Popup Modal */}
      {detailPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setDetailPopup(null)}></div>
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-5">
               <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-2">
                    <Activity size={18} className="text-blue-400" />
                    <h2 className="text-lg font-black uppercase italic tracking-tighter text-white">{detailPopup.title}</h2>
                 </div>
                 <button onClick={() => setDetailPopup(null)} className="p-1 hover:bg-slate-800 rounded-lg"><X size={20} /></button>
               </div>
               <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[60vh] overflow-y-auto">
                 <p className="text-slate-300 text-sm leading-relaxed font-medium whitespace-pre-wrap">{detailPopup.content}</p>
               </div>
             </div>
             <div className={`h-1 w-full bg-gradient-to-r ${themeConfig.accent}`}></div>
          </div>
        </div>
      )}

      {/* Settings Side Panel */}
      <aside className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isSettingsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-800 p-6 transition-transform duration-300 transform shadow-2xl ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black italic uppercase tracking-widest text-white">{t.settingsTitle}</h2>
            <button onClick={() => setIsSettingsOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="space-y-8 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">{t.scanArchitecture}</label>
              <div className="space-y-2">
                <ConfigToggle label={t.hostingRep} icon={Server} active={scanConfig.hosting} onToggle={() => toggleConfig('hosting')} />
                <ConfigToggle label={t.securityTls} icon={Lock} active={scanConfig.security} onToggle={() => toggleConfig('security')} />
                <ConfigToggle label={t.dnsSecurity} icon={Binary} active={scanConfig.dns} onToggle={() => toggleConfig('dns')} />
                <ConfigToggle label={t.wafProfile} icon={ShieldEllipsis} active={scanConfig.waf} onToggle={() => toggleConfig('waf')} />
                <ConfigToggle label={t.assetIntegrity} icon={FileCode} active={scanConfig.assets} onToggle={() => toggleConfig('assets')} />
                <ConfigToggle label={t.incidentHistory} icon={History} active={scanConfig.history} onToggle={() => toggleConfig('history')} />
                <ConfigToggle label={t.attackIntel} icon={Zap} active={scanConfig.attack} onToggle={() => toggleConfig('attack')} />
                <ConfigToggle label={t.stackForensics} icon={Layers} active={scanConfig.stack} onToggle={() => toggleConfig('stack')} />
              </div>
            </div>

            <div className="sm:hidden">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">{t.language}</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['en', 'hi'] as Language[]).map((l) => (
                  <button 
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`py-2 text-xs rounded-lg transition-all font-black uppercase flex items-center justify-center gap-2 ${language === l ? 'bg-blue-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Languages size={14} />
                    {l === 'en' ? 'English' : 'हिन्दी'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">{t.fontSize}</label>
              <div className="grid grid-cols-4 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['xs', 'sm', 'md', 'lg'] as FontSize[]).map((s) => (
                  <button 
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`py-2 text-xs rounded-lg transition-all font-black uppercase ${fontSize === s ? 'bg-blue-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">{t.aesthetic}</label>
              <div className="grid grid-cols-1 gap-2">
                {(['slate', 'midnight', 'cyber', 'oceanic', 'volcanic', 'emerald', 'amethyst'] as Theme[]).map((tTheme) => (
                  <button 
                    key={tTheme}
                    onClick={() => setTheme(tTheme)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest ${theme === tTheme ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                      tTheme === 'slate' ? 'from-blue-400 to-emerald-400' :
                      tTheme === 'midnight' ? 'from-purple-500 to-pink-500' :
                      tTheme === 'cyber' ? 'from-emerald-400 to-yellow-400' :
                      tTheme === 'oceanic' ? 'from-cyan-400 to-blue-600' :
                      tTheme === 'volcanic' ? 'from-red-600 to-orange-500' :
                      tTheme === 'emerald' ? 'from-green-400 to-emerald-600' :
                      'from-indigo-500 to-purple-600'
                    }`}></div>
                    {tTheme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Incident Records Modal */}
      {isIncidentModalOpen && scanResult && scanResult.incidentHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsIncidentModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className={`h-1.5 w-full bg-gradient-to-r ${themeConfig.accent}`}></div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">{t.forensicLogTitle}</h2>
                  <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">{t.verifiedFor}: {scanResult.url}</p>
                </div>
                <button 
                  onClick={() => setIsIncidentModalOpen(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.incidentEvent}</th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.timeline}</th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.intelSource}</th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">{t.action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanResult.incidentHistory.breaches.map((incident, idx) => (
                      <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                        <td className="py-4 px-4">
                          <div className="font-bold text-sm text-slate-200 group-hover:text-blue-400 transition-colors">{incident.title}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">{incident.date}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs text-slate-400 italic line-clamp-1">{incident.reference}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <a 
                            href={incident.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all group/btn"
                          >
                            {t.intelLink} <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-4 relative z-10 flex-1 flex flex-col">
        {!scanResult && !isScanning && (
          <div className="grid lg:grid-cols-[1fr,1.5fr] gap-12 items-center flex-1 my-8">
            <section className="hidden lg:flex flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-1000" aria-labelledby="audit-capabilities-title">
              <div className="mb-4">
                <h2 id="audit-capabilities-title" className={`text-xs font-black uppercase tracking-[0.3em] ${themeConfig.textAccent} mb-1`}>{t.operationScenarios}</h2>
                <div className="h-0.5 w-12 bg-blue-500"></div>
              </div>
              <div className="grid gap-2">
                {USE_CASES.map((uc, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:bg-slate-800/40 transition-all group">
                    <div className={`p-2 bg-slate-950 rounded-lg group-hover:scale-110 transition-transform ${themeConfig.textAccent}`}>
                      <uc.icon size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{uc.role}</span>
                      <p className="text-sm text-slate-300 font-medium leading-snug">{uc.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 border border-slate-800/50 rounded-2xl bg-slate-950/20">
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">{t.seoHeader}</h3>
                <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                  Probe is the definitive tool for <span className="text-slate-400">identifying malicious servers</span>, <span className="text-slate-400">SSL vulnerability assessment</span>, and <span className="text-slate-400">real-time cyber threat intelligence</span>. Whether you are a security professional or a regular user checking if a website is safe, our AI-powered probe delivers deep infrastructure forensic audits in seconds.
                </p>
              </div>
            </section>

            <div className="flex flex-col justify-center">
              <div className="text-center lg:text-left mb-8">
                <h1 className="font-black mb-2 tracking-tighter leading-none uppercase italic italic-skew-12">
                  Probe <span className={`bg-clip-text text-transparent bg-gradient-to-r ${themeConfig.accent}`}>{t.intelligence}</span>
                </h1>
                <p className="text-slate-400 mb-6 font-medium leading-tight opacity-80 max-w-lg mx-auto lg:mx-0">
                  {t.description}
                </p>
              </div>

              <div className="w-full max-w-2xl mx-auto lg:mx-0">
                <form onSubmit={handleScan} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder={t.placeholder}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="block w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-slate-700 text-sm font-mono shadow-xl"
                        aria-label="Target URL for scan"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isScanning || !isCaptchVerified || !url}
                      className={`px-6 py-3 rounded-xl font-black transition-all flex items-center justify-center gap-3 active:translate-y-0.5 ${themeConfig.btn} border-b-4 border-slate-950/20 shadow-lg hover:brightness-110 disabled:opacity-50 disabled:translate-y-0`}
                    >
                      {isScanning ? <Loader2 className="animate-spin" size={18} /> : <Cpu size={18} />}
                      <span className="tracking-widest uppercase text-[12px] whitespace-nowrap">{t.initButton}</span>
                    </button>
                  </div>
                  <div className="mt-4">
                    <div className="scale-[0.85] sm:scale-95 origin-left">
                      <Captcha key={captchaKey} onVerify={setIsCaptchaVerified} />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {isScanning && (
          <div className="max-w-xl mx-auto text-center py-16 flex-1 flex flex-col justify-center">
            <div className="relative w-32 h-32 mx-auto mb-8 animate-float">
              <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="50" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                <circle
                  cx="56" cy="56" r="50"
                  stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray="314.15"
                  className={`bg-clip-text text-transparent bg-gradient-to-r ${themeConfig.accent} animate-[progress_2s_ease-in-out_infinite]`}
                  style={{ stroke: `url(#progressGradient-${theme})`, strokeLinecap: 'round' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className={`animate-pulse ${themeConfig.textAccent}`} size={40} />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full shadow-lg">
                <GlobeIcon size={14} className="text-blue-400" />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest truncate max-w-[200px] sm:max-w-xs">{url}</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Timer className={themeConfig.textAccent} size={18} />
                <span className="text-xl font-mono font-black text-white">{scanDuration}s {t.elapsed}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black mb-1 uppercase tracking-tighter">{t.probing}</h3>
                <p className="text-slate-500 font-mono text-xs max-w-sm mx-auto uppercase tracking-widest opacity-60">
                  {t.auditingTasks}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto bg-red-500/5 border border-red-500/10 p-4 rounded-xl flex gap-4 items-start mb-4 shadow-lg">
            <AlertTriangle className="text-red-500" size={20} />
            <p className="text-sm text-red-400 font-medium leading-snug">{error}</p>
          </div>
        )}

        {scanResult && !isScanning && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 max-w-full my-8">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center justify-between shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${themeConfig.accent}`}></div>
              
              <div className="flex-1 space-y-5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border ${
                    scanResult.masterRating > 75 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    scanResult.masterRating > 50 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {scanResult.masterRating > 75 ? <ShieldCheck size={14} className="inline mr-2" /> : <AlertTriangle size={14} className="inline mr-2" />} 
                    {t.masterIndex}
                  </div>
                  <span className="text-slate-500 text-[11px] font-mono truncate max-w-[250px] sm:max-w-md bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">{scanResult.url}</span>
                </div>
                <div className="space-y-3">
                   <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">{t.executiveBriefing}</h2>
                   <p className="text-slate-300 text-lg sm:text-xl leading-relaxed font-medium">
                     {scanResult.summary}
                   </p>
                   {/* Grounding Sources Rendering - Required by Gemini API Guidelines */}
                   {sources.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-4">
                       {sources.map((source, idx) => (
                         <a 
                           key={idx} 
                           href={source.uri} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-blue-500/20 group"
                         >
                           <ExternalLink size={10} className="group-hover:translate-x-0.5 transition-transform" />
                           {source.title}
                         </a>
                       ))}
                     </div>
                   )}
                   <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-slate-800/50">
                     {finalDuration !== null && (
                       <div className="flex items-center gap-2">
                          <Timer className={themeConfig.textAccent} size={14} />
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{t.processingTime}: <span className="text-white">{finalDuration} {t.seconds}</span></span>
                       </div>
                     )}
                     <button 
                        onClick={handleNewScan}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest border border-blue-500/30 group"
                     >
                       <PlusCircle size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                       {t.scanNewTarget}
                     </button>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8 shrink-0">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                    <circle
                      cx="50" cy="50" r="44"
                      stroke="currentColor" strokeWidth="12" fill="transparent"
                      strokeDasharray="276.46"
                      strokeDashoffset={276.46 - (276.46 * scanResult.masterRating) / 100}
                      className={`transition-all duration-1000 ${scanResult.masterRating > 75 ? 'text-emerald-500' : scanResult.masterRating > 50 ? 'text-orange-500' : 'text-red-500'}`}
                      style={{ strokeLinecap: 'round' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="font-black text-4xl leading-none">{scanResult.masterRating}</span>
                    <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{t.score}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] animate-pulse">
                    {t.downloadCaption}
                  </span>
                  <button 
                    onClick={handleDownload} 
                    className="p-4 bg-white text-slate-950 rounded-2xl hover:bg-slate-200 transition-all shadow-xl active:scale-95 group relative overflow-hidden"
                    title={t.downloadTooltip}
                  >
                    <Download size={24} className="group-hover:translate-y-1 transition-transform relative z-10" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <ResultCard title={t.hostingRep} icon={Server} fullContent={scanResult.hostingReputation?.details} skipped={!scanConfig.hosting}>
                {scanResult.hostingReputation && (
                  <>
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500 uppercase tracking-widest">{t.providerTrust}</span>
                      <span className={scanResult.hostingReputation.score > 70 ? 'text-emerald-500' : 'text-orange-500'}>{scanResult.hostingReputation.score}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-3">{scanResult.hostingReputation.details}</p>
                  </>
                )}
              </ResultCard>

              <ResultCard title={t.securityTls} icon={Lock} fullContent={scanResult.securityPosture?.details} skipped={!scanConfig.security}>
                {scanResult.securityPosture && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{t.tlsGrade}</span>
                      <span className={`text-lg font-black ${['A+', 'A'].includes(scanResult.securityPosture.tlsRating) ? 'text-emerald-500' : 'text-red-500'}`}>{scanResult.securityPosture.tlsRating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {scanResult.securityPosture.headers.slice(0, 3).map((h, i) => <span key={i} className="px-1 py-0.5 bg-blue-500/5 text-[8px] text-blue-400 border border-blue-500/10 rounded uppercase font-bold">{h.split(':')[0]}</span>)}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug truncate italic">{scanResult.securityPosture.tlsStatus}</p>
                  </>
                )}
              </ResultCard>

              <ResultCard title={t.assetIntegrity} icon={FileCode} fullContent={scanResult.maliciousAssets?.summary} skipped={!scanConfig.assets}>
                {scanResult.maliciousAssets && (
                  <>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 font-black uppercase">{t.vulnsAudit}</span>
                      <div className="text-[10px] font-bold truncate">
                        {scanResult.maliciousAssets.jsVulnerabilities.length > 0 ? (
                          <span className="text-red-400">🚨 {scanResult.maliciousAssets.jsVulnerabilities[0]}</span>
                        ) : (
                          <span className="text-emerald-400">✅ {t.codeClean}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">{scanResult.maliciousAssets.summary}</p>
                  </>
                )}
              </ResultCard>

              <ResultCard title={t.wafProfile} icon={ShieldEllipsis} fullContent={scanResult.wafProtection?.details} skipped={!scanConfig.waf}>
                {scanResult.wafProtection && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-500 uppercase">{t.perimeter}</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${scanResult.wafProtection.detected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {scanResult.wafProtection.detected ? t.shielded : t.exposed}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest truncate">{scanResult.wafProtection.provider || 'Origin Unmasked'}</div>
                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">{scanResult.wafProtection.details}</p>
                  </>
                )}
              </ResultCard>

              <ResultCard title={t.dnsSecurity} icon={Binary} fullContent={scanResult.dnsSecurity?.details} skipped={!scanConfig.dns}>
                {scanResult.dnsSecurity && (
                  <>
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500 uppercase tracking-widest">{t.auditScore}</span>
                      <span className="text-blue-400">{scanResult.dnsSecurity.score}%</span>
                    </div>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-tighter truncate">{scanResult.dnsSecurity.provider}</div>
                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">{scanResult.dnsSecurity.details}</p>
                  </>
                )}
              </ResultCard>

              <ResultCard title={t.incidentHistory} icon={History} fullContent={scanResult.incidentHistory?.legalCharges} skipped={!scanConfig.history}>
                {scanResult.incidentHistory && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 font-black uppercase">{t.forensicRecord}</span>
                      <span className={`text-[10px] font-black ${scanResult.incidentHistory.recordFound ? 'text-red-500' : 'text-emerald-500'}`}>
                        {scanResult.incidentHistory.recordFound ? t.breachFound : t.noRecord}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-2 mb-2">{scanResult.incidentHistory.legalCharges}</p>
                    {scanResult.incidentHistory.recordFound && (
                      <button 
                        onClick={() => setIsIncidentModalOpen(true)}
                        className="mt-auto w-full flex items-center justify-between p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all group"
                      >
                        {t.intelLog} <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </>
                )}
              </ResultCard>

              <ResultCard title={t.attackIntel} icon={Zap} fullContent={scanResult.attackPotential?.analysis} skipped={!scanConfig.attack}>
                {scanResult.attackPotential && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${scanResult.attackPotential.threatLevel === 'High' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-slate-950'}`}>
                        {scanResult.attackPotential.threatLevel}
                      </span>
                      <span className="text-[9px] text-slate-500 uppercase font-black">{t.threatLevel}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {scanResult.attackPotential.attackTypes.slice(0, 2).map((tType, i) => <span key={i} className="text-[8px] font-bold text-red-400 border-b border-red-500/20 uppercase">{tType}</span>)}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">{scanResult.attackPotential.analysis}</p>
                  </>
                )}
              </ResultCard>

              <ResultCard title={t.stackForensics} icon={Layers} fullContent={scanResult.stackVulnerabilities?.details} skipped={!scanConfig.stack}>
                {scanResult.stackVulnerabilities && (
                  <>
                    <div className="flex flex-wrap gap-1">
                      {scanResult.stackVulnerabilities.frameworks.slice(0, 3).map((f, i) => <span key={i} className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] font-bold text-slate-100 uppercase border border-slate-700">{f}</span>)}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">{scanResult.stackVulnerabilities.details}</p>
                  </>
                )}
              </ResultCard>

              <ResultCard title={t.c2Signaling} icon={Waves} fullContent={t.trafficDetails}>
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[9px] font-black text-slate-400 uppercase">{t.trafficAudit}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug line-clamp-3">{t.trafficDetails}</p>
              </ResultCard>

              <ResultCard title={t.identityPosture} icon={UserCheck} fullContent={t.legalDetails}>
                <div className="flex items-center gap-2 mb-1">
                   <ShieldCheck size={12} className="text-emerald-500" />
                   <span className="text-[9px] font-black text-slate-400 uppercase">{t.legalStance}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug line-clamp-3">{t.legalDetails}</p>
              </ResultCard>
            </div>
          </div>
        )}

        {scanResult && !isScanning && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce hover:animate-none">
            <a 
              href="https://buymeacoffee.com/soumenm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-yellow-400 text-slate-900 rounded-full font-black shadow-2xl hover:scale-110 transition-transform text-xs uppercase tracking-widest"
            >
              <Coffee size={16} />
              {t.buyCoffee}
            </a>
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-slate-900/50 pt-6 px-6 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${themeConfig.textAccent} text-center sm:text-left leading-relaxed drop-shadow-sm`}>
          © 2026 PROBE WEB SECURITY SCANNER | {t.footerText}
        </div>
        <div className="flex items-center gap-4">
          <a href="https://www.linkedin.com/in/mukherjee/" target="_blank" className={`flex items-center gap-2 text-[10px] font-black ${themeConfig.textAccent} hover:brightness-125 transition-all uppercase tracking-widest drop-shadow-sm`}>
            <Linkedin size={14} /> SOUMEN MUKHERJEE
          </a>
        </div>
      </footer>

      <style>{`
        @keyframes progress {
          0% { stroke-dashoffset: 314.15; }
          50% { stroke-dashoffset: 157.07; }
          100% { stroke-dashoffset: 0; }
        }
        .italic-skew-12 {
          transform: skewX(-12deg);
        }
      `}</style>
    </div>
  );
};

export default App;
