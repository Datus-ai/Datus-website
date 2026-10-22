/** Progressive enhancement: SSR and no-JS content remain visible and readable. */
export function setupSectionReveals(root:ParentNode=document){
 if(!('IntersectionObserver' in window))return()=>{};
 const main=root.querySelector<HTMLElement>('main');if(!main)return()=>{};
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 const candidates=[...main.querySelectorAll<HTMLElement>('section, :scope > article, .journal-intro')];
 const selected=new Set(candidates);
 const sections=candidates.filter(element=>{
  if(element.matches('.nordic-hero')||element.closest('[data-reveal-skip]'))return false;
  for(let parent=element.parentElement;parent&&parent!==main;parent=parent.parentElement)if(selected.has(parent))return false;
  return true;
 });
 const footer=root.querySelector<HTMLElement>('.site-root > footer');if(footer)sections.push(footer);
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)show(entry.target as HTMLElement)}),{threshold:0,rootMargin:'0px 0px -24px 0px'});
 function show(element:HTMLElement,animate=true){
  observer.unobserve(element);element.classList.add('is-revealed');element.dataset.sectionState=animate&&!media.matches?'entering':'shown';
 }
 function start(){
  for(const element of sections){
   element.classList.add('site-section-reveal');
   if(media.matches){show(element,false);continue}
   const rect=element.getBoundingClientRect();
   if(rect.bottom<=0){show(element,false);continue}
   element.dataset.sectionState='pending';observer.observe(element);
  }
 }
 function revealTarget(target:EventTarget|null){
  if(!(target instanceof Element))return;
  for(const section of sections)if(section.contains(target))show(section,false);
 }
 function focus(event:Event){revealTarget(event.target)}
 function hash(){if(!location.hash)return;try{revealTarget(document.getElementById(decodeURIComponent(location.hash.slice(1))))}catch{/* Ignore malformed external fragments. */}}
 function motion(){if(media.matches)sections.forEach(element=>show(element,false));else start()}
 function ended(event:Event){const animation=event as AnimationEvent;if(animation.animationName==='site-section-enter'&&animation.target instanceof HTMLElement)animation.target.dataset.sectionState='shown'}
 function print(){sections.forEach(element=>show(element,false))}
 start();hash();media.addEventListener('change',motion);window.addEventListener('hashchange',hash);window.addEventListener('beforeprint',print);document.addEventListener('focusin',focus);document.addEventListener('animationend',ended);
 return()=>{observer.disconnect();media.removeEventListener('change',motion);window.removeEventListener('hashchange',hash);window.removeEventListener('beforeprint',print);document.removeEventListener('focusin',focus);document.removeEventListener('animationend',ended);sections.forEach(element=>{element.classList.remove('site-section-reveal','is-revealed');delete element.dataset.sectionState})};
}
