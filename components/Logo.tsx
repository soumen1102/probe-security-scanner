
import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number; accentColor?: string }> = ({ 
  className = "", 
  size = 72,
  accentColor = "from-blue-400 to-emerald-400"
}) => {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <div className="relative group shrink-0" style={{ width: size, height: size }}>
        {/* Intense Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
        
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-2xl scale-125"
        >
          {/* Enhanced Outer Scanning Circle - More Prominent */}
          <circle 
            cx="12" 
            cy="12" 
            r="10.5" 
            stroke="url(#probeGradient)" 
            strokeWidth="1.2" 
            strokeDasharray="3 3" 
            className="animate-[spin_8s_linear_infinite]" 
          />
          
          {/* Probe Lens Outer Ring */}
          <circle cx="12" cy="12" r="8" stroke="url(#probeGradient)" strokeWidth="0.5" strokeOpacity="0.5" />

          {/* Lens Frame */}
          <path
            d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6Z"
            fill="url(#probeGradient)"
            fillOpacity="0.15"
          />

          {/* Tactical Crosshair lines */}
          <line x1="12" y1="3" x2="12" y2="6" stroke="currentColor" strokeWidth="0.8" className="text-white/60" />
          <line x1="12" y1="18" x2="12" y2="21" stroke="currentColor" strokeWidth="0.8" className="text-white/60" />
          <line x1="3" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="0.8" className="text-white/60" />
          <line x1="18" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="0.8" className="text-white/60" />

          {/* Central Eye / Core */}
          <circle cx="12" cy="12" r="3.5" fill="#020617" stroke="url(#probeGradient)" strokeWidth="1.5" />
          
          {/* Pupil Pulse */}
          <circle cx="12" cy="12" r="1.2" fill="#10b981" className="animate-pulse">
            <animate attributeName="r" values="1;1.8;1" dur="1.5s" repeatCount="indefinite" />
          </circle>

          {/* Active Sweep Beam */}
          <path
            d="M12 12L12 4"
            stroke="url(#sweepGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            className="origin-center animate-[spin_4s_linear_infinite]"
          />

          <defs>
            <linearGradient id="probeGradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60a5fa" />
              <stop offset="1" stopColor="#34d399" />
            </linearGradient>
            <radialGradient id="sweepGradient" cx="12" cy="12" r="8" gradientUnits="userSpaceOnUse">
               <stop offset="0.5" stopColor="#10b981" stopOpacity="1" />
               <stop offset="1" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      <div className="flex flex-col leading-none select-none">
        <span className={`text-2xl sm:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${accentColor} uppercase italic skew-x-[-8deg]`}>
          PROBE
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black whitespace-nowrap">
            SECURITY SCANNER
          </span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>
      </div>
    </div>
  );
};
