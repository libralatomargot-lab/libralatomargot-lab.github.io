/* Page IA : carte des notions, schéma de l'agent, onglets */

(function(){
const DATA=[{"id": "genai", "name": "IA générative", "short": "IA générative", "lvl": 1, "new": false}, {"id": "llm", "name": "LLM", "short": "LLM", "lvl": 1, "new": false}, {"id": "token", "name": "Token", "short": "Token", "lvl": 1, "new": false}, {"id": "fenetre", "name": "Fenêtre de contexte", "short": "Fenêtre", "lvl": 1, "new": false}, {"id": "prompt", "name": "Prompt", "short": "Prompt", "lvl": 1, "new": false}, {"id": "skill", "name": "Skill", "short": "Skill", "lvl": 1, "new": false}, {"id": "mcp", "name": "MCP", "short": "MCP", "lvl": 1, "new": false}, {"id": "rag", "name": "RAG", "short": "RAG", "lvl": 1, "new": false}, {"id": "halluc", "name": "Hallucination", "short": "Hallucination", "lvl": 1, "new": false}, {"id": "agent", "name": "Agent", "short": "Agent", "lvl": 2, "new": false}, {"id": "context", "name": "Context engineering", "short": "Context eng.", "lvl": 2, "new": true}, {"id": "chaine", "name": "Chaîne agentique", "short": "Chaîne", "lvl": 2, "new": true}, {"id": "orch", "name": "Orchestration d'agents", "short": "Orchestration", "lvl": 2, "new": true}, {"id": "tokeco", "name": "Token economy", "short": "Token economy", "lvl": 2, "new": true}, {"id": "harness", "name": "Harness engineering", "short": "Harness eng.", "lvl": 3, "new": true}, {"id": "loop", "name": "Loop engineering", "short": "Loop eng.", "lvl": 3, "new": true}, {"id": "evals", "name": "Évaluations", "short": "Évaluations", "lvl": 3, "new": false}, {"id": "iaact", "name": "IA Act by design", "short": "IA Act", "lvl": 3, "new": false}],EDGES=[["llm", "genai"], ["llm", "token"], ["token", "fenetre"], ["fenetre", "context"], ["prompt", "context"], ["skill", "context"], ["mcp", "agent"], ["rag", "context"], ["halluc", "rag"], ["halluc", "evals"], ["llm", "agent"], ["skill", "agent"], ["agent", "chaine"], ["agent", "orch"], ["chaine", "orch"], ["orch", "tokeco"], ["token", "tokeco"], ["context", "tokeco"], ["agent", "harness"], ["harness", "loop"], ["loop", "evals"], ["chaine", "harness"], ["harness", "iaact"], ["evals", "iaact"], ["loop", "chaine"]],NS='http://www.w3.org/2000/svg',COL={1:'203,213,225',2:'6,182,212',3:'167,139,250'};
const BYID={};DATA.forEach(d=>BYID[d.id]=d);const LV=[null,'Les bases','Les agents','La production'];
function el(t,a,p){const x=document.createElementNS(NS,t);for(const k in a)x.setAttribute(k,a[k]);if(p)p.appendChild(x);return x}
const POS_W={genai:[130,165],llm:[275,165],token:[420,165],fenetre:[130,320],prompt:[275,320],skill:[420,320],mcp:[130,475],rag:[275,475],halluc:[420,475],
  agent:[680,160],context:[580,290],chaine:[790,290],orch:[610,450],tokeco:[770,470],harness:[960,200],loop:[1100,300],evals:[960,420],iaact:[1100,500]};
const COLS_W=[[40,510],[525,860],[875,1170]];
function layout(m){const pos={};let W,H,cols;
  if(!m){W=1200;H=570;Object.assign(pos,POS_W);cols=COLS_W.map(([a,b])=>({x:14+a-14,y:20,w:b-a,h:H-40}));}
  else{W=360;const Y=[[120,360],[500,690],[830,980]];H=1040;
    [1,2,3].forEach(l=>{const L=DATA.filter(d=>d.lvl===l),rows=Math.ceil(L.length/3);L.forEach((d,i)=>{const r=Math.floor(i/3),c=i%3,cc=r===rows-1?L.length-r*3:3;pos[d.id]=[W/(cc+1)*(c+1),Y[l-1][0]+(rows===1?0:(Y[l-1][1]-Y[l-1][0])*r/(rows-1))]})});
    cols=[[40,410],[430,750],[770,1020]].map(([a,b])=>({x:12,y:a,w:W-24,h:b-a}));}
  return{W,H,pos,cols,m}}
function edge(a,b){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],k=.16;return`M${a[0]} ${a[1]} Q${mx-dy*k} ${my+dx*k} ${b[0]} ${b[1]}`}
function init(root){
  const mode=root.dataset.mode,svg=root.querySelector('.map'),box=root.querySelector('.mapbox'),fis=root.querySelector('.fis'),fl=[...root.querySelectorAll('.fl')],mq=matchMedia('(max-width:760px)');
  const pop=root.querySelector('.pop');let cur=mode==='below'?'agent':null,f='all',nds=[],eds=[],L;
  function draw(){svg.innerHTML='';L=layout(mq.matches);svg.setAttribute('viewBox',`0 0 ${L.W} ${L.H}`);
    const dg=el('g',{},svg);L.cols.forEach((c,i)=>{el('rect',{x:c.x,y:c.y,width:c.w,height:c.h,rx:18,class:'col','data-l':i+1},dg);el('text',{x:c.x+c.w/2,y:c.y+(L.m?30:40),'text-anchor':'middle',class:'bt','data-l':i+1},dg).textContent=`NIVEAU ${i+1} · ${LV[i+1].toUpperCase()}`});
    const ge=el('g',{},svg),gn=el('g',{},svg);
    eds=EDGES.map(([a,b])=>{const p=el('path',{d:edge(L.pos[a],L.pos[b]),class:'ed'},ge);p.dataset.a=a;p.dataset.b=b;return p});
    nds=DATA.map(d=>{const c=COL[d.lvl],g=el('g',{class:`nd lv${d.lvl}${d.new?' nw':''}`,transform:`translate(${L.pos[d.id][0]} ${L.pos[d.id][1]})`,tabindex:0,role:'button','aria-label':`${d.name}, niveau ${d.lvl}${d.new?', nouveau':''}`},gn);g.dataset.id=d.id;
      const gr=el('radialGradient',{id:`g${mode}${d.id}`},g);el('stop',{offset:0,'stop-color':`rgb(${c})`,'stop-opacity':.55},gr);el('stop',{offset:1,'stop-color':`rgb(${c})`,'stop-opacity':0},gr);
      el('circle',{r:L.m?22:32,fill:`url(#g${mode}${d.id})`,class:'glow'},g);el('circle',{r:d.id==='agent'?(L.m?9:12):(L.m?6.5:9),fill:`rgb(${c})`,class:'core'},g);
      if(d.new)el('circle',{r:L.m?11:16,class:'ring-new'},g);
      const t=el('text',{y:L.m?30:44,'text-anchor':'middle',class:'lb'},g);t.textContent=L.m?d.short:d.name;if(L.m)t.style.fontSize='12.5px';
      el('circle',{r:L.m?24:34,class:'hit'},g);
      g.addEventListener('click',ev=>{ev.stopPropagation();pick(d.id,true)});g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();pick(d.id,true)}});return g});
    requestAnimationFrame(()=>nds.forEach(g=>{const t=g.querySelector('.lb'),b=t.getBBox();const r=el('rect',{x:b.x-10,y:b.y-5,width:b.width+20,height:b.height+10,rx:(b.height+10)/2,class:'pill'});g.insertBefore(r,t)}));
    apply();}
  const keep=d=>f==='all'||(f==='new'?d.new:f.split('-').includes(String(d.lvl)));
  function apply(){svg.classList.toggle('sel',!!cur);const near=new Set();
    eds.forEach(p=>{const on=p.dataset.a===cur||p.dataset.b===cur;p.classList.toggle('on',on);p.classList.toggle('off',!(keep(BYID[p.dataset.a])&&keep(BYID[p.dataset.b])));if(on){near.add(p.dataset.a);near.add(p.dataset.b)}});
    nds.forEach(g=>{const d=BYID[g.dataset.id],on=d.id===cur;g.classList.toggle('on',on);g.classList.toggle('near',!on&&near.has(d.id));g.classList.toggle('off',!keep(d));g.setAttribute('aria-pressed',String(on))});
    svg.querySelectorAll('[data-l]').forEach(x=>x.classList.toggle('hl',f===x.dataset.l));
    fl.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.f===f||(f!=='all'&&f!=='new'&&f.split('-').includes(b.dataset.f)))));
    root.querySelectorAll('.fi').forEach(p=>p.hidden=p.dataset.id!==cur);}
  function showFiche(scroll){fis.hidden=false;apply();if(scroll){const r=fis.getBoundingClientRect();if(r.top>innerHeight*.7||r.top<0)fis.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}}
  function openPop(id){const tpl=root.querySelector(`template[data-pop="${id}"]`);pop.querySelector('.pop-in').innerHTML=tpl.innerHTML;pop.querySelector('h3').id='pop-h';pop.hidden=false;
    if(!mq.matches){const s=svg.getBoundingClientRect(),bx=box.getBoundingClientRect(),k=s.width/L.W,[x,y]=L.pos[id];let px=x*k+28,py=y*k-40;const w=pop.offsetWidth,h=pop.offsetHeight;
      if(px+w>bx.width-12)px=x*k-w-28;if(px<12)px=12;if(py+h>bx.height-12)py=bx.height-h-12;if(py<12)py=12;pop.style.left=px+'px';pop.style.top=py+'px';}
    pop.querySelector('.pop-more').focus({preventScroll:true});}
  function closePop(){if(!pop||pop.hidden)return;pop.hidden=true;const g=nds.find(x=>x.dataset.id===cur);if(g)g.focus({preventScroll:true})}
  function pick(id,user){const d=BYID[id];if(!keep(d))f=String(d.lvl);cur=id;apply();
    if(mode==='below'){if(user)showFiche(true)}else{openPop(id);if(!fis.hidden)apply()}}
  fl.forEach(b=>b.addEventListener('click',()=>{f=b.dataset.f;if(cur&&!keep(BYID[cur])){if(mode==='below')cur=DATA.find(keep).id;else{cur=null;closePop()}}apply()}));
  {const m=location.hash.match(/^#niveau-([1-3](?:-[1-3])*)$/);if(m&&mode!=='below'){f=m[1];setTimeout(()=>{const c=document.getElementById('carte');if(c)c.scrollIntoView()},80)}}
  root.querySelectorAll('.rel').forEach(b=>b.addEventListener('click',()=>{pick(b.dataset.go);if(mode==='popover'){closePop();showFiche(false)}}));
  if(pop){pop.querySelector('.pop-x').addEventListener('click',closePop);pop.querySelector('.pop-more').addEventListener('click',()=>{closePop();showFiche(true)});
    document.addEventListener('keydown',ev=>{if(ev.key==='Escape')closePop()});box.addEventListener('click',ev=>{if(!pop.contains(ev.target))closePop()});}
  mq.addEventListener('change',()=>{closePop();draw()});draw();
  root._pick=id=>{pick(id,false);if(mode==='below')showFiche(false)};
}
document.querySelectorAll('.cmap').forEach(init);
window.mapSel=id=>{const r=document.querySelector('.cmap');if(r&&r._pick)r._pick(id)};
})();
(function(){
  const svg=document.querySelector('.anat'),parts=[...svg.querySelectorAll('.part')];
  const MAP={model:'llm',context:'context',harness:'harness',loop:'loop',budget:'tokeco'};
  const lit=g=>{svg.classList.toggle('sel',!!g);parts.forEach(x=>x.classList.toggle('on',x===g))};
  parts.forEach(g=>{g.addEventListener('mouseenter',()=>lit(g));
    g.addEventListener('click',()=>{window.mapSel(MAP[g.dataset.p]);document.getElementById('carte').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});});
  svg.addEventListener('mouseleave',()=>lit(null));
  const tabs=[...document.querySelectorAll('[role=tab]')];
  function act(t){tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on});}
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>act(t));t.addEventListener('keydown',ev=>{if(ev.key==='ArrowRight'||ev.key==='ArrowLeft'){const n=tabs[(i+(ev.key==='ArrowRight'?1:tabs.length-1))%tabs.length];act(n);n.focus()}})});
})();

/* Méthodologie : cycle */
(function(){const ns=[...document.querySelectorAll('.cn')],ds=[...document.querySelectorAll('.dt')];let i=0;
function go(n){i=(n+6)%6;ns.forEach((g,k)=>{g.classList.toggle('on',k===i);g.setAttribute('aria-pressed',String(k===i))});ds.forEach((d,k)=>d.hidden=k!==i)}
ns.forEach((g,k)=>{g.addEventListener('click',()=>go(k));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go(k)}})});
document.querySelector('.prev').addEventListener('click',()=>go(i-1));document.querySelector('.next').addEventListener('click',()=>go(i+1));go(0)})();

/* Cadre : auto-diagnostic */
(function(){const cs=[...document.querySelectorAll('.dg')],v={},fg=document.querySelector('.g-fg'),sc=document.getElementById('sc'),m=document.getElementById('scm'),a=document.getElementById('sca');
function upd(){const n=Object.keys(v).length,pts=Object.values(v).reduce((s,x)=>s+x,0),ok=Object.values(v).filter(x=>x===2).length;
 sc.textContent=ok;a.textContent=n;fg.setAttribute('stroke-dasharray',(pts/20*100)+' 100');fg.style.opacity=pts?1:0;
 m.textContent=n<10?'Répondez aux questions pour situer votre équipe.':pts>=17?'Belle maturité : il reste à le tenir dans la durée.':pts>=10?'Les bases sont là. Quelques chantiers à prioriser.':'Il y a du travail, et c’est le bon moment pour s’y mettre.'}
cs.forEach((c,k)=>c.querySelectorAll('.dg-c button').forEach(b=>b.addEventListener('click',()=>{v[k]=+b.dataset.v;c.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));c.className='dg v'+b.dataset.v;upd()})));
document.querySelector('.reset').addEventListener('click',()=>{for(const k in v)delete v[k];cs.forEach(c=>{c.className='dg';c.querySelectorAll('button').forEach(x=>x.removeAttribute('aria-pressed'))});upd()});upd()})();
