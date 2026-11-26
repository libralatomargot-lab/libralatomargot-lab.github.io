/* Section Conduire le changement : bascule SAFe / avec l'IA */
(function(){const sv=document.querySelector('.train'),bs=[...document.querySelectorAll('.sw button')];
bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));sv.classList.toggle('b',b.dataset.v==='b')}));})();

(function(){function op(){const d=location.hash&&document.getElementById(location.hash.slice(1));if(d&&d.tagName==='DETAILS'){d.open=true;d.scrollIntoView()}}op();addEventListener('hashchange',op)})();
