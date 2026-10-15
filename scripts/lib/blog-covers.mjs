import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const escape = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
// Flat editorial artwork, not a literal architecture diagram. Deterministic per
// article, so rebuilds never churn assets. Existing authored imagery always wins.
export function prepareCovers(posts, publicDir, categoryFor) {
  const manifest = {};
  const ordered = [...posts.values()].sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0)||a.slug.localeCompare(b.slug));
  const previousByCategory = new Map();
  let previousVariant = -1;
  for (const post of ordered) {
    const base = `/images/${post.slug}/`;
    const bodyImage = post.html.match(/<img\b[^>]*src="([^"]+)"/i)?.[1];
    const choices = [`${base}resource-cover.png`, `${base}resource-cover.svg`, post.heroImage, bodyImage];
    const reusable = choices.find(src => src && (src.startsWith('https://') || (src.startsWith('/') && existsSync(join(publicDir, src.slice(1))))));
    const image = reusable || `${base}editorial-cover.svg`;
    if (!reusable) {
      const path = join(publicDir, image.slice(1));
      mkdirSync(join(publicDir, 'images', post.slug), {recursive:true});
      const category = categoryFor(post.slug);
      const preferred = /semantic|osi|metric|ontology/.test(post.slug) ? 0 : /context|knowledge|rag|schema/.test(post.slug) ? 1 : /agent|copilot/.test(post.slug) ? 2 : /lake|warehouse|storage|pipeline|cdc/.test(post.slug) ? 3 : 4;
      // Avoid repeating the same composition in neighboring feed/category cards.
      let variant = preferred;
      while (variant === previousVariant || variant === previousByCategory.get(category)) variant = (variant + 1) % 5;
      previousVariant = variant;
      previousByCategory.set(category, variant);
      const art = artwork(post, category, variant);
      if (!existsSync(path) || readFileSync(path,'utf8') !== art) writeFileSync(path,art);
    }
    post.listImage = image;
    manifest[post.slug] = {image, source: reusable ? 'reused' : 'generated-flat-svg'};
  }
  return manifest;
}

function artwork(post, category, variant) {
  let seed = 0; for(const c of post.slug) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  const tone = seed % 3;
  const bg = ['#eeebfb','#f7f7f2','#402df3'][tone];
  const ink = tone===2 ? '#f7f7f2' : '#402df3';
  const faint = tone===2 ? '#b3a4ff' : '#b3a4ff';

  const offset = seed % 45;
  let art = '';
  if(variant===0) {
    for(let i=0;i<5;i++) art+=`<rect x="${240+i*43}" y="${140+i*19}" width="${680-i*86}" height="${400-i*38}" rx="${110-i*15}" opacity="${.2+i*.16}"/>`;
    art+='<path d="M110 340H1010"/><circle cx="600" cy="340" r="62" fill="'+ink+'"/><path d="M580 340h40m-20-20v40" stroke="'+bg+'"/>';
  } else if(variant===1) {
    for(let i=0;i<6;i++) art+=`<path d="M${230+i*48} 540V${180+i*13}H600a${170-i*20} ${170-i*20} 0 0 1 0 ${340-i*40}Z" opacity="${.2+i*.14}"/>`;
    art+='<path d="M130 540H1030"/><circle cx="830" cy="220" r="16" fill="'+ink+'"/>';
  } else if(variant===2) {
    const shape=seed%4;
    if(shape===0) art='<rect x="250" y="170" width="700" height="340" rx="140"/><path d="m580 170 25 0-16-13m31 353-25 0 16 13"/>';
    if(shape===1) art='<ellipse cx="600" cy="340" rx="350" ry="180"/><ellipse cx="600" cy="340" rx="250" ry="180" opacity=".35"/><ellipse cx="600" cy="340" rx="150" ry="180" opacity=".2"/>';
    if(shape===2) art='<path d="M270 230h660v260H270Z"/><path d="M270 360h660M600 230v260" opacity=".25"/><path d="m900 230 30 0-16-16"/>';
    if(shape===3) art='<path d="M280 340C280 80 600 160 600 340S920 600 920 340 600 80 600 340 280 600 280 340Z"/>';
    art+='<circle cx="600" cy="340" r="'+(55+seed%40)+'"/>';
    const count=3+seed%5;
    for(let i=0;i<count;i++){const angle=i/count*Math.PI*2;const x=600+Math.cos(angle)*330,y=340+Math.sin(angle)*165;art+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${12+seed%12}" fill="${ink}"/>`;}
    art+='<path d="M540 340h120M600 280v120" opacity=".4"/>';
  } else if(variant===3) {
    for(let i=0;i<3;i++) {const x=210+i*270; art+=`<rect x="${x}" y="${210+(i%2)*80}" width="210" height="220" rx="6"/><path d="M${x+30} ${270+(i%2)*80}h150m-150 45h110m-110 45h130" opacity=".4"/>`;if(i<2)art+=`<path d="M${x+210} 340h60"/>`;}
  } else {
    const nodes=Array.from({length:12},(_,i)=>({x:230+(i%4)*240+(i%2)*offset,y:180+Math.floor(i/4)*170+(i%3)*16}));
    nodes.forEach((n,i)=>{if(i<11){const m=nodes[i+1];art+=`<path d="M${n.x} ${n.y}L${m.x} ${m.y}" opacity=".35"/>`;}if(i<8){const m=nodes[i+4];art+=`<path d="M${n.x} ${n.y}L${m.x} ${m.y}" opacity=".35"/>`;}});
    nodes.forEach((n,i)=>art+=`<circle cx="${n.x}" cy="${n.y}" r="${i%4===seed%4?30:12}" fill="${i%4===seed%4?ink:bg}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750"><title>${escape(post.title)} — editorial illustration</title><rect width="1200" height="750" fill="${bg}"/><circle cx="${1020-offset}" cy="100" r="230" fill="${faint}" opacity=".08"/><g fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" transform="translate(${offset-22} 0)">${art}</g><path d="M64 654h1072" stroke="${ink}" opacity=".25"/><text x="64" y="703" fill="${ink}" font-family="Arial,sans-serif" font-size="18" letter-spacing="3">DATUS / ${escape((category || 'FIELD NOTES').toUpperCase())}</text></svg>\n`;
}
