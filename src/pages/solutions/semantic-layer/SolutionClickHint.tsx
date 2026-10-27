import { useEffect, useRef, useState, type CSSProperties } from 'react';
import InterfaceClickHint from '../../../components/InterfaceClickHint';
import './solution-click-hint.css';
export default function SolutionClickHint({label,repeat=false}:{label?:string;repeat?:boolean}){
 const root=useRef<HTMLSpanElement>(null),[visible,setVisible]=useState(false),[pageVisible,setPageVisible]=useState(true);
 useEffect(()=>{const page=()=>setPageVisible(!document.hidden);page();document.addEventListener('visibilitychange',page);const observer=new IntersectionObserver(([entry])=>{if(repeat)setVisible(entry.isIntersecting);else if(entry.isIntersecting){setVisible(true);observer.disconnect()}},{threshold:.5});if(root.current)observer.observe(root.current);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',page)}},[repeat]);
 return <span ref={root} className="solution-click-hint" data-visible={visible&&pageVisible} style={{'--solution-hint-repeats':repeat?'infinite':2,'--solution-hint-duration':repeat?'5s':'4s'} as CSSProperties} aria-hidden="true"><InterfaceClickHint label={label}/></span>;
}
