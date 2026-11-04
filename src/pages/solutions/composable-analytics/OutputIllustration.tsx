export default function OutputIllustration({ variant }: { variant: number }) {
  const common = { className: 'ca-output-visual', viewBox: '0 0 160 96', fill: 'none', 'aria-hidden': true as const };

  if (variant === 0) return <svg {...common}>
    <path d="M13 76H104M23 68V22" className="ca-output-visual-muted" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M27 62L45 51L61 56L81 36L100 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="45" cy="51" r="4" fill="currentColor"/><circle cx="81" cy="36" r="4" fill="currentColor"/>
    <circle cx="106" cy="43" r="24" stroke="currentColor" strokeWidth="2.5"/><path d="M123 61L145 83" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
  </svg>;

  if (variant === 1) return <svg {...common}>
    <path d="M14 79H111M14 79V29" className="ca-output-visual-muted" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="28" y="54" width="13" height="25" rx="2" fill="currentColor" opacity=".45"/>
    <rect x="49" y="43" width="13" height="36" rx="2" fill="currentColor" opacity=".65"/>
    <rect x="70" y="30" width="13" height="49" rx="2" fill="currentColor"/>
    <rect x="91" y="48" width="13" height="31" rx="2" fill="currentColor" opacity=".6"/>
    <circle cx="126" cy="30" r="18" stroke="currentColor" strokeWidth="2.5"/><path d="M126 19V30L134 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;

  return <svg {...common}>
    <path d="M18 22H92M18 32H70M18 42H81" className="ca-output-visual-muted" strokeWidth="3" strokeLinecap="round"/>
    <path d="M18 77H101" className="ca-output-visual-muted" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="25" y="59" width="12" height="18" rx="2" fill="currentColor" opacity=".45"/>
    <rect x="45" y="52" width="12" height="25" rx="2" fill="currentColor" opacity=".65"/>
    <rect x="65" y="47" width="12" height="30" rx="2" fill="currentColor"/>
    <circle cx="120" cy="55" r="12" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M133 55H149M142 48L149 55L142 62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}
