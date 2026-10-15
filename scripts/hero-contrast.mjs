// Measure ideal foreground colors against every rendered background pixel within
// each hero text line. A text-transparent screenshot retains image, scrim and
// button surfaces; browser compositing also handles partially transparent type.
export async function measureHeroContrast(page) {
  await page.locator('.hero-galaxy').evaluate(image=>image.decode());
  const lines=await page.evaluate(()=>{
    const hero=document.querySelector('.hero').getBoundingClientRect();
    const walker=document.createTreeWalker(document.querySelector('.hero-copy'),NodeFilter.SHOW_TEXT);
    const lines=[];
    while(walker.nextNode()){
      const node=walker.currentNode;if(!node.textContent.trim())continue;
      const parent=node.parentElement;const color=getComputedStyle(parent).color;
      const range=document.createRange();range.selectNodeContents(node);
      const name=parent.closest('h1,.eyebrow,.hero-promise,.agent-line,.proof-line,a')?.className || parent.tagName;
      for(const rect of range.getClientRects()) if(rect.width&&rect.height)lines.push({name,color,x:rect.x-hero.x,y:rect.y-hero.y,width:rect.width,height:rect.height});
    }
    return lines;
  });
  const hide=await page.addStyleTag({content:'.hero-copy, .hero-copy * { color: transparent !important; text-shadow: none !important; }'});
  let pixels;
  try {pixels=await page.locator('.hero').screenshot({animations:'disabled'});}finally{await hide.evaluate(style=>style.remove());}
  return page.evaluate(async({lines,encoded})=>{
    const image=new Image();image.src='data:image/png;base64,'+encoded;await image.decode();
    const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
    const {data}=context.getImageData(0,0,canvas.width,canvas.height);
    const luminance=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    const result={};
    for(const line of lines){
      const color=line.color.match(/[\d.]+/g).map(Number),alpha=color[3]??1;
      let minimum=Infinity;
      for(let y=Math.max(0,Math.floor(line.y));y<Math.min(canvas.height,Math.ceil(line.y+line.height));y++)for(let x=Math.max(0,Math.floor(line.x));x<Math.min(canvas.width,Math.ceil(line.x+line.width));x++){
        const offset=(y*canvas.width+x)*4,background=[data[offset],data[offset+1],data[offset+2]];
        const foreground=background.map((v,i)=>color[i]*alpha+v*(1-alpha));
        const a=luminance(background),b=luminance(foreground);
        minimum=Math.min(minimum,(Math.max(a,b)+.05)/(Math.min(a,b)+.05));
      }
      result[line.name]=Math.min(result[line.name]??Infinity,minimum);
    }
    return {minimum:Math.min(...Object.values(result)),byText:result};
  },{lines,encoded:pixels.toString('base64')});
}
