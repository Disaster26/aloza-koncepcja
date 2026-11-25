(function(){
 // menu na telefonie
 var b=document.getElementById('burger'),m=document.getElementById('menu');
 if(b&&m){
  b.addEventListener('click',function(){var o=m.classList.toggle('on');b.setAttribute('aria-expanded',o);b.textContent=o?'Zamknij':'Menu';});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('on')){m.classList.remove('on');b.setAttribute('aria-expanded','false');b.textContent='Menu';b.focus();}});
 }

 // powiększenie zdjęć z przechodzeniem po grupie
 var lb=document.getElementById('lb'),lbImg=lb&&lb.querySelector('img'),lbl=lb&&lb.querySelector('.lbl'),grupa=[],poz=0,ostatni=null;
 function pokaz(i){poz=(i+grupa.length)%grupa.length;var im=grupa[poz];lbImg.src=im.dataset.duze;lbImg.alt=im.alt;lbl.textContent=im.alt+' ('+(poz+1)+'/'+grupa.length+')';}
 function otworz(im){var g=im.closest('[data-grupa]');grupa=[].slice.call((g||document).querySelectorAll('img[data-duze]'));ostatni=document.activeElement;pokaz(grupa.indexOf(im));lb.classList.add('on');lb.querySelector('.zam').focus();document.body.style.overflow='hidden';}
 function zamknij(){lb.classList.remove('on');document.body.style.overflow='';if(ostatni)ostatni.focus();}
 if(lb){
  lb.querySelector('.zam').addEventListener('click',zamknij);
  lb.querySelector('.pop').addEventListener('click',function(){pokaz(poz-1);});
  lb.querySelector('.nas').addEventListener('click',function(){pokaz(poz+1);});
  lb.addEventListener('click',function(e){if(e.target===lb)zamknij();});
  addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')zamknij();if(e.key==='ArrowLeft')pokaz(poz-1);if(e.key==='ArrowRight')pokaz(poz+1);});
  var tx=null;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',function(e){if(tx===null)return;var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)pokaz(poz+(d<0?1:-1));tx=null;});
 }

 // tory przesuwane palcem, myszą i strzałkami
 document.querySelectorAll('.tor-w').forEach(function(w){
  var t=w.querySelector('[data-tor]'),x0,s0,ruch=false,wcis=false;
  w.querySelectorAll('[data-w]').forEach(function(btn){btn.addEventListener('click',function(){var k=t.firstElementChild,krok=w.classList.contains('glowne')?t.clientWidth:t.clientWidth*.8;t.scrollBy({left:+btn.dataset.w*krok,behavior:'smooth'});});});
  t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;wcis=true;ruch=false;x0=e.clientX;s0=t.scrollLeft;});
  addEventListener('pointermove',function(e){if(!wcis)return;var d=e.clientX-x0;if(Math.abs(d)>5){ruch=true;t.classList.add('ciag');}t.scrollLeft=s0-d;});
  addEventListener('pointerup',function(){if(!wcis)return;wcis=false;t.classList.remove('ciag');});
  t.addEventListener('click',function(e){if(ruch){e.preventDefault();ruch=false;return;}var f=e.target.closest('figure'),im=f&&f.querySelector('img[data-duze]');if(im&&lb)otworz(im);});
  t.addEventListener('keydown',function(e){if(e.key==='Enter'){var f=e.target.closest('figure'),im=f&&f.querySelector('img[data-duze]');if(im&&lb)otworz(im);}});
 });

 // mozaika wnętrz: powiększenie po kliknięciu
 document.querySelectorAll('.mozaika figure').forEach(function(f){
  var im=f.querySelector('img[data-duze]');if(!im||!lb)return;
  f.addEventListener('click',function(){otworz(im);});
  f.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();otworz(im);}});
 });

 // galeria apartamentu: licznik i miniatury
 var gl=document.querySelector('.glowne');
 if(gl){
  var tor=gl.querySelector('[data-tor]'),fig=tor.children,lic=gl.querySelector('.licznik'),mini=[].slice.call(document.querySelectorAll('.miniatury button'));
  function biez(){return Math.round(tor.scrollLeft/tor.clientWidth);}
  function odsw(){var i=biez();if(lic)lic.textContent=(i+1)+' / '+fig.length;mini.forEach(function(x,k){x.setAttribute('aria-current',k===i?'true':'false');});}
  tor.addEventListener('scroll',function(){clearTimeout(tor._t);tor._t=setTimeout(odsw,60);},{passive:true});
  mini.forEach(function(x,k){x.addEventListener('click',function(){tor.scrollTo({left:k*tor.clientWidth,behavior:'smooth'});});});
  odsw();
 }

 // wirtualny spacer jako okładka, odtwarzacz po kliknięciu
 document.querySelectorAll('[data-spacer]').forEach(function(btn){btn.addEventListener('click',function(){var box=btn.parentNode,f=document.createElement('iframe');f.src=box.dataset.src;f.title='Wirtualny spacer po Apartamentach Aloza';f.allowFullscreen=true;f.setAttribute('allow','fullscreen');box.appendChild(f);btn.remove();});});

 // formularz zapytania o termin
 var fm=document.getElementById('formularz');
 if(fm){
  var q=new URLSearchParams(location.search).get('apartament'),sel=fm.querySelector('[name=apartament]');
  if(q&&sel){[].forEach.call(sel.options,function(o){if(o.value===q)sel.value=q;});}
  var od=fm.querySelector('[name=od]'),dop=fm.querySelector('[name=do]'),dzis=new Date().toISOString().slice(0,10);
  od.min=dzis;dop.min=dzis;od.addEventListener('change',function(){dop.min=od.value||dzis;if(dop.value&&dop.value<=od.value)dop.value='';});
  fm.addEventListener('submit',function(e){
   e.preventDefault();var info=document.getElementById('finfo'),brak=[];
   ['od','do','imie'].forEach(function(n){var p=fm.querySelector('[name='+n+']');if(!p.value)brak.push(p);});
   var em=fm.querySelector('[name=email]'),tel=fm.querySelector('[name=telefon]');if(!em.value&&!tel.value)brak.push(em);
   if(!fm.querySelector('[name=zgoda]').checked)brak.push(fm.querySelector('[name=zgoda]'));
   if(brak.length){info.className='info';info.textContent='Uzupełnij daty pobytu, imię, telefon lub e-mail i zaznacz zgodę.';brak[0].focus();return;}
   info.className='info ok';info.textContent='To wersja testowa strony: formularz zacznie wysyłać zapytania na aloza.ustka@gmail.com po uruchomieniu strony pod adresem aloza.com.pl.';
  });
 }
})();
