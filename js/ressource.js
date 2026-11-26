/* Ajuste la hauteur du contenu intégré à sa taille réelle */
document.querySelectorAll('.r-frame iframe').forEach(f=>{const fit=()=>{try{const d=f.contentDocument;f.style.height=Math.max(d.documentElement.scrollHeight,d.body.scrollHeight)+'px'}catch(e){}};
 f.addEventListener('load',()=>{fit();try{new ResizeObserver(fit).observe(f.contentDocument.body)}catch(e){}});});
