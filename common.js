/* common.js  –  Flavor Fusion Shared Utilities */

// ── Active nav ──
(function(){
  const pg = location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.app-bar-nav a, .bn-item').forEach(a=>{
    const h = a.getAttribute('href');
    if(h===pg||(pg===''&&h==='index.html')) a.classList.add('active');
  });
})();

// ── Mobile menu toggle ──
document.addEventListener('DOMContentLoaded',()=>{
  const tog = document.getElementById('menuToggle');
  const nav = document.getElementById('topNav');
  if(tog&&nav){
    tog.addEventListener('click',()=>{ tog.classList.toggle('open'); nav.classList.toggle('open'); });
    document.addEventListener('click',e=>{
      if(!tog.contains(e.target)&&!nav.contains(e.target)){ tog.classList.remove('open'); nav.classList.remove('open'); }
    });
  }
});

// ── Unique ID ──
function genId(p){ p=p||'id'; return p+'_'+Date.now()+'_'+Math.random().toString(36).slice(2,8); }

// ── Format currency ──
function fmt(n){ const r=DataStore&&DataStore.get?DataStore.get('restaurant'):null; const c=(r&&r.currency)||'₹'; return c+Number(n||0).toFixed(2).replace('.00',''); }

// ── Format date ──
function fmtDate(d){
  if(!d) return '—';
  try{ return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}); }catch{ return d; }
}

// ── Order ID ──
function genOrderId(){ return 'FF'+Date.now().toString(36).toUpperCase().slice(-6); }

// ── Toast ──
var _toastT;
function toast(msg,type){
  type=type||'success';
  var t=document.getElementById('_toast');
  if(!t){
    t=document.createElement('div');t.id='_toast';
    t.style.cssText='position:fixed;bottom:88px;right:20px;z-index:9999;padding:12px 20px;border-radius:12px;font-family:"DM Sans",sans-serif;font-weight:600;font-size:.84rem;box-shadow:0 6px 28px rgba(0,0,0,.18);transform:translateY(12px);opacity:0;transition:all .26s;max-width:340px;line-height:1.4;display:flex;align-items:center;gap:9px;border-left:4px solid;';
    document.body.appendChild(t);
  }
  clearTimeout(_toastT);
  var s={success:['#eafaf1','#1e8449'],danger:['#fdeded','#922b21'],info:['#fef9e7','#7d6608'],warning:['#fef5e7','#a04000']};
  var ic={success:'✅',danger:'❌',info:'ℹ️',warning:'⚠️'};
  var c=s[type]||s.info;
  t.style.background=c[0];t.style.color=c[1];t.style.borderLeftColor=c[1];
  t.innerHTML='<span>'+(ic[type]||'')+'</span><span>'+msg+'</span>';
  requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translateY(0)';});
  _toastT=setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(12px)';},3200);
}

// ── Confirm ──
function confirmDel(msg){ return confirm(msg||'Are you sure?'); }

// ── Image resize/compress before storage ──
function compressImage(file, maxW, maxH, quality){
  maxW=maxW||600; maxH=maxH||450; quality=quality||0.78;
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        let w=img.width, h=img.height;
        if(w>maxW||h>maxH){
          if(w/maxW>h/maxH){ h=Math.round(h*(maxW/w)); w=maxW; }
          else{ w=Math.round(w*(maxH/h)); h=maxH; }
        }
        const canvas=document.createElement('canvas');
        canvas.width=w; canvas.height=h;
        const ctx=canvas.getContext('2d');
        ctx.drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg',quality));
      };
      img.onerror=reject;
      img.src=e.target.result;
    };
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
}

// ── Cart badge updater ──
function updateCartBadges(){
  const n = Cart.count();
  document.querySelectorAll('.cart-badge,.fab-count,.bn-badge').forEach(el=>{
    el.textContent = n;
    el.style.display = n>0?'flex':'none';
  });
  const fabCart = document.getElementById('fabCart');
  if(fabCart){
    const fc = fabCart.querySelector('.fab-count');
    if(fc) fc.textContent=n;
    fabCart.style.display = n>0?'flex':'none';
  }
}

// ── Emoji placeholder for food items ──
const FOOD_EMOJIS = {
  'cat_01':'🥗','cat_02':'🍛','cat_03':'🫓','cat_04':'🍚','cat_05':'🥤','cat_06':'🍮'
};
function itemEmoji(item){
  return FOOD_EMOJIS[item.categoryId]||'🍽️';
}
