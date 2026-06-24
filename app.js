(function(){
  'use strict';

  /* LOADER */
  window.addEventListener('load', function(){
    setTimeout(function(){ var l=document.getElementById('page-loader'); if(l) l.classList.add('loaded'); }, 1300);
  });

  /* TYPEWRITER — hero „wypisuje się" */
  (function(){
    var h1 = document.getElementById('ihType');
    if(!h1) return;
    var lineEls = [].slice.call(h1.querySelectorAll('.t-line'));
    if(!lineEls.length) return;
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    var seq = [];
    lineEls.forEach(function(le, li){
      [].slice.call(le.childNodes).forEach(function(n){
        var em = n.nodeType === 1 && n.tagName === 'EM';
        var txt = n.textContent || '';
        Array.prototype.forEach.call(txt, function(ch){ seq.push({ li: li, ch: ch, em: em }); });
      });
      le.textContent = '';
    });
    var caret = document.createElement('span'); caret.className = 'ih-caret';
    var i = 0;
    function step(){
      if(i >= seq.length){ setTimeout(function(){ if(caret.parentNode) caret.parentNode.removeChild(caret); }, 2600); return; }
      var s = seq[i++], el = lineEls[s.li];
      if(s.em){
        var last = el.lastChild;
        if(last && last.nodeType === 1 && last.tagName === 'EM'){ last.textContent += s.ch; }
        else { var em = document.createElement('em'); em.textContent = s.ch; el.appendChild(em); }
      } else {
        el.appendChild(document.createTextNode(s.ch));
      }
      el.appendChild(caret);
      setTimeout(step, s.ch === ' ' ? 45 : (55 + Math.random()*45));
    }
    lineEls[0].appendChild(caret);
    setTimeout(step, 1500);
  })();

  /* FLOATING DECO — fade in after load */
  window.addEventListener('load', function(){
    setTimeout(function(){
      document.querySelectorAll('.fdl-el').forEach(function(el,i){
        setTimeout(function(){ el.classList.add('visible'); }, i*200);
      });
    }, 1500);
  });

  /* LETTER-SWAP */
  document.querySelectorAll('[data-ls]').forEach(function(line){
    var text=line.textContent; line.textContent=''; line.setAttribute('aria-label',text);
    var ci=0;
    Array.from(text).forEach(function(ch){
      if(ch===' '||ch===' '){var sp=document.createElement('span');sp.className='ls-sp';sp.innerHTML='&nbsp;';line.appendChild(sp);return;}
      var c=document.createElement('span'); c.className='ls-char'; c.style.setProperty('--d',ci*22);
      var a=document.createElement('span'); a.className='ls-a'; a.textContent=ch;
      var b=document.createElement('span'); b.className='ls-b'; b.setAttribute('aria-hidden','true'); b.textContent=ch;
      c.appendChild(a); c.appendChild(b); line.appendChild(c); ci++;
    });
  });
  var lsBlock=document.getElementById('ls-block');
  if(lsBlock) new IntersectionObserver(function(e){ if(e[0].isIntersecting) setTimeout(function(){ lsBlock.classList.add('ls-in'); },150); },{threshold:0.25}).observe(lsBlock);

  /* BIG HEADLINE ANIMATION (GSAP ScrollTrigger) */
  window.addEventListener('load', function(){
    if(typeof gsap==='undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.headline-line-inner').forEach(function(el,i){
      gsap.fromTo(el, {yPercent:110}, {yPercent:0, duration:1.4, ease:'power4.out', delay:i*0.12, immediateRender:false, scrollTrigger:{trigger:el, start:'top 95%'}});
    });
    /* Hero entrance */
    var hl=document.querySelector('.hero-split-headline');
    if(hl){
      var words=hl.textContent.trim().split(/\s+/);
      hl.innerHTML=words.map(function(w){ return '<span class="hw" style="display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.15"><span class="hwi" style="display:inline-block">'+w+'</span></span>'; }).join(' ');
      hl.style.opacity='1';
    }
    var tl=gsap.timeline({defaults:{ease:'power3.out'}});
    tl.fromTo('.hero-bg-art',{opacity:0,scale:1.08},{opacity:1,scale:1,duration:1.6},0.1);
    tl.fromTo('.hero-split-label',{opacity:0,y:22},{opacity:1,y:0,duration:0.75},0.5);
    if(document.querySelector('.hwi')) tl.fromTo('.hwi',{yPercent:115,opacity:0},{yPercent:0,opacity:1,duration:0.95,stagger:0.055},0.65);
    tl.fromTo('.hero-lead',{opacity:0,y:14},{opacity:1,y:0,duration:0.7},1.15);
    tl.fromTo('.hero-actions',{opacity:0,y:14},{opacity:1,y:0,duration:0.65},1.25);
    tl.fromTo('.hero-trust-item',{opacity:0,y:16},{opacity:1,y:0,duration:0.55,stagger:0.1},1.35);
    tl.fromTo('.hero-marquee-wrap',{opacity:0,y:14},{opacity:1,y:0,duration:0.7},1.4);
    tl.fromTo('.hero-name-tag',{opacity:0,y:-14},{opacity:1,y:0,duration:0.6},0.3);
    /* Magnetic float CTA */
    var fc=document.getElementById('float-cta');
    if(fc && window.innerWidth>768){
      fc.addEventListener('mousemove',function(e){ var r=fc.getBoundingClientRect(); gsap.to(fc,{x:(e.clientX-(r.left+r.width/2))*0.35,y:(e.clientY-(r.top+r.height/2))*0.35,duration:0.4,ease:'power2.out',overwrite:true}); });
      fc.addEventListener('mouseleave',function(){ gsap.to(fc,{x:0,y:0,duration:0.9,ease:'elastic.out(1,0.45)',overwrite:true}); });
    }
    /* Cursor glow */
    if(window.innerWidth>768 && !window.matchMedia('(prefers-reduced-motion:reduce)').matches){
      var glow=document.createElement('div'); glow.className='cursor-glow'; document.body.appendChild(glow);
      document.addEventListener('mousemove',function(e){ gsap.to(glow,{left:e.clientX,top:e.clientY,duration:0.55,ease:'power2.out',overwrite:true}); });
    }
  });

  /* REVEAL */
  var SIDS=['home','about','path','projects','stories','blog','donate','contact'];
  SIDS.forEach(function(id){ var c=document.getElementById(id); if(!c) return; c.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-scale').forEach(function(el,i){ el.style.transitionDelay=(i*0.09)+'s'; }); });
  var revObs=new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); revObs.unobserve(e.target); } }); },{threshold:0.05});
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-scale').forEach(function(el){ revObs.observe(el); });

  /* RAF SCROLL */
  var _raf=false;
  var spEl=document.getElementById('scroll-progress');
  var fcEl=document.getElementById('float-cta');
  var nvEl=document.getElementById('pageNameVert');
  var heEl=document.getElementById('home');
  function onScroll(){
    if(_raf) return; _raf=true;
    requestAnimationFrame(function(){
      _raf=false;
      var sy=window.scrollY, tot=document.documentElement.scrollHeight-window.innerHeight;
      if(spEl) spEl.style.width=(sy/tot*100)+'%';
      var thr=(heEl?heEl.offsetHeight:window.innerHeight)*0.4;
      if(fcEl) fcEl.classList.toggle('visible',sy>thr);
      if(nvEl) nvEl.classList.toggle('visible',sy>thr);
      /* nav active */
      var ids=['home','about','path','projects','stories','blog','donate','contact'];
      var secs=ids.map(function(id){ return document.getElementById(id); }).filter(Boolean);
      var links=document.querySelectorAll('.nav-links a');
      var cur='home';
      secs.forEach(function(s){ if(sy>=s.offsetTop-90) cur=s.id; });
      if(sy+window.innerHeight>=document.documentElement.scrollHeight-60) cur='contact';
      links.forEach(function(a){ a.classList.toggle('active',a.getAttribute('href')==='#'+cur); });
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});

  /* MOBILE NAV */
  var nw=document.querySelector('.nav-links-wrap'), nt=document.getElementById('navToggle');
  if(nt&&nw){ nt.addEventListener('click',function(){ nw.classList.toggle('open'); }); document.querySelectorAll('.nav-links a').forEach(function(a){ a.addEventListener('click',function(){ nw.classList.remove('open'); }); }); }

  /* CAROUSEL */
  (function(){
    var track=document.getElementById('cTrack'), dots=document.querySelectorAll('.carousel-dot'), numEl=document.getElementById('cSlideNum');
    var total=track?track.children.length:0, cur=0, timer;
    function goTo(i){ cur=((i%total)+total)%total; track.style.transform='translateX(-'+(cur*100)+'%)'; dots.forEach(function(d,j){ d.classList.toggle('active',j===cur); }); if(numEl) numEl.textContent=cur+1; }
    function start(){ timer=setInterval(function(){ goTo(cur+1); },5500); }
    function stop(){ clearInterval(timer); }
    var prev=document.getElementById('cPrev'), next=document.getElementById('cNext');
    if(prev) prev.addEventListener('click',function(){ stop(); goTo(cur-1); start(); });
    if(next) next.addEventListener('click',function(){ stop(); goTo(cur+1); start(); });
    dots.forEach(function(d){ d.addEventListener('click',function(){ stop(); goTo(+d.dataset.idx); start(); }); });
    var vp=document.querySelector('.carousel-viewport'), sx=0;
    if(vp){ vp.addEventListener('touchstart',function(e){ sx=e.touches[0].clientX; },{passive:true}); vp.addEventListener('touchend',function(e){ var dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>40){ stop(); goTo(cur+(dx<0?1:-1)); start(); } },{passive:true}); vp.addEventListener('mouseenter',stop); vp.addEventListener('mouseleave',start); }
    if(total>0) start();
  })();

  /* COUNTERS */
  var cntObs=new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(!e.isIntersecting) return; cntObs.unobserve(e.target); var el=e.target, target=parseInt(el.dataset.target,10); if(isNaN(target)) return; var steps=60, inc=target/steps, step=0; var t=setInterval(function(){ step++; var v=Math.min(Math.round(inc*step),target); el.textContent=(v>=1000?v.toLocaleString('pl-PL'):v)+(target>=1000?'+':''); if(step>=steps) clearInterval(t); },1400/steps); }); },{threshold:0.5});
  document.querySelectorAll('[data-target]').forEach(function(el){ cntObs.observe(el); });

  /* FORM */
  var fb=document.querySelector('.btn-form');
  if(fb) fb.addEventListener('click',function(){ var n=document.getElementById('f-name').value.trim(), em=document.getElementById('f-email').value.trim(); if(!n||!em){ fb.textContent='Uzupełnij imię i e-mail'; fb.style.background='rgba(255,255,255,0.15)'; setTimeout(function(){ fb.textContent='Wyślij wiadomość'; fb.style.background=''; },2200); return; } fb.textContent='Wysłano! Odezwiemy się wkrótce'; fb.style.background='#3f7068'; fb.disabled=true; });

  /* RIPPLE */
  document.querySelectorAll('.ripple-host').forEach(function(el){
    el.addEventListener('click',function(e){
      var r=el.getBoundingClientRect(), d=Math.max(r.width,r.height)*2;
      var w=document.createElement('span'); w.className='ripple-wave';
      w.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';
      el.appendChild(w); setTimeout(function(){ w.remove(); },600);
    });
  });

  /* CARD TILT 3D */
  if(window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    document.querySelectorAll('.tilt-card').forEach(function(card){
      var MAX=8;
      card.addEventListener('mousemove',function(e){
        var r=card.getBoundingClientRect();
        var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        var rx=(-y*MAX).toFixed(2), ry=(x*MAX).toFixed(2);
        card.style.transform='perspective(700px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-4px) scale(1.02)';
        card.style.boxShadow='0 14px 48px rgba(95,158,150,0.22),0 2px 8px rgba(95,158,150,0.12)';
        card.style.transition='box-shadow 0.1s ease';
      });
      card.addEventListener('mouseleave',function(){
        card.style.transform='perspective(700px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        card.style.boxShadow='';
        card.style.transition='transform 0.45s cubic-bezier(.16,1,.3,1), box-shadow 0.45s ease';
      });
    });
  }

  /* SPEC-PANEL HOVER GLOW */
  if(window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.spec-panel').forEach(function(panel){
      panel.addEventListener('mousemove',function(e){
        var r=panel.getBoundingClientRect();
        var x=e.clientX-r.left, y=e.clientY-r.top;
        panel.style.setProperty('--mx',x+'px');
        panel.style.setProperty('--my',y+'px');
      });
    });
  }

  /* ABOUT BENTO PARALLAX */
  window.addEventListener('load',function(){
    var bq=document.querySelector('.about-bento-main');
    if(!bq||!window.matchMedia('(pointer:fine)').matches) return;
    bq.addEventListener('mousemove',function(e){
      var r=bq.getBoundingClientRect();
      var xp=((e.clientX-r.left)/r.width-.5)*12, yp=((e.clientY-r.top)/r.height-.5)*8;
      bq.style.transform='perspective(900px) rotateX('+(-yp*.4).toFixed(2)+'deg) rotateY('+(xp*.4).toFixed(2)+'deg)';
      bq.style.transition='transform 0.1s ease';
    });
    bq.addEventListener('mouseleave',function(){
      bq.style.transform='';
      bq.style.transition='transform 0.6s cubic-bezier(.16,1,.3,1)';
    });
  });

})();

/* ── Porady · Bezpieczna ciąża — scroll fan cards (adaptacja) ── */
(function(){
  const sec   = document.getElementById('porady-sec');
  const track = document.getElementById('porady-track');
  const hint  = document.getElementById('porady-hint');
  if (!sec || !track) return;

  const isMob = () => window.innerWidth <= 768;

  /* 1. Wejście — karty unoszą się z dołu, gdy sekcja wchodzi w kadr */
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      sec.classList.add('revealed');
      observer.disconnect();
    }
  }, { threshold: 0.05 });
  observer.observe(sec);

  /* 2. Scroll — poziomy pan (tylko desktop) */
  function update() {
    if (isMob()) { track.style.transform = ''; return; }
    const rect  = sec.getBoundingClientRect();
    const maxS  = sec.offsetHeight - window.innerHeight;
    if (maxS <= 0) return;
    const prog  = Math.max(0, Math.min(1, -rect.top / maxS));
    const tw    = track.scrollWidth;
    const vw    = window.innerWidth;
    const startX = vw * 0.18;
    const travel = tw - vw + vw * 0.12;
    const x = startX - prog * (startX + travel);
    track.style.transform = `translateX(${x.toFixed(1)}px)`;
    if (hint) hint.classList.toggle('visible', prog < 0.04);
  }

  if (hint && !isMob()) hint.classList.add('visible');
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
})();

/* ── Pływający kontakt — rozwijanie panelu ── */
(function(){
  var fab = document.getElementById('contact-fab');
  var btn = document.getElementById('cfabBtn');
  if (!fab || !btn) return;
  function setOpen(open){
    fab.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    setOpen(!fab.classList.contains('open'));
  });
  document.addEventListener('click', function(e){
    if (fab.classList.contains('open') && !fab.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') setOpen(false);
  });
})();
