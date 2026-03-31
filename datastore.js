/* ═══════════════════════════════════════════
   datastore.js  –  Flavor Fusion Data Layer
   ═══════════════════════════════════════════
   PUBLIC:  fetches ./data.json from GitHub
   ADMIN:   edits → publishes → uploads data.json to GitHub
   CART:    sessionStorage (per-session, no server needed)
═══════════════════════════════════════════ */

const DataStore = (() => {
  let _data = {
    restaurant: {
      name:'Flavor Fusion',tagline:'Where Punjab Meets the World',
      logo:null,address:'22, Model Town, Patiala, Punjab – 147001',
      phone:'+91 98765 43210',whatsapp:'919876543210',
      email:'order@flavorfusion.in',openHours:'Mon–Sun: 11:00 AM – 11:00 PM',
      gst:5,currency:'₹',upiId:'flavorfusion@upi',
      heroTagline:'Handcrafted Flavors. Straight from the Heart of Patiala.',
      announcement:'🎉 Free delivery on orders above ₹500!'
    },
    categories:[],
    menuItems:[],
  };
  let _loaded = false;

  // Simple localStorage helpers for admin draft
  const LS = {
    get(k, fb=null){ try{ const v=localStorage.getItem('ff_'+k); return v!==null?JSON.parse(v):fb; }catch{return fb;} },
    set(k,v){ try{localStorage.setItem('ff_'+k,JSON.stringify(v));}catch{} },
    del(k){ try{localStorage.removeItem('ff_'+k);}catch{} }
  };

  async function load(){
    if(_loaded) return;
    const isAdmin = LS.get('adminMode',false);
    try{
      const url = './data.json' + (isAdmin ? '?v='+Date.now() : '');
      const res  = await fetch(url, {cache:'no-cache'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const json = await res.json();
      _data = {
        restaurant: json.restaurant  || _data.restaurant,
        categories: Array.isArray(json.categories) ? json.categories : [],
        menuItems:  Array.isArray(json.menuItems)  ? json.menuItems  : [],
      };
      // If admin has newer local changes, prefer them
      if(isAdmin){
        const local = LS.get('adminDraft',null);
        if(local && local._ts){
          const remoteTs = json._lastUpdated ? new Date(json._lastUpdated).getTime() : 0;
          if(local._ts > remoteTs){ _data = local; }
        }
      }
    } catch(err){
      // Fallback: local drafts or empty
      console.warn('DataStore: fetch failed ('+err.message+'). Trying local draft.');
      const local = LS.get('adminDraft', null);
      if(local){ _data = local; }
    }
    _loaded = true;
  }

  function get(key){ return _data[key]; }

  function set(key, val){
    _data[key] = val;
    // Save draft for admin
    const draft = Object.assign({}, _data, {_ts: Date.now()});
    LS.set('adminDraft', draft);
  }

  // Delete item from array by id
  function del(key, id){
    if(!Array.isArray(_data[key])) return;
    set(key, _data[key].filter(x => x.id !== id));
  }

  // Generate and download data.json
  function publishData(){
    const payload = {
      restaurant:   _data.restaurant,
      categories:   _data.categories,
      menuItems:    _data.menuItems,
      _lastUpdated: new Date().toISOString(),
      _info:        'Flavor Fusion – data.json. Upload to GitHub repo root to publish.'
    };
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.json';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }

  // Export backup
  function exportBackup(){
    const payload = Object.assign({}, _data, {
      _lastUpdated: new Date().toISOString(),
      _type: 'backup'
    });
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ff_backup_'+new Date().toISOString().split('T')[0]+'.json';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }

  function importFromFile(file){
    return new Promise((resolve,reject)=>{
      const r = new FileReader();
      r.onload = e => {
        try{
          const d = JSON.parse(e.target.result);
          if(d.restaurant) set('restaurant', d.restaurant);
          if(d.categories)  set('categories',  d.categories);
          if(d.menuItems)   set('menuItems',    d.menuItems);
          resolve(d);
        }catch(err){ reject(err); }
      };
      r.onerror = reject;
      r.readAsText(file);
    });
  }

  function info(){
    return {
      loaded:     _loaded,
      categories: (_data.categories||[]).length,
      menuItems:  (_data.menuItems||[]).length,
    };
  }

  return { load, get, set, del, publishData, exportBackup, importFromFile, info };
})();

window.DataStore = DataStore;

/* ═══════════════════════════════════
   Cart  – sessionStorage per session
═══════════════════════════════════ */
const Cart = (() => {
  const KEY = 'ff_cart';

  function all(){
    try{ return JSON.parse(sessionStorage.getItem(KEY)||'[]'); }
    catch{ return []; }
  }
  function save(arr){ sessionStorage.setItem(KEY, JSON.stringify(arr)); }

  function add(item, qty){
    qty = qty||1;
    const arr = all();
    const idx = arr.findIndex(x=>x.id===item.id);
    if(idx>=0){ arr[idx].qty += qty; }
    else{ arr.push({id:item.id,name:item.name,price:item.price,isVeg:item.isVeg,image:item.image||null,qty:qty}); }
    save(arr);
    _notify();
  }

  function update(id, qty){
    qty = Number(qty);
    const arr = all();
    const idx = arr.findIndex(x=>x.id===id);
    if(idx<0) return;
    if(qty<=0){ arr.splice(idx,1); }
    else{ arr[idx].qty = qty; }
    save(arr);
    _notify();
  }

  function remove(id){ update(id,0); }

  function clear(){ sessionStorage.removeItem(KEY); _notify(); }

  function count(){ return all().reduce((s,x)=>s+x.qty,0); }

  function subtotal(){ return all().reduce((s,x)=>s+(x.price*x.qty),0); }

  function qty(id){
    const item = all().find(x=>x.id===id);
    return item ? item.qty : 0;
  }

  // Listeners for cart update
  const _listeners = [];
  function onChange(fn){ _listeners.push(fn); }
  function _notify(){ _listeners.forEach(fn=>fn()); }

  return { all, add, update, remove, clear, count, subtotal, qty, onChange };
})();

window.Cart = Cart;
