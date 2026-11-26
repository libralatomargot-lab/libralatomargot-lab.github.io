/* Page CV : carte compétences ↔ expériences, expériences dépliables, sommaire */
const MAP={"ai": ["llm", "agentique", "agents", "orch", "rag", "python", "autotest", "a11y", "qualite", "ba", "scrum", "agilite", "mentorat", "changement"], "lm": ["llm", "agentique", "agents", "ba", "biais", "neurocog", "changement", "formation", "agilite"], "ba": ["llm", "perf", "autotest", "ba", "qualite"], "netri": ["datasci", "matlab", "modelisation", "electro", "signal", "neurocomp"], "phd": ["ml", "datasci", "matlab", "modelisation", "electro", "signal", "neurocomp", "recherche", "mentorat"], "master": ["python", "matlab", "datasci", "modelisation", "electro", "neurocomp", "recherche"]};const N={"llm": "LLM", "agentique": "IA agentique", "agents": "Agents customs", "orch": "Orchestration d'agents", "rag": "RAG", "python": "Python", "ml": "IA prédictive / ML", "datasci": "Data science", "matlab": "Matlab", "autotest": "Automatisation de tests", "perf": "Tests de performance", "a11y": "Tests d'accessibilité", "qualite": "Qualité logicielle", "ba": "Business analysis", "biais": "Biais cognitifs", "changement": "Conduite du changement", "formation": "Formation", "mentorat": "Mentorat", "scrum": "Scrum", "agilite": "Agilité", "neurocomp": "Neurosciences computationnelles", "neurocog": "Neurosciences cognitives", "signal": "Traitement du signal", "modelisation": "Modélisation", "electro": "Électrophysiologie", "recherche": "Recherche en laboratoire"};const T={"ai": "AI & QE Lead · Sogeti", "lm": "Conseil neuro-agilité", "ba": "BA & tests de perf. · Sogeti", "netri": "Post-doc R&D · NETRI", "phd": "Doctorat · Inserm", "master": "Master · Inserm"};
const its=[...document.querySelectorAll('.it')],SK=[...document.querySelectorAll('.s')];
const kmap=document.getElementById('kmap'),lg=document.getElementById('lg'),hint=document.getElementById('hint'),clr=document.getElementById('clear');
let sel=null,hov=null,mf=null;const NS='http://www.w3.org/2000/svg';
function line(a,c,r){const x1=a.right-r.left,y1=a.top+a.height/2-r.top,x2=c.left-r.left,y2=c.top+28-r.top,cx=x1+(x2-x1)*.5;
  const p=document.createElementNS(NS,'path');p.setAttribute('d',`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`);p.setAttribute('fill','none');p.setAttribute('stroke','url(#g)');p.setAttribute('stroke-width','1.5');p.setAttribute('opacity','.85');lg.appendChild(p);
  [[x1,y1,'#C4B5FD'],[x2,y2,'#67E8F9']].forEach(([x,y,col])=>{const d=document.createElementNS(NS,'circle');d.setAttribute('cx',x);d.setAttribute('cy',y);d.setAttribute('r','3');d.setAttribute('fill',col);lg.appendChild(d);});}
function draw(){lg.innerHTML='';const k=sel||hov;if(innerWidth<=980)return;const r=kmap.getBoundingClientRect();
 if(!k&&mf){const c=document.getElementById('xp-'+mf).querySelector('.card').getBoundingClientRect();MAP[mf].forEach(sk=>line(document.getElementById('s-'+sk).getBoundingClientRect(),c,r));return;}
 if(!k)return;const s=document.getElementById('s-'+k).getBoundingClientRect();its.forEach(it=>{if(MAP[it.id.slice(3)].includes(k))line(s,it.querySelector('.card').getBoundingClientRect(),r);});}
function paint(){const k=sel||hov;
 if(!k&&mf){const ks=MAP[mf];SK.forEach(b=>{b.classList.remove('sel');b.classList.toggle('lit',ks.includes(b.dataset.k));b.classList.toggle('dim',!ks.includes(b.dataset.k));b.setAttribute('aria-pressed','false');});
  its.forEach(it=>{it.classList.toggle('lit',it.id==='xp-'+mf);it.classList.remove('dim');});
  hint.textContent=T[mf]+' : '+ks.map(x=>N[x]).join(', ')+'.';clr.hidden=false;draw();return;}const hits=k?its.filter(it=>MAP[it.id.slice(3)].includes(k)):[];
 SK.forEach(b=>{b.classList.toggle('sel',b.dataset.k===sel);b.classList.toggle('lit',!!hov&&b.dataset.k===hov&&hov!==sel);b.classList.toggle('dim',!!k&&b.dataset.k!==k);b.setAttribute('aria-pressed',String(b.dataset.k===sel));});
 its.forEach(it=>{const on=hits.includes(it);it.classList.toggle('lit',!!k&&on);it.classList.toggle('dim',!!k&&!on);
  });
 hint.textContent=k?N[k]+' : '+hits.map(it=>T[it.id.slice(3)]).join(', ')+'.':'Aucune compétence sélectionnée.';clr.hidden=!sel;draw();}
SK.forEach(b=>{b.addEventListener('mouseenter',()=>{hov=b.dataset.k;paint()});b.addEventListener('mouseleave',()=>{hov=null;paint()});
 b.addEventListener('click',()=>{sel=sel===b.dataset.k?null:b.dataset.k;hov=null;mf=null;paint();});});
clr.addEventListener('click',()=>{sel=null;mf=null;paint()});
function toggle(it,open){const h=it.querySelector('.head');open=open??!it.classList.contains('open');it.classList.toggle('open',open);h.setAttribute('aria-expanded',String(open));}
its.forEach(it=>{const id=it.id.slice(3),h=it.querySelector('.head');
 h.addEventListener('click',()=>{toggle(it);delete it._prev;if(it.classList.contains('open')){sel=null;mf=id;}else if(mf===id){mf=null;}paint();});
 h.addEventListener('mouseenter',()=>{if(!sel&&!hov){it._prev=mf;mf=id;paint();}});
 h.addEventListener('mouseleave',()=>{if('_prev' in it){mf=it._prev;delete it._prev;paint();}});it.querySelector('.det').addEventListener('transitionend',draw);});
document.getElementById('all-open').addEventListener('click',()=>its.forEach(it=>toggle(it,true)));
document.getElementById('all-close').addEventListener('click',()=>its.forEach(it=>toggle(it,false)));
let raf;const re=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(draw)};addEventListener('scroll',re,{passive:true});addEventListener('resize',re);new ResizeObserver(re).observe(kmap);
document.querySelectorAll('[data-open]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const it=document.getElementById('xp-'+a.dataset.open);
 toggle(it,true);it.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});it.querySelector('.head').focus({preventScroll:true});}));
document.querySelectorAll('a[href^="#"]:not([data-open])').forEach(a=>{const id=a.getAttribute('href').slice(1);if(!id)return;a.addEventListener('click',e=>{const t=document.getElementById(id);if(!t)return;e.preventDefault();t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});});
const links=[...document.querySelectorAll('.toc a')],secs=links.map(a=>document.getElementById(a.getAttribute('href').slice(1)));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('act',l.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-40% 0px -55% 0px'});
secs.forEach(s=>io.observe(s));
