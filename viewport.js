/* Keep navigation in the visible viewport without disabling pinch zoom. */
'use strict';
(() => {
 const bar=document.querySelector('.bottom-nav'),vv=window.visualViewport;
 let frame=0,locked=false,savedY=0,savedX=0,fullHeight=window.innerHeight;
 function update(){
  frame=0;
  const scale=vv?.scale||1,width=vv?.width||innerWidth,height=vv?.height||innerHeight;
  const input=document.activeElement?.matches('input:not([type=checkbox]),textarea,select');
  if(!input)fullHeight=Math.max(height*scale,innerHeight);
  bar.classList.toggle('keyboard-hidden',!!input&&height*scale<fullHeight*.75);
  if(scale>1.01){
   const pixels=Math.min(580,width*scale),gap=innerWidth>700?16:0;
   bar.style.width=pixels+'px';bar.style.bottom='auto';bar.style.transformOrigin='top left';
   bar.style.left=((vv?.offsetLeft||0)+(width-pixels/scale)/2)+'px';
   bar.style.top=((vv?.offsetTop||0)+height-(bar.offsetHeight+gap)/scale)+'px';
   bar.style.transform=`scale(${1/scale})`;
  }else{bar.removeAttribute('style')}
  document.documentElement.style.setProperty('--nav-space',(bar.offsetHeight+45)+'px');
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update)}
 function modalChanged(){
  const open=!!document.querySelector('dialog[open]');
  if(open&&!locked){savedY=scrollY;savedX=scrollX;locked=true;document.body.style.top=-savedY+'px';document.body.classList.add('modal-locked')}
  else if(!open&&locked){locked=false;document.body.classList.remove('modal-locked');document.body.style.top='';window.scrollTo(savedX,savedY)}
  schedule();
 }
 for(const d of document.querySelectorAll('dialog')){new MutationObserver(modalChanged).observe(d,{attributes:true,attributeFilter:['open']});d.addEventListener('close',modalChanged)}
 for(const type of ['resize','scroll','scrollend']){vv?.addEventListener(type,schedule,{passive:true});window.addEventListener(type,schedule,{passive:true})}
 document.addEventListener('focusin',schedule);document.addEventListener('focusout',schedule);
 new ResizeObserver(schedule).observe(bar);schedule();
})();
