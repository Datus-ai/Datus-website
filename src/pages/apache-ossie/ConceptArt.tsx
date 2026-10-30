/** Small editorial diagrams accompany the adjacent explanatory text. */
export function ConceptArt({kind}:{kind:number}){
 const node=(x:number,y:number,r=6)=><circle key={`${x}-${y}`} cx={x} cy={y} r={r} className="ossie-concept-node"/>;
 return <svg className="ossie-concept-art" viewBox="0 0 300 140" fill="none" aria-hidden="true">
  {kind===0&&<><path d="M48 35h48l18 18v58H48z"/><path d="M96 35v20h18M62 69h32M62 80h22M62 91h28"/><path className="ossie-concept-stream" d="M114 75C153 75 151 30 195 30M114 75H195M114 75C153 75 151 118 195 118"/>{[30,75,118].map(y=><g key={y}><rect x="195" y={y-12} width="56" height="24" rx="3"/><path d={`M206 ${y}h32`}/></g>)}</>}
  {kind===1&&<><circle cx="48" cy="38" r="11"/><rect x="37" y="91" width="22" height="22" rx="2"/><path className="ossie-concept-stream" d="M59 38C98 38 91 72 128 72M59 102C98 102 91 72 128 72M174 72C207 72 210 38 242 38M174 72C207 72 210 102 242 102"/><rect className="ossie-concept-surface" x="128" y="43" width="46" height="58" rx="3"/><path d="M140 58h22M140 69h18M140 80h22M140 89h13"/><circle cx="252" cy="38" r="11"/><circle cx="252" cy="102" r="11"/></>}
  {kind===2&&<><rect x="26" y="45" width="53" height="60" rx="3"/><path d="M38 59h27M38 70h20M38 81h25M38 92h15"/><path className="ossie-concept-stream" d="M79 75H126M174 75H218"/><circle className="ossie-concept-surface" cx="150" cy="75" r="24"/><path d="m142 64-10 11 10 11M158 64l10 11-10 11"/><rect x="218" y="52" width="60" height="46" rx="3"/><path d="M230 66h35M230 77h25M230 88h31"/></>}
  {kind===3&&<><path className="ossie-concept-stream" d="M48 84L122 39L202 72L262 34M122 39L139 113L202 72L259 112M48 84L139 113"/>{[[48,84],[122,39],[202,72],[262,34],[139,113],[259,112]].map(([x,y],i)=>node(x,y,i===1||i===2?11:6))}</>}
  {kind===4&&<><path d="M38 38L88 70L38 111M88 70L136 39M88 70L137 111"/>{[[38,38],[88,70],[38,111],[136,39],[137,111]].map(([x,y])=>node(x,y,5))}<path className="ossie-concept-stream" d="M145 70H190"/><rect className="ossie-concept-surface" x="192" y="38" width="82" height="74" rx="3"/><path d="M192 62H274M192 87H274M220 38V112M246 38V112"/></>}
  {kind===5&&<><rect x="29" y="40" width="66" height="69" rx="3"/><path d="M29 60h66M48 40v69M40 73h43M40 87h43"/><path className="ossie-concept-stream" d="M95 75H133M178 75H225"/><circle className="ossie-concept-surface" cx="155" cy="75" r="23"/><path d="M163 63h-16l10 12-10 12h16"/><rect className="ossie-concept-surface" x="225" y="55" width="49" height="40" rx="3"/><path d="M237 75h24"/></>}
 </svg>;
}
const motifs={shared:'shared-definition',relationships:'relationship-map',loops:'loop-field',agent:'agent-responsive-field',audit:'audit-trace-paths'};
export function IdentityWatermark({motif}:{motif:keyof typeof motifs}){
 return <div className={`ossie-watermark ossie-watermark--${motif}`} aria-hidden="true" style={{maskImage:`url('/brand/${motifs[motif]}-transparent.svg')`,WebkitMaskImage:`url('/brand/${motifs[motif]}-transparent.svg')`}}/>;
}
