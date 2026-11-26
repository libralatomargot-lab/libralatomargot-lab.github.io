/* Page d'accueil : réseau neuronal du hero et texte dynamique */
/* ===== Réseau neuronal du hero : 3 profondeurs, influx qui se propagent, curseur = stimulus ===== */
(function(){
  const cv=document.getElementById('net'),hero=cv.parentElement,x=cv.getContext('2d');
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COL=['124,58,237','6,182,212','236,72,153'];          // violet, cyan, magenta (rare)
  let W=0,H=0,dpr=1,N=[],P=[],mouse={x:-1e4,y:-1e4,on:false},px=0,py=0,run=true,t0=performance.now(),lastAuto=0;
  const LINK=[0,115,155,195];                                   // distance de liaison par profondeur
  function pick(){const r=Math.random();return r<.5?0:r<.92?1:2}
  function init(){
    const r=hero.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;
    cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    const dens=W<700?6000:3600,n=Math.min(300,Math.round(W*H/dens));N=[];P=[];
    for(let i=0;i<n;i++){const z=i%7===0?3:i%3===0?2:1;            // 1 loin · 2 milieu · 3 proche
      N.push({x:Math.random()*W,y:Math.random()*H,z,vx:(Math.random()-.5)*.18*z,vy:(Math.random()-.5)*.18*z,
        r:z===3?2.6+Math.random()*1.6:z===2?1.6+Math.random():0.8+Math.random()*.6,c:pick(),f:0,ref:0,ph:Math.random()*6.28});}
  }
  function nb(a){const out=[];for(const b of N){if(b===a||b.z!==a.z)continue;const d=Math.hypot(a.x-b.x,a.y-b.y);if(d<LINK[a.z])out.push(b)}return out}
  function fire(a,depth){if(a.ref>0)return;a.f=1;a.ref=60;if(depth>5)return;
    const ns=nb(a);ns.sort(()=>Math.random()-.5);ns.slice(0,depth<1?4:2).forEach(b=>P.push({a,b,t:0,s:.018+Math.random()*.02,d:depth+1,c:a.c===2?2:(Math.random()<.5?0:1)}));}
  function frame(now){
    const dt=Math.min(2,(now-t0)/16.7);t0=now;
    x.clearRect(0,0,W,H);
    // halo nébuleux lent
    const g1=x.createRadialGradient(W*.78+Math.sin(now/7000)*60,H*.3,0,W*.78,H*.3,W*.5);g1.addColorStop(0,'rgba(124,58,237,.20)');g1.addColorStop(1,'rgba(124,58,237,0)');x.fillStyle=g1;x.fillRect(0,0,W,H);
    const g2=x.createRadialGradient(W*.15,H*.85+Math.cos(now/9000)*40,0,W*.15,H*.85,W*.45);g2.addColorStop(0,'rgba(6,182,212,.12)');g2.addColorStop(1,'rgba(6,182,212,0)');x.fillStyle=g2;x.fillRect(0,0,W,H);
    // parallaxe souris
    const tx=mouse.on?(mouse.x/W-.5):0,ty=mouse.on?(mouse.y/H-.5):0;px+=(tx-px)*.05;py+=(ty-py)*.05;
    for(const a of N){a.x+=a.vx*dt;a.y+=a.vy*dt;if(a.x<-20)a.x=W+20;if(a.x>W+20)a.x=-20;if(a.y<-20)a.y=H+20;if(a.y>H+20)a.y=-20;
      a.sx=a.x-px*a.z*14;a.sy=a.y-py*a.z*14;if(a.f>0)a.f=Math.max(0,a.f-.025*dt);if(a.ref>0)a.ref-=dt;}
    // liaisons (synapses) par profondeur
    x.lineCap='round';
    for(let z=1;z<=3;z++){const L=LINK[z];x.lineWidth=z===3?.9:z===2?.6:.4;
      for(let i=0;i<N.length;i++){const a=N[i];if(a.z!==z)continue;
        for(let j=i+1;j<N.length;j++){const b=N[j];if(b.z!==z)continue;const d=Math.hypot(a.sx-b.sx,a.sy-b.sy);if(d>L)continue;
          const k=(1-d/L),act=Math.max(a.f,b.f);x.strokeStyle=`rgba(${act>.05?'103,232,249':'148,163,184'},${(z*.13+act*.55)*k})`;
          x.beginPath();x.moveTo(a.sx,a.sy);x.lineTo(b.sx,b.sy);x.stroke();}}}
    // le curseur agit comme une électrode
    if(mouse.on){for(const a of N){if(a.z!==3&&a.z!==2)continue;const d=Math.hypot(a.sx-mouse.x,a.sy-mouse.y);if(d<170){const k=1-d/170;
        x.strokeStyle=`rgba(196,181,253,${.55*k})`;x.lineWidth=.8;x.beginPath();x.moveTo(mouse.x,mouse.y);x.lineTo(a.sx,a.sy);x.stroke();
        if(d<60&&Math.random()<.02*dt)fire(a,0);}}
      const gm=x.createRadialGradient(mouse.x,mouse.y,0,mouse.x,mouse.y,120);gm.addColorStop(0,'rgba(103,232,249,.16)');gm.addColorStop(1,'rgba(103,232,249,0)');x.fillStyle=gm;x.beginPath();x.arc(mouse.x,mouse.y,120,0,6.29);x.fill();}
    // influx (potentiels d'action) le long des axones
    for(let i=P.length-1;i>=0;i--){const p=P[i];p.t+=p.s*dt;
      if(p.t>=1){P.splice(i,1);fire(p.b,p.d);continue;}
      const X=p.a.sx+(p.b.sx-p.a.sx)*p.t,Y=p.a.sy+(p.b.sy-p.a.sy)*p.t,c=COL[p.c];
      const tl=Math.max(0,p.t-.18),TX=p.a.sx+(p.b.sx-p.a.sx)*tl,TY=p.a.sy+(p.b.sy-p.a.sy)*tl;
      const gr=x.createLinearGradient(TX,TY,X,Y);gr.addColorStop(0,`rgba(${c},0)`);gr.addColorStop(1,`rgba(${c},.95)`);
      x.strokeStyle=gr;x.lineWidth=2;x.beginPath();x.moveTo(TX,TY);x.lineTo(X,Y);x.stroke();
      x.fillStyle='#fff';x.shadowColor=`rgb(${c})`;x.shadowBlur=12;x.beginPath();x.arc(X,Y,2,0,6.29);x.fill();x.shadowBlur=0;}
    // neurones (soma) avec halo pulsant
    for(const a of N){const c=COL[a.c],pulse=.5+.5*Math.sin(now/900+a.ph);
      if(a.z===3||a.f>0){const R=a.r*(4+a.f*6+pulse*1.5);const h=x.createRadialGradient(a.sx,a.sy,0,a.sx,a.sy,R);
        h.addColorStop(0,`rgba(${c},${.35+a.f*.5})`);h.addColorStop(1,`rgba(${c},0)`);x.fillStyle=h;x.beginPath();x.arc(a.sx,a.sy,R,0,6.29);x.fill();}
      x.fillStyle=a.f>.1?'#fff':`rgba(${c},${a.z===1?.55:a.z===2?.8:1})`;x.beginPath();x.arc(a.sx,a.sy,a.r*(1+a.f*.6),0,6.29);x.fill();}
    // activité spontanée
    if(now-lastAuto>650){lastAuto=now;const cand=N.filter(n=>n.z>=2);fire(cand[Math.floor(Math.random()*cand.length)],0);}
    if(run&&!still)requestAnimationFrame(frame);
  }
  function loc(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  hero.addEventListener('pointermove',e=>{const p=loc(e);mouse.x=p.x;mouse.y=p.y;mouse.on=true;});
  hero.addEventListener('pointerleave',()=>{mouse.on=false;mouse.x=mouse.y=-1e4;});
  hero.addEventListener('pointerdown',e=>{if(e.target.closest('a'))return;const p=loc(e);
    N.filter(n=>n.z>=2).map(n=>[n,Math.hypot(n.sx-p.x,n.sy-p.y)]).sort((a,b)=>a[1]-b[1]).slice(0,4).forEach(([n])=>{n.ref=0;fire(n,0)});
    if(still)frame(performance.now());});
  let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{init();if(still)frame(performance.now())},150)});
  new IntersectionObserver(es=>{const v=es[0].isIntersecting;if(v&&!run){run=true;t0=performance.now();if(!still)requestAnimationFrame(frame)}run=v}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)run=false;else{run=true;t0=performance.now();if(!still)requestAnimationFrame(frame)}});
  init();for(let i=0;i<3;i++)fire(N[Math.floor(Math.random()*N.length)],0);frame(performance.now());
})();

/* ===== Texte dynamique du hero ===== */
(function(){
  const el=document.getElementById('typed');if(!el)return;
  const PH=['Docteure en neurosciences','Ingénieure IA agentique','Ingénieure qualité logicielle','Accompagnatrice IA générative','Formation et coaching en IA','Agilité et innovation','Formatrice en intelligence collective'];
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let i=0,c=PH[0].length,del=true;
  function tick(){const w=PH[i];
    if(del){c--;el.textContent=w.slice(0,c);if(c<=0){del=false;i=(i+1)%PH.length;return setTimeout(tick,380)}return setTimeout(tick,32)}
    c++;el.textContent=PH[i].slice(0,c);if(c>=PH[i].length){del=true;return setTimeout(tick,2100)}setTimeout(tick,65)}
  setTimeout(tick,2200);
})();
