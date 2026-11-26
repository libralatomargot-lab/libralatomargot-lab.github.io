/* Comportements communs à toutes les pages */
(function(){
  // Menu mobile
  const btn=document.querySelector('.menu-btn'),nav=document.getElementById('nav');
  if(btn&&nav){
    const set=o=>{nav.classList.toggle('open',o);btn.setAttribute('aria-expanded',String(o));btn.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu');};
    btn.addEventListener('click',()=>set(!nav.classList.contains('open')));
    nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){set(false);btn.focus()}});
    matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)set(false)});
  }
  // Projecteur qui suit la souris sur les cartes
  document.querySelectorAll('.spot,.card,.tr,.ex').forEach(el=>el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px');}));
  // Année du pied de page
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
})();
