/* Page Contact : copie de l'adresse mail */
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{
  const t=b.dataset.copy,lab=b.textContent;
  try{await navigator.clipboard.writeText(t);b.textContent='Adresse copiée';}
  catch(e){const r=document.createRange();r.selectNodeContents(document.getElementById(b.getAttribute('aria-controls')));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Adresse sélectionnée';}
  setTimeout(()=>b.textContent=lab,2200);}));
