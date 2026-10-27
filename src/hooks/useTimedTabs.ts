import { useEffect, useRef, useState, type RefObject } from 'react';

/** Autoplay and its underline share one cycle; pausing preserves elapsed time. */
export function useTimedTabs(root:RefObject<HTMLElement>,count:number,duration=6500){
 const [active,setActive]=useState(0),[paused,setPaused]=useState(false),[visible,setVisible]=useState(false),[reduced,setReduced]=useState(true),[pageVisible,setPageVisible]=useState(true),[cycle,setCycle]=useState(0);
 const remaining=useRef(duration),version=useRef(0);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)'),motion=()=>setReduced(media.matches),page=()=>setPageVisible(!document.hidden);
  motion();page();media.addEventListener('change',motion);document.addEventListener('visibilitychange',page);
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.5});if(root.current)observer.observe(root.current);
  return()=>{observer.disconnect();media.removeEventListener('change',motion);document.removeEventListener('visibilitychange',page)};
 },[root]);
 const running=visible&&pageVisible&&!paused&&!reduced;
 useEffect(()=>{
  if(!running||count<2)return;
  const epoch=version.current,started=performance.now();
  const timer=setTimeout(()=>{version.current++;remaining.current=duration;setActive(index=>(index+1)%count);setCycle(value=>value+1)},remaining.current);
  return()=>{clearTimeout(timer);if(version.current===epoch)remaining.current=Math.max(0,remaining.current-(performance.now()-started))};
 },[running,active,cycle,count,duration]);
 function select(index:number){version.current++;remaining.current=duration;setActive((index+count)%count);setCycle(value=>value+1)}
 return {active,select,paused,setPaused,running,reduced,cycle,duration};
}
