const SITE={whatsapp:'917021284300'};document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());document.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>location.href='https://wa.me/'+SITE.whatsapp+'?text='+encodeURIComponent(b.dataset.wa));const f=document.querySelector('#contactForm');if(f)f.onsubmit=e=>{e.preventDefault();const d=new FormData(f);location.href='https://wa.me/'+SITE.whatsapp+'?text='+encodeURIComponent(`Hello Star Vision Fiber Optics, I would like to enquire.\nName: ${d.get('name')}\nPhone: ${d.get('phone')}\nService: ${d.get('service')}\nMessage: ${d.get('message')}`)};


/* Automatic customer review system. Requires PHP hosting so api/reviews.php can save reviews. */
(function(){
  const list=document.querySelector('#reviewsList');
  const button=document.querySelector('#writeReviewBtn');
  if(!list && !button) return;
  const API='api/reviews.php';
  const products=[
    'Star Vision 300Mbps Wireless N Router',
    'Star Vision SV-1200-FTTH Dual Band Router',
    'Direct Internet Connection / FTTH Service',
    'Other Star Vision Product / Service'
  ];
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const stars=n=>'★★★★★'.slice(0,Math.max(0,Math.min(5,Number(n))))+'☆☆☆☆☆'.slice(0,5-Math.max(0,Math.min(5,Number(n))));
  function modal(){
    let m=document.querySelector('#reviewModal');
    if(m) return m;
    m=document.createElement('div');m.id='reviewModal';m.className='modal show';
    m.innerHTML=`<div class="modalbox review-form-box"><button class="close" type="button" id="closeReview" aria-label="Close">×</button><div><span class="tag">CUSTOMER REVIEW</span><h2>Share Your Experience</h2><p class="review-form-note">Please leave a genuine review based on your experience with Star Vision Fiber Optics.</p><form id="reviewForm"><label>Your Name*<input name="name" required maxlength="80" autocomplete="name" placeholder="Enter your name"></label><label>Product / Service*<select name="product" required><option value="">Select one</option>${products.map(p=>`<option>${esc(p)}</option>`).join('')}</select></label><label>Rating*<select name="rating" required><option value="">Select rating</option><option value="5">★★★★★ — Excellent</option><option value="4">★★★★☆ — Very Good</option><option value="3">★★★☆☆ — Good</option><option value="2">★★☆☆☆ — Fair</option><option value="1">★☆☆☆☆ — Poor</option></select></label><label>Your Review*<textarea name="review" required minlength="10" maxlength="600" rows="5" placeholder="Tell us about your experience..."></textarea></label><input name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true"><button class="btn primary" type="submit">Submit Review</button><div id="reviewStatus" class="review-status" aria-live="polite"></div></form></div></div>`;
    document.body.appendChild(m);
    m.querySelector('#closeReview').onclick=()=>m.classList.remove('show');
    m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')});
    m.querySelector('#reviewForm').onsubmit=submit;
    return m;
  }
  function open(){const m=modal();m.classList.add('show');setTimeout(()=>m.querySelector('input[name="name"]')?.focus(),50)}
  async function submit(e){
    e.preventDefault();
    const form=e.currentTarget, status=form.querySelector('#reviewStatus'), btn=form.querySelector('button[type="submit"]');
    status.textContent='Submitting…';btn.disabled=true;
    const data=Object.fromEntries(new FormData(form).entries());
    data.rating=Number(data.rating);
    try{
      const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const j=await r.json();
      if(!r.ok||!j.success) throw new Error(j.message||'Unable to submit review.');
      status.textContent='✓ Thank you! Your review is now live.';
      form.reset();
      await load();
      setTimeout(()=>document.querySelector('#reviewModal')?.classList.remove('show'),1200);
    }catch(err){
      status.textContent='Could not submit the review. Please try again.';
    }finally{btn.disabled=false;}
  }
  async function load(){
    if(!list) return;
    try{
      const r=await fetch(API+'?t='+Date.now(),{cache:'no-store'});const j=await r.json();
      if(!j.success) throw new Error('load');
      const reviews=Array.isArray(j.reviews)?j.reviews:[];
      if(!reviews.length){list.innerHTML='<div class="review"><div class="stars">★★★★★</div><h3>Be our first reviewer</h3><small>Share your genuine experience with Star Vision Fiber Optics.</small></div>';return;}
      list.innerHTML=reviews.map(x=>`<article class="review"><div class="stars" aria-label="${Number(x.rating)||0} out of 5 stars">${stars(x.rating)}</div><h3>${esc(x.name)}</h3><small>${esc(x.product)}</small><p>${esc(x.review)}</p></article>`).join('');
    }catch(e){list.innerHTML='<div class="review"><div class="stars">★★★★★</div><h3>Reviews will appear here</h3><small>Customer reviews are available when the site is connected to its review service.</small></div>';}
  }
  button?.addEventListener('click',open);
  load();
})();

/* Connection booking: choose a plan before WhatsApp */
(function(){
  const links=[...document.querySelectorAll('a[href*="services.html#internet"]')];
  if(!links.length)return;
  const plans=[
    ['75 Mbps Plan','₹500/month','Only WiFi • Free fiber router • FTTH connection • Installation support'],
    ['100 Mbps Plan','₹750/month','WiFi + HD Cable + Movies + All OTTs • Free fiber router • High-speed fiber WiFi • Installation support'],
    ['200 Mbps Plan','₹1,450/month','WiFi + HD Cable + Movies + All OTTs • Free fiber router • High-speed fiber WiFi • Installation support']
  ];
  const modal=document.createElement('div');
  modal.id='planSelectModal';
  modal.innerHTML='<div class="plan-select-backdrop"></div><div class="plan-select-box" role="dialog" aria-modal="true" aria-labelledby="planSelectTitle"><button class="plan-select-close" aria-label="Close">×</button><span class="eyebrow">INTERNET CONNECTION</span><h2 id="planSelectTitle">Select a Plan</h2><p>Please read what each plan includes, then select your preferred plan to continue to WhatsApp.</p><div class="plan-select-options">'+plans.map((p,i)=>`<button type="button" class="plan-select-option" data-plan="${p[0]}"><div><strong>${p[0]}</strong><small>${p[2]}</small></div><span>${p[1]}</span></button>`).join('')+'</div></div>';
  document.body.appendChild(modal);
  const close=()=>modal.classList.remove('open');
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();modal.classList.add('open')}));
  modal.querySelector('.plan-select-close').onclick=close;
  modal.querySelector('.plan-select-backdrop').onclick=close;
  modal.querySelectorAll('.plan-select-option').forEach(b=>b.onclick=()=>{const plan=b.dataset.plan;location.href='https://wa.me/917021284300?text='+encodeURIComponent('Hello Star Vision Fiber Optics, I would like to book the '+plan+'. Please share the next steps.')});
})();

// Site-wide search: show only matching products/services and open the selected result.
(function(){
  const input=document.querySelector('#search'); if(!input) return;
  const offerings=[
    ['300Mbps Wireless N Router','products.html#routers'],['Dual Band FTTH Router','products.html#routers'],['FTTH Router','products.html#routers'],['Routers','products.html#routers'],['Networking Equipment','products.html'],['FTTH Services','services.html'],['Direct Internet Connection','services.html#internet'],['75 Mbps Plan','services.html#internet'],['100 Mbps Plan','services.html#internet'],['200 Mbps Plan','services.html#internet'],['Customer Support','contact.html'],['Internet Equipment','services.html']
  ];
  function matches(label,q){
    const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
    const text=label.toLowerCase();
    return terms.every(t=>text.includes(t));
  }
  function searchSite(){
    const q=input.value.trim(); if(!q){document.querySelector('#siteSearchResults')?.remove();return;}
    const hit=offerings.filter(x=>matches(x[0],q));
    let box=document.querySelector('#siteSearchResults');
    if(!box){box=document.createElement('div');box.id='siteSearchResults';box.style='position:absolute;z-index:50;left:50%;transform:translateX(-50%);top:calc(100% + 8px);width:min(560px,92vw);background:#fff;border:1px solid #ddd;border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.15);padding:12px';input.parentElement.style.position='relative';input.parentElement.appendChild(box)}
    box.innerHTML=hit.length?hit.map(x=>{const href=x[1].startsWith('products.html')?x[1]+(x[1].includes('?')?'&':'?')+'search='+encodeURIComponent(q):x[1];return `<a href="${href}" style="display:block;padding:10px;text-decoration:none;color:inherit;border-radius:7px">${x[0]}</a>`}).join(''):'<div style="padding:10px">No results found</div>';
    box.style.display='block';
    if(hit.length===1 && hit[0][1].startsWith('products.html')) box.querySelector('a')?.focus();
  }
  function goSearch(){
    const q=input.value.trim(); if(!q)return;
    const hit=offerings.filter(x=>matches(x[0],q));
    if(hit.length===1 && hit[0][1].startsWith('products.html')){
      location.href=hit[0][1]+(hit[0][1].includes('?')?'&':'?')+'search='+encodeURIComponent(q);
      return;
    }
    searchSite();
  }
  input.addEventListener('input',searchSite);
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();goSearch()}});
  document.querySelector('.search button')?.addEventListener('click',goSearch);
})();
