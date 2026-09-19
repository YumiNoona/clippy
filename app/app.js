
/* ================= ICONS ================= */
const HOSTED = window.LOOP_HOSTED === true;
const I = {
  search:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
  pin:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.5 7.5 15h9L15 10.5V5a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1z"/></svg>`,
  pinFilled:`<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.2"><path d="M12 17v5"/><path d="M9 10.5 7.5 15h9L15 10.5V5a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1z"/></svg>`,
  star:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.8 5.9 21l1.4-6.8-5-4.7 6.8-.8z"/></svg>`,
  trash:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/></svg>`,
  copy:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>`,
  share:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.7 15.8 6.3M8.2 13.3l7.6 4.4"/></svg>`,
  check:`<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  x:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  paste:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4.5" width="12" height="17" rx="2"/><path d="M9 4.5V3.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 3.5v1"/><path d="M9 11h6M9 15h6M9 19h3.5"/></svg>`,
  select:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><path d="M14 4.5h6.5V11"/><path d="M20.5 14v6.5H14"/><path d="M10 20.5H3.5V14"/></svg>`,
  all:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.7"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.7"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.7"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.7"/></svg>`,
  text:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5h14M5 10.5h14M5 16h9"/></svg>`,
  image:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2.2"/><circle cx="9" cy="10" r="1.6"/><path d="M20.5 15.5 15.5 11l-9 8"/></svg>`,
  link:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 14.5 14.5 9.5"/><path d="M11 6.5 12.6 5A4 4 0 1 1 18.3 10.7L16.5 12.4"/><path d="M13 17.5 11.4 19A4 4 0 1 1 5.7 13.3L7.5 11.6"/></svg>`,
  file:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8l4.5 4.5v12.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4.5"/></svg>`,
  favorite:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.8 5.9 21l1.4-6.8-5-4.7 6.8-.8z"/></svg>`,
  desktop:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.8"/><path d="M8 20h8M12 16v4"/></svg>`,
  phone:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="2.5" width="11" height="19" rx="2.3"/><path d="M10.5 18.5h3"/></svg>`,
  tablet:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2.5" width="16" height="19" rx="2.3"/><path d="M11 18.5h2"/></svg>`,
  cloud:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.5-9 5.5 5.5 0 0 1 10.7-1.7A4 4 0 0 1 17 18z"/></svg>`,
  refresh:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14.7-4.3M4 13a8 8 0 0 0 14.7 4.3"/><path d="M5 3v4h4M19 21v-4h-4"/></svg>`,
  offline:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 2.5l19 19"/><path d="M8.5 8.8A9.7 9.7 0 0 0 4 12.5M20 12.5a9.7 9.7 0 0 0-3.3-3M7 15.5a5.5 5.5 0 0 1 3-1.9M12 18.5h.01"/><path d="M11 11c1.8-.3 3.6.1 5 1.2"/></svg>`,
  clock:`<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`
};
function icHTML(name){return I[name];}

/* ================= DATA ================= */
const min = 60*1000, hr = 60*min, day = 24*hr;
const HEARTBEAT_MS = 6000;      // how often this device pings its presence + pulls updates
const ONLINE_WINDOW = 15000;    // heartbeat younger than this = "online"
const IDLE_WINDOW   = 5*min;    // heartbeat younger than this = "idle" (else offline)

let devices = [];
let items = [];

let state = {
  filter:'all',
  deviceFilter:null,
  search:'',
  selectMode:false,
  selected:new Set(),
  detailId:null,
  online: true, // User-controlled sync pause; network failures retry automatically.
  queue:[],          // IDs of pending changes awaiting a successful sync
  ready:false,       // true once initial load + device registration finished
  myDeviceId:null,
  syncing:false,
  receivePaused:false,
};

const deviceIcon = t => t==='phone'?'phone':t==='tablet'?'tablet':'desktop';
const typeIcon = t => ({text:'text',rich:'text',image:'image',link:'link',file:'file'}[t]||'text');

function fmtTime(ts){
  const d = Date.now() - ts;
  if(d < min) return 'Just now';
  if(d < hr) return Math.floor(d/min)+'m ago';
  if(d < day) return Math.floor(d/hr)+'h ago';
  if(d < 2*day) return 'Yesterday';
  return Math.floor(d/day)+'d ago';
}
function dayBucket(ts){
  const today=new Date();today.setHours(0,0,0,0);
  const yesterday=new Date(today);yesterday.setDate(yesterday.getDate()-1);
  if(ts>=today.getTime()) return 'Today';
  if(ts>=yesterday.getTime()) return 'Yesterday';
  if(Date.now()-ts<7*day) return 'This week';
  return 'Earlier';
}
function deviceById(id){ return devices.find(d=>d.id===id) || {id, name:'Unknown device', type:'desktop'}; }
function genId(){ return 'id-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8); }

/* Device identity is a random ID persisted in this browser. */
function detectDevice(){
  const ua = navigator.userAgent || '';
  const isTablet = /iPad|Tablet|Android(?!.*Mobile)/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints>1);
  const isPhone = !isTablet && /iPhone|Android.*Mobile|Mobile/i.test(ua);
  const type = isTablet ? 'tablet' : isPhone ? 'phone' : 'desktop';
  let browser = 'Browser';
  if(/Edg\//.test(ua)) browser='Edge';
  else if(/Chrome\//.test(ua)) browser='Chrome';
  else if(/Firefox\//.test(ua)) browser='Firefox';
  else if(/Safari\//.test(ua)) browser='Safari';
  let os = 'device';
  if(/Windows/.test(ua)) os='Windows';
  else if(/iPhone|iPad|iPod/.test(ua) || (isTablet && /Macintosh/.test(ua))) os='iOS';
  else if(/Mac OS X/.test(ua)) os='Mac';
  else if(/Android/.test(ua)) os='Android';
  else if(/Linux/.test(ua)) os='Linux';
  const id = deviceIdentity;
  const name = `${browser} on ${os}`;
  return {id, name, type};
}

/* Persistence and authenticated sync are implemented below. */
function deviceStatus(d){
  const age = Date.now() - (d.lastSeen||0);
  if(d.id===state.myDeviceId) return state.online && !state.syncError && !!accessKey ? 'online':'offline';
  if(age < ONLINE_WINDOW) return 'online';
  if(age < IDLE_WINDOW) return 'idle';
  return 'offline';
}

/* ================= RENDER: SIDEBAR ================= */
const FILTERS = [
  {id:'all', label:'All items', icon:'all'},
  {id:'pinned', label:'Pinned', icon:'pin'},
  {id:'favorites', label:'Favorites', icon:'favorite'},
  {id:'text', label:'Text', icon:'text'},
  {id:'image', label:'Images', icon:'image'},
  {id:'link', label:'Links', icon:'link'},
  {id:'file', label:'Files', icon:'file'},
];

function renderSidebar(){
  const nav = document.getElementById('navFilters');
  nav.innerHTML='';
  FILTERS.forEach(f=>{
    const count = items.filter(it=>matchesFilter(it,f.id)).length;
    const el = document.createElement('div');
    el.className='nav-item'+(state.filter===f.id && !state.deviceFilter ? ' active':'');
    el.innerHTML = `${icHTML(f.icon)}<span>${f.label}</span><span class="count">${count}</span>`;
    el.onclick=()=>{ state.filter=f.id; state.deviceFilter=null; state.detailId=null; document.getElementById('sidebar').classList.remove('open'); render(); };
    nav.appendChild(el);
  });

  const dl = document.getElementById('deviceList');
  dl.innerHTML='';
  devices.slice().sort((a,b)=> (b.id===state.myDeviceId)-(a.id===state.myDeviceId)).forEach(d=>{
    const isThis = d.id===state.myDeviceId;
    const st = deviceStatus(d);
    const el = document.createElement('div');
    el.className='device-row'+(state.deviceFilter===d.id?' active':'');
    el.dataset.deviceId=d.id;
    const sub = isThis ? 'This device' : st==='online' ? 'Online now' : st==='idle' ? 'Synced · '+fmtTime(d.lastSeen) : 'Offline · '+fmtTime(d.lastSeen||0);
    el.innerHTML = `<div class="device-ic">${icHTML(deviceIcon(d.type))}<span class="dstatus ${st==='online'?'':st==='idle'?'pending':'off'}"></span></div>
      <div class="device-meta"><div class="device-name">${escapeHtml(d.name)}${isThis?' <span style=\"color:var(--text-faint)\">(you)</span>':''}</div><div class="device-sub">${sub}</div></div>`;
    el.onclick=()=>{ state.deviceFilter = state.deviceFilter===d.id? null : d.id; state.detailId=null; document.getElementById('sidebar').classList.remove('open'); render(); };
    dl.appendChild(el);
    if(!isThis && !['windows-capture','windows-quick'].includes(d.id)){
      const remove=document.createElement('button');remove.className='remove-device';remove.innerHTML=icHTML('x');remove.title='Remove '+d.name;remove.setAttribute('aria-label','Remove '+d.name);
      remove.onclick=async e=>{e.stopPropagation();remove.disabled=true;try{
        if(accessKey){const response=await fetch('/api/remove-device',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+accessKey},body:JSON.stringify({id:d.id}),signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error();devices=(await response.json()).devices;}
        else devices=devices.filter(x=>x.id!==d.id);
        if(state.deviceFilter===d.id)state.deviceFilter=null;await saveLocal();render();toast('Device removed. Pair it again to reconnect.');
      }catch{toast('Could not remove device. Check the connection.','offline');remove.disabled=false;}};el.appendChild(remove);
    }
  });

  const total = items.filter(i=>!i.deleted).length;
  const synced = items.filter(i=>!i.deleted && i.synced==='synced').length;
  document.getElementById('storageText').textContent = total? `${synced}/${total} synced` : 'Nothing yet';
  document.getElementById('storageFill').style.width = total? Math.round(synced/total*100)+'%' : '0%';
}

function matchesFilter(it, f){
  if(it.deleted) return false;
  if(f==='all') return true;
  if(f==='pinned') return it.pinned;
  if(f==='favorites') return it.fav;
  return it.type===f;
}

/* ================= RENDER: TABS ================= */
function renderTabs(){
  const tabs = document.getElementById('typeTabs');
  tabs.innerHTML='';
  FILTERS.filter(f=>['all','pinned'].includes(f.id)).forEach(f=>{
    const el = document.createElement('button');
    el.className='tab'+(state.filter===f.id?' active':'');
    el.innerHTML = `${icHTML(f.icon)} ${f.label}`;
    el.onclick=()=>{ state.filter=f.id; state.detailId=null; document.getElementById('sidebar').classList.remove('open'); render(); };
    tabs.appendChild(el);
  });
  const select=document.createElement('select');select.className='type-picker';select.setAttribute('aria-label','Filter clipboard by type');
  select.appendChild(new Option('All filters','all'));
  FILTERS.filter(f=>!['all','pinned'].includes(f.id)).forEach(f=>select.appendChild(new Option(f.label,f.id)));
  select.value=['all','pinned'].includes(state.filter)?'all':state.filter;
  select.onchange=()=>{state.filter=select.value;state.detailId=null;render();};tabs.appendChild(select);
}

/* ================= RENDER: LIST ================= */
function itemThumb(it){
  if(it.type==='image' && it.meta && it.meta.dataUrl){
    return `<div class="item-thumb img" style="background-image:url('${escapeHtml(it.meta.dataUrl)}')"></div>`;
  }
  const iconName = typeIcon(it.type);
  return `<div class="item-thumb">${icHTML(iconName)}</div>`;
}

function itemPreviewText(it){
  if(it.type==='image') return `${it.meta && it.meta.dims || 'Image'} · ${it.meta && it.meta.size || ''}`;
  if(it.type==='file') return `${(it.meta && it.meta.ext || 'file').toUpperCase()} file${it.meta && it.meta.size? ' · '+it.meta.size:''}`;
  if(it.type==='link') return it.content;
  return (it.content||'').replace(/\n/g,'  ·  ');
}

function getFilteredItems(){
  let list = items.filter(it=>{
    if(it.deleted) return false;
    if(state.deviceFilter && it.device!==state.deviceFilter) return false;
    if(!matchesFilter(it, state.filter)) return false;
    if(state.search){
      const s = state.search.toLowerCase();
      if(!(it.title.toLowerCase().includes(s) || it.content.toLowerCase().includes(s))) return false;
    }
    return true;
  });
  list.sort((a,b)=>{
    if(a.pinned!==b.pinned) return a.pinned? -1:1;
    return b.ts-a.ts;
  });
  return list;
}

function renderList(){
  const scroll = document.getElementById('listScroll');
  const list = getFilteredItems();
  scroll.classList.toggle('selecting',state.selectMode);
  document.getElementById('libraryTotal').textContent=items.filter(x=>!x.deleted).length+' clips';
  scroll.innerHTML='';

  if(list.length===0){
    const hasAnyItems = items.some(i=>!i.deleted);
    scroll.innerHTML = `<div class="empty-state">
      <div class="empty-ic">${icHTML('search')}</div>
      <h3>${state.search || state.deviceFilter || state.filter!=='all' ? 'Nothing here' : 'Your clipboard is empty'}</h3>
      <p>${state.search? 'No items match your search. Try a different keyword.' : hasAnyItems ? 'Nothing matches this filter yet.' : HOSTED ? 'Paste or add text to begin. Use Devices to create a private space for your other devices.' : 'New Windows copies appear here while the Loop tray is running. On a phone, tap Paste to add a copy.'}</p>
    </div>`;
    return;
  }

  let lastBucket = null;
  list.forEach(it=>{
    const bucket = dayBucket(it.ts);
    if(bucket!==lastBucket){
      lastBucket=bucket;
      const lbl = document.createElement('div');
      lbl.className='day-label';
      lbl.textContent=bucket;
      scroll.appendChild(lbl);
    }
    const dev = deviceById(it.device);
    const row = document.createElement('div');
    row.dataset.id=it.id;
    row.className='item'+(state.selected.has(it.id)?' selected':'')+(state.detailId===it.id?' open':'')+(it.synced==='pending'?' pending':'');

    const syncHTML = HOSTED && !accessKey ? `<span class="sync-chip synced">Saved locally</span>` : it.synced==='synced'
      ? `<span class="sync-chip synced">${icHTML('cloud')}Synced</span>`
      : `<span class="sync-chip pending">${icHTML('clock')}Pending</span>`;

    row.innerHTML = `
      <div class="check">${icHTML('check')}</div>
      ${itemThumb(it)}
      <div class="item-body">
        <div class="item-top">
          <div class="item-title">${escapeHtml(it.title)}</div>
          ${it.pinned? `<span class="item-pin">${icHTML('pinFilled')}</span>`:''}
          ${it.fav? `<span class="item-pin" style="stroke:var(--amber);fill:none;">${icHTML('star')}</span>`:''}
        </div>
        <div class="item-preview ${it.type==='text'||it.type==='link'?'mono':''}">${escapeHtml(itemPreviewText(it))}</div>
        <div class="item-meta">
          <span class="device-chip">${icHTML(deviceIcon(dev.type))}${dev.id===state.myDeviceId?'This device':escapeHtml(dev.name)}</span>
          <span class="meta-dot"></span>
          <span>${fmtTime(it.ts)}</span>
          <span class="meta-dot"></span>
          ${syncHTML}
        </div>
      </div>
      <div class="item-actions">
        <div class="mini-btn ${it.pinned?'pinned':''}" data-act="pin" title="Pin">${icHTML(it.pinned?'pinFilled':'pin')}</div>
        <div class="mini-btn" data-act="copy" title="Copy">${icHTML('copy')}<span>Copy</span></div>
        <div class="mini-btn danger" data-act="delete" title="Delete">${icHTML('trash')}</div>
      </div>
    `;

    row.querySelector('.check').onclick=(e)=>{ e.stopPropagation(); toggleSelect(it.id); };
    row.querySelectorAll('.mini-btn').forEach(b=>{
      b.onclick=(e)=>{
        e.stopPropagation();
        const act = b.dataset.act;
        if(act==='pin') togglePin(it.id);
        if(act==='copy') copyItem(it.id);
        if(act==='delete') deleteItems([it.id]);
      };
    });
    row.onclick=()=>{
      if(state.selectMode){ toggleSelect(it.id); return; }
      state.detailId = state.detailId===it.id? null : it.id;
      render();
    };
    scroll.appendChild(row);
  });
}

function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

/* ================= SELECTION ================= */
function toggleSelect(id){
  state.selectMode = true;
  if(state.selected.has(id)) state.selected.delete(id); else state.selected.add(id);
  if(state.selected.size===0) state.selectMode=false;
  render();
}
function clearSelection(){ state.selected.clear(); state.selectMode=false; render(); }

/* ================= ACTIONS ================= */
function markDirty(it){ it.updatedAt = Date.now(); it.synced = HOSTED && !accessKey ? 'local' : 'pending'; it.mutation = genId(); if(it.synced==='pending' && !state.queue.includes(it.id)) state.queue.push(it.id); }
function togglePin(id){
  const it = items.find(i=>i.id===id);
  it.pinned = !it.pinned; markDirty(it);
  toast(it.pinned? 'Pinned to top' : 'Unpinned', 'check');
  render();
  persistItems().then(render);
}
function toggleFav(id){
  const it = items.find(i=>i.id===id);
  it.fav = !it.fav; markDirty(it);
  toast(it.fav? 'Added to favorites' : 'Removed from favorites', 'check');
  render();
  persistItems().then(render);
}
async function copyItem(id){
  const it = items.find(i=>i.id===id);
  if(it.type==='file' || (it.type==='image' && !navigator.clipboard?.write)){downloadItem(it);return;}
  try{
    if(it.type==='image' && it.meta && it.meta.dataUrl && navigator.clipboard && navigator.clipboard.write){
      // Keep write() inside the user gesture; Safari accepts promised PNG data.
      const png = imageAsPNG(it.meta.dataUrl);
      await navigator.clipboard.write([new ClipboardItem({'image/png': png})]);
    } else {
      const text = it.type==='link' ? it.content : (it.type==='text'||it.type==='rich') ? it.content : it.title;
      await writeClipboard(text);
    }
    toast('Copied to clipboard', 'check');
  }catch(e){
    if(it.type==='image' || it.type==='file') downloadItem(it);
    else openComposer(it.content, true);
  }
}
function shareItem(id){
  const it = items.find(i=>i.id===id);
  const text = it.type==='link' ? it.content : it.content || it.title;
  if(navigator.share){
    navigator.share({title:it.title, text}).catch(()=>{});
  } else {
    copyItem(id);
  }
}
function deleteItems(ids){
  ids.forEach(id=>{
    const it = items.find(i=>i.id===id);
    if(it){ it.deleted = true; markDirty(it); }
  });
  ids.forEach(id=>state.selected.delete(id));
  if(state.detailId && ids.includes(state.detailId)) state.detailId=null;
  toast(ids.length>1? `Deleted ${ids.length} items` : 'Item deleted', 'trash');
  render();
  persistItems().then(render);
}

/* ================= BULK ================= */
document.getElementById('bulkPin').onclick=()=>{ [...state.selected].forEach(id=>{ const it=items.find(i=>i.id===id); it.pinned=true; markDirty(it); }); toast('Pinned selected items','check'); render(); persistItems().then(render); };
document.getElementById('bulkFav').onclick=()=>{ [...state.selected].forEach(id=>{ const it=items.find(i=>i.id===id); it.fav=true; markDirty(it); }); toast('Added to favorites','check'); render(); persistItems().then(render); };
document.getElementById('bulkCopy').onclick=async ()=>{
  const list=[...state.selected].map(id=>items.find(i=>i.id===id));
  const text = list.map(it=> it.type==='text'||it.type==='rich'||it.type==='link'? it.content : it.title).join('\n');
  try{ await writeClipboard(text); toast('Copied '+list.length+' items','check'); }
  catch(e){ openComposer(text,true); }
};
document.getElementById('bulkDelete').onclick=()=>{ deleteItems([...state.selected]); };
document.getElementById('bulkCancel').onclick=clearSelection;

document.getElementById('bulkPin').innerHTML=icHTML('pin');
document.getElementById('bulkFav').innerHTML=icHTML('star');
document.getElementById('bulkCopy').innerHTML=icHTML('copy');
document.getElementById('bulkDelete').innerHTML=icHTML('trash');

/* ================= DETAIL PANEL ================= */
function renderDetail(){
  const col = document.getElementById('detailCol');
  if(!state.detailId){ col.classList.add('hidden'); return; }
  const it = items.find(i=>i.id===state.detailId);
  if(!it || it.deleted){ state.detailId=null; col.classList.add('hidden'); return; }
  col.classList.remove('hidden');

  document.getElementById('detailHeadIcon').innerHTML = icHTML(typeIcon(it.type));
  document.getElementById('detailHeadType').textContent = {text:'Text',rich:'Rich text',image:'Image',link:'Link',file:'File'}[it.type];

  let previewHTML='';
  if(it.type==='text' || it.type==='rich'){
    previewHTML = `<div class="detail-preview text"><div class="full-text ${it.type==='text'?'mono':''}">${escapeHtml(it.content)}</div></div>`;
  } else if(it.type==='image'){
    previewHTML = it.meta && it.meta.dataUrl
      ? `<div class="detail-preview"><img src="${escapeHtml(it.meta.dataUrl)}" alt=""/></div>`
      : `<div class="detail-preview"><div class="img-mock" style="background:var(--surface-2)"></div></div>`;
  } else if(it.type==='file'){
    const colors = {pdf:'#f1685f', xlsx:'#4ade80', docx:'#7c93ff', zip:'#f2b84b'};
    previewHTML = `<div class="detail-preview"><div class="file-big"><div class="fic" style="background:${colors[it.meta.ext]||'#7c93ff'}">${icHTML('file')}</div><div style="font-size:13px;color:var(--text);font-weight:600;">${escapeHtml(it.title)}</div></div></div>`;
  } else if(it.type==='link'){
    previewHTML = `<div class="detail-preview"><div class="link-card">
      <div class="link-fav"><span class="favicon"></span>${escapeHtml(it.meta.domain)}</div>
      <div class="full-text" style="color:var(--accent);word-break:break-all;">${escapeHtml(it.content)}</div>
    </div></div>`;
  }

  const dev = deviceById(it.device);
  const scroll = document.getElementById('detailScroll');
  scroll.innerHTML = `
    ${previewHTML}
    <div class="detail-actions">
      <button class="btn btn-primary" id="daCopy">${icHTML('copy')}Copy</button>
      <button class="btn btn-ghost" id="daShare">${icHTML('share')}Share</button>
      <button class="btn btn-ghost" id="daPin">${icHTML(it.pinned?'pinFilled':'pin')}${it.pinned?'Unpin':'Pin'}</button>
      <button class="btn btn-danger-ghost" id="daDelete">${icHTML('trash')}Delete</button>
    </div>
    <div class="detail-row"><span class="k">Title</span><span class="v">${escapeHtml(it.title)}</span></div>
    <div class="detail-row"><span class="k">From device</span><span class="v">${dev.id===state.myDeviceId?'This device':escapeHtml(dev.name)}</span></div>
    <div class="detail-row"><span class="k">Copied</span><span class="v">${new Date(it.ts).toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span></div>
    <div class="detail-row"><span class="k">Favorite</span><span class="v" id="daFavToggle" style="cursor:pointer;color:${it.fav?'var(--amber)':'var(--text-dim)'}">${it.fav?'★ Favorited':'☆ Add to favorites'}</span></div>
    <div class="nav-label" style="padding-left:2px;">Connected devices</div>
    <div class="sync-list">
      ${devices.map(d=>{
        const st = deviceStatus(d);
        const ok = it.synced==='synced';
        return `<div class="sync-item"><div class="device-ic">${icHTML(deviceIcon(d.type))}<span class="dstatus ${st==='online'?'':st==='idle'?'pending':'off'}" style="position:absolute;"></span></div><div class="sync-item-name">${d.id===state.myDeviceId?'This device':escapeHtml(d.name)}</div>
          <div class="sync-badge ${ok?'ok':'wait'}">${icHTML(ok?'check':'clock')}${ok?'Will see it':'Pending'}</div></div>`;
      }).join('')}
    </div>
    <p style="font-size:11px;color:var(--text-faint);line-height:1.6;margin:10px 2px 0;">Devices pull updates roughly every ${Math.round(HEARTBEAT_MS/1000)}s, so it can take a moment to show up everywhere.</p>
  `;
  document.getElementById('daCopy').onclick=()=>copyItem(it.id);
  document.getElementById('daShare').onclick=()=>shareItem(it.id);
  document.getElementById('daPin').onclick=()=>togglePin(it.id);
  document.getElementById('daDelete').onclick=()=>deleteItems([it.id]);
  document.getElementById('daFavToggle').onclick=()=>toggleFav(it.id);
}

document.getElementById('closeDetail').innerHTML = icHTML('x');
document.getElementById('closeDetail').onclick=()=>{ state.detailId=null; document.getElementById('sidebar').classList.remove('open'); render(); };

/* ================= TOOLBAR ================= */
document.getElementById('searchIcon').innerHTML = icHTML('search');
document.getElementById('plusIcon').innerHTML = icHTML('paste');
document.getElementById('selectModeBtn').innerHTML = icHTML('select');
document.getElementById('searchInput').addEventListener('input', e=>{ state.search=e.target.value; renderList(); renderSidebar(); });
document.getElementById('selectModeBtn').onclick=()=>{
  state.selectMode = !state.selectMode;
  if(!state.selectMode) state.selected.clear();
  render();
};

/* ================= BULK BAR / OFFLINE BANNER ================= */
function renderBars(){
  const bb = document.getElementById('bulkbar');
  bb.classList.toggle('show', state.selected.size>0);
  document.getElementById('bulkCount').textContent = state.selected.size+' selected';
  document.getElementById('selectModeBtn').classList.toggle('active', state.selectMode);

  const ob = document.getElementById('offlineBanner');
  ob.classList.toggle('show', !state.online && !(HOSTED && !accessKey));
  document.getElementById('offlineBanner').querySelector('svg') || (ob.querySelector('span').innerHTML = icHTML('offline'));
  document.getElementById('queueCount').textContent = state.queue.length? state.queue.length+' queued' : '';
}

/* ================= GLOBAL SYNC STATUS ================= */
function renderGlobalStatus(){
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusText');
  const pending = items.filter(i=>i.synced==='pending').length;
  let label = 'All changes synced', kind = '';
  if(!state.ready){ label='Loading…'; kind='pending'; }
  else if(state.storageError){ label='Local save failed'; kind='off'; }
  else if(!accessKey){ label=HOSTED?'Saved on this device':'Connect to sync'; kind=HOSTED?'':'pending'; }
  else if(!state.online){ label=pending ? `Paused · ${pending} queued` : 'Sync paused'; kind='off'; }
  else if(state.syncing){ label='Syncing…'; kind='pending'; }
  else if(state.syncError){ label=state.syncError; kind='off'; }
  else if(pending){ label=`${pending} queued`; kind='pending'; }
  dot.className='status-dot '+kind;
  txt.textContent=label;
  document.getElementById('onlineLabel').textContent=HOSTED && !accessKey?'Local':state.online?'Sync on':'Paused';
  document.getElementById('onlineSwitch').classList.toggle('on',state.online);
  document.getElementById('onlineToggle').setAttribute('aria-pressed',String(state.online));
}

/* ================= ADD FROM CLIPBOARD ================= */
function urlDomain(u){ try{ return new URL(u).hostname.replace(/^www\./,''); }catch(e){ return u.slice(0,40); } }
function blobToDataURL(blob){
  return new Promise((res, rej)=>{
    const r = new FileReader();
    r.onload = ()=>res(r.result);
    r.onerror = ()=>rej(r.error);
    r.readAsDataURL(blob);
  });
}
function pushNewItem(it){
  markDirty(it);
  items.unshift(it);
  render();
  persistItems().then(render);
}
function addTextItem(text){
  if(!text.trim()) return;
  if(text.length > 1000000){ toast('Text is too large (max 1 million characters)', 'offline'); return; }
  const isLink = /^https?:\/\/\S+$/i.test(text);
  const it = {
    id:genId(),
    type: isLink? 'link':'text',
    title: isLink? urlDomain(text) : (text.split('\n')[0].slice(0,64) || 'Untitled'),
    content: text,
    device: state.myDeviceId,
    ts: Date.now(), updatedAt: Date.now(),
    pinned:false, fav:false, deleted:false,
    synced: 'pending',
    meta: isLink? {domain:urlDomain(text)} : undefined
  };
  pushNewItem(it);
  toast(HOSTED && !accessKey?'Saved on this device':state.online? 'Added — syncing…' : 'Added — queued offline', state.online?'check':'offline');
}
async function addImageItem(blob){
  if(blob.size > 2*1024*1024){
    toast('Image is too large to sync (max 2 MB)', 'offline');
    return;
  }
  const dataUrl = await blobToDataURL(blob);
  const dims = await new Promise(res=>{
    const img = new Image();
    img.onload = ()=>res(`${img.naturalWidth}×${img.naturalHeight}`);
    img.onerror = ()=>res('Image');
    img.src = dataUrl;
  });
  const it = {
    id:genId(), type:'image', title:'Pasted image',
    content:'', device:state.myDeviceId, ts:Date.now(), updatedAt:Date.now(),
    pinned:false, fav:false, deleted:false,
    synced: 'pending',
    meta:{dataUrl, dims, size:(blob.size/1024).toFixed(0)+' KB'}
  };
  pushNewItem(it);
  toast(HOSTED && !accessKey?'Image saved on this device':state.online? 'Image added — syncing…' : 'Image added — queued offline', state.online?'check':'offline');
}
async function pasteFromClipboard(){
  if(!navigator.clipboard){openComposer();return;}
  try{
    if(navigator.clipboard && navigator.clipboard.read){
      const clipItems = await navigator.clipboard.read();
      for(const ci of clipItems){
        const imgType = ci.types.find(t=>t.startsWith('image/'));
        if(imgType){ const blob = await ci.getType(imgType); await addImageItem(blob); return; }
      }
    }
  }catch(e){ /* fall through — no image, or permission not granted for images */ }
  try{
    const text = await navigator.clipboard.readText();
    if(text && text.trim()){ addTextItem(text); return; }
    toast('Your clipboard looks empty', 'offline');
  }catch(e){
    openComposer();
  }
}
document.getElementById('pasteButton').onclick=pasteFromClipboard;

// Read silently only after the browser has already granted persistent access.
// Mobile browsers on LAN HTTP cannot grant it; their Paste control remains available.
let clipboardCaptureBusy=false,lastBrowserClipboard='';
async function captureGrantedClipboard(){
  if(clipboardCaptureBusy || !state.ready || document.hidden || !document.hasFocus() || !window.isSecureContext || !navigator.clipboard?.readText)return;
  // The native tray owns Windows capture and works while the browser is closed.
  if(['localhost','127.0.0.1'].includes(location.hostname) && /Windows/i.test(navigator.userAgent))return;
  clipboardCaptureBusy=true;
  try{
    const permission=await navigator.permissions.query({name:'clipboard-read'});
    if(permission.state!=='granted')return;
    const text=await navigator.clipboard.readText();
    if(!text.trim() || text===lastBrowserClipboard)return;
    lastBrowserClipboard=text;
    if(!items.some(it=>!it.deleted && it.content===text))addTextItem(text);
  }catch{/* Browser requires a paste gesture; never interrupt with permission prompts. */}
  finally{clipboardCaptureBusy=false;}
}
window.addEventListener('focus',captureGrantedClipboard);
document.addEventListener('visibilitychange',captureGrantedClipboard);
setInterval(captureGrantedClipboard,1500);

const overlay = document.getElementById('addDeviceOverlay');
/* ================= TOASTS ================= */
function toast(msg, icon='check'){
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className='toast'+(icon==='offline'?' err':'');
  t.innerHTML = `${icHTML(icon==='offline'?'offline':icon)}<span>${escapeHtml(msg)}</span>`;
  wrap.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(8px)'; t.style.transition='.25s'; setTimeout(()=>t.remove(),250); }, 2600);
}

/* ================= MOBILE SIDEBAR ================= */
document.getElementById('menuBtn').innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
document.getElementById('menuBtn').onclick=()=>{document.getElementById('sidebar').classList.toggle('open');document.getElementById('navScrim').hidden=!document.getElementById('sidebar').classList.contains('open');};

/* ================= KEYBOARD ================= */
document.addEventListener('keydown', e=>{
  if((e.metaKey||e.ctrlKey) && e.key==='k'){ e.preventDefault(); document.getElementById('searchInput').focus(); }
  if(e.key==='Escape'){ if(overlay.classList.contains('show')) overlay.classList.remove('show'); else { state.detailId=null; render(); } }
});

/* ================= MASTER RENDER ================= */
function render(){
  renderSidebar();
  renderTabs();
  renderList();
  renderDetail();
  renderBars();
  renderGlobalStatus();
}

/* Durable local queue. IndexedDB holds images without localStorage's small quota. */
let deviceIdentity, accessKey = '', localDb, saveChain = Promise.resolve();
let syncRequested = false;
const composer = document.getElementById('composerOverlay');
function dbGet(key){
  return new Promise((resolve,reject)=>{
    const req=localDb.transaction('state').objectStore('state').get(key);
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
  });
}
function dbPut(key,value){
  return new Promise((resolve,reject)=>{
    const tx=localDb.transaction('state','readwrite');
    tx.objectStore('state').put(value,key);
    tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error);
  });
}
function saveLocal(){
  const snapshot=structuredClone({items,devices});
  const storageKey=HOSTED?'clipboard:'+(accessKey||'local'):'clipboard';
  saveChain=saveChain.catch(()=>{}).then(()=>dbPut(storageKey,snapshot));
  return saveChain.then(()=>{state.storageError=false;},()=>{
    state.storageError=true; renderGlobalStatus();
    toast('Could not save on this device. Keep this page open and free storage.', 'offline');
    throw new Error('Local storage failed');
  });
}
function mergeSync(remote, sent){
  const remoteById=new Map((state.receivePaused ? [] : remote.items).map(x=>[x.id,x]));
  const resolved=new Set([...remote.acknowledged,...remote.conflicts]);
  items=items.map(local=>{
    const other=remoteById.get(local.id);
    remoteById.delete(local.id);
    if(!other) return local;
    if(other.deleted) return other;
    if(local.synced==='pending'){
      if(resolved.has(local.mutation)) return other;
      // An edit made while this request was in flight inherits its acknowledged revision.
      if(sent.some(x=>x.id===local.id && remote.acknowledged.includes(x.mutation))) local.rev=other.rev;
      return local;
    }
    return other;
  }).concat([...remoteById.values()]);
  const mine=devices.find(x=>x.id===state.myDeviceId);
  devices=remote.devices;
  if(mine){const current=devices.find(x=>x.id===mine.id); if(current) current.name=mine.name;}
  state.queue=items.filter(x=>x.synced==='pending').map(x=>x.id);
  state.selected=new Set([...state.selected].filter(id=>items.some(x=>x.id===id && !x.deleted)));
  if(remote.conflicts.length) toast('A newer saved version was kept for a conflicting change.', 'refresh');
}
async function syncNow(){
  if(!state.ready || !state.online || !accessKey) return false;
  if(state.syncing){syncRequested=true;return false;}
  state.syncing=true; renderGlobalStatus();
  // Bound batches by byte size so several queued images can sync safely.
  const sent=[]; let bytes=0;
  for(const x of items.filter(x=>x.synced==='pending')){
    const size=new TextEncoder().encode(JSON.stringify(x)).length;
    if(sent.length>=5000 || (sent.length && bytes+size>(HOSTED?2.8:10)*1024*1024)) break;
    sent.push(structuredClone(x)); bytes+=size;
  }
  let success=false;
  try{
    const response=await fetch('/api/sync',{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+accessKey},
      body:JSON.stringify({items:sent,device:devices.find(x=>x.id===state.myDeviceId)}),
      signal:AbortSignal.timeout(15000),cache:'no-store'
    });
    if(!response.ok){
      const feedback=HOSTED?await response.json().catch(()=>({})):{};
      state.syncError=feedback.error || (response.status===403?'Device removed · pair again':response.status===401?'Access key required':response.status===507?'Server storage full':'Sync failed · retrying');
      return false;
    }
    const remote=await response.json();
    mergeSync(remote,sent);
    state.syncError='';
    await saveLocal(); success=true;
  }catch(e){state.syncError='Server unreachable · queued';}
  finally{
    state.syncing=false; render();
    if(success && (syncRequested || items.some(x=>x.synced==='pending'))) {syncRequested=false;setTimeout(syncNow,100);}
  }
  return success;
}
async function persistItems(){
  try{await saveLocal();}catch{return;}
  await syncNow();
}
async function openConnect(){
  if(HOSTED){openHostedConnect();return;}
  document.getElementById('connectionModeHint').textContent='PC mode works on the same Wi-Fi or phone hotspot. For devices on another network, open your public Vercel Clippy URL and use a shared space.';
  document.getElementById('newDeviceName').value=devices.find(x=>x.id===state.myDeviceId)?.name || '';
  document.getElementById('accessKey').value=accessKey;
  document.getElementById('connectFeedback').textContent=accessKey?'This device is connected.':'';
  overlay.classList.add('show');
  document.getElementById('hostPairing').hidden=true;
  document.getElementById('pairCodeField').hidden=!!accessKey;
  if(accessKey){
    try{
      const response=await fetch('/api/connection',{headers:{Authorization:'Bearer '+accessKey},signal:AbortSignal.timeout(5000)});
      if(response.ok){const info=await response.json();document.getElementById('hostPairing').hidden=!info.canPair;}
    }catch{document.getElementById('connectFeedback').textContent='PC unreachable. This mode needs the same Wi-Fi or hotspot; for another network use the public Vercel Clippy URL.';}
  }else document.getElementById('joinCode').focus();
}
function setupHostedUI(){
  document.getElementById('connectTitle').textContent='Connect devices';
  const form=document.getElementById('connectForm');
  const descriptions=form.querySelectorAll(':scope > .sub');
  descriptions[0].textContent='Host once, then join from any phone, tablet, or PC with a four-digit code.';
  descriptions[descriptions.length-1].textContent='Your clips sync privately across this shared space.';
  document.getElementById('hostPairing').hidden=true;document.getElementById('pairCodeField').hidden=true;document.getElementById('advancedConnection').hidden=true;
  const section=document.createElement('section');section.id='hostedSpace';
  section.innerHTML='<div class="space-choice" id="spaceChoice"><button type="button" class="btn btn-primary" id="showHost">Host a space</button><button type="button" class="btn btn-ghost" id="showJoin">Join a space</button></div><div id="hostPanel" hidden><p class="space-label">Share this code</p><output id="spaceCode" class="space-code">----</output><p class="sub">Open Clippy on another device and enter these four digits.</p><div class="hosted-actions"><button type="button" class="btn btn-ghost" id="copyInvite">Copy optional invite link</button><button type="button" class="btn btn-ghost" id="leaveSpace">Leave space</button></div></div><div id="joinPanel" hidden><div class="field"><label for="spaceInvite">Four-digit host code or invite link</label><input id="spaceInvite" inputmode="text" autocomplete="one-time-code" maxlength="1000" placeholder="0000"></div></div><input id="shareInvite" hidden>';
  form.insertBefore(section,form.querySelector('.modal-actions'));
  const confirm=document.getElementById('confirmAddDevice');
  confirm.hidden=true;
  const showMode=mode=>{document.getElementById('spaceChoice').hidden=mode==='host';document.getElementById('hostPanel').hidden=mode!=='host';document.getElementById('joinPanel').hidden=mode!=='join';confirm.hidden=mode!=='join';document.getElementById('connectFeedback').textContent='';if(mode==='join')document.getElementById('spaceInvite').focus();};
  confirm.textContent='Join space';
  document.getElementById('showHost').onclick=async()=>{
    const button=document.getElementById('showHost');button.disabled=true;
    showMode('host');
    try{const response=await fetch('/api/create-space',{method:'POST',signal:AbortSignal.timeout(15000)});const result=await response.json();if(!response.ok)throw new Error(result.error);await switchHostedSpace(result.key);document.getElementById('spaceCode').textContent=result.joinCode;document.getElementById('shareInvite').value=location.origin+'/#key='+result.key;document.getElementById('connectFeedback').textContent='Ready. Give the four digits to your other device.';}
    catch(e){document.getElementById('connectFeedback').textContent=e.message || 'Could not create a space.';}finally{button.disabled=false;}
  };
  document.getElementById('showJoin').onclick=()=>showMode('join');
  document.getElementById('leaveSpace').onclick=async()=>{try{await switchHostedSpace('');overlay.classList.remove('show');toast('Using this device’s local clipboard.');}catch(e){document.getElementById('connectFeedback').textContent=e.message;}};
  document.getElementById('copyInvite').onclick=async()=>{const input=document.getElementById('shareInvite');try{lastBrowserClipboard=input.value;await writeClipboard(input.value);toast('Invite copied.');}catch{document.getElementById('connectFeedback').textContent='Copy the link from your browser address bar.';}};
  const help=document.createElement('a');help.href='https://github.com/YumiNoona/clippy#readme';help.target='_blank';help.rel='noreferrer';help.className='shortcut-trigger';help.textContent='Help';document.querySelector('.titlebar-right').prepend(help);
}
function openHostedConnect(){
  overlay.classList.add('show');
  document.getElementById('connectionModeHint').textContent='Cloud mode works across home Wi-Fi, office networks, mobile data, Android, iPhone, tablets, and PCs. Share the host code or invite link.';
  document.getElementById('newDeviceName').value=devices.find(d=>d.id===state.myDeviceId)?.name || '';
  document.getElementById('spaceCode').textContent='----';document.getElementById('shareInvite').value=accessKey?location.origin+'/#key='+accessKey:'';
  document.getElementById('hostPanel').hidden=true;document.getElementById('joinPanel').hidden=true;document.getElementById('confirmAddDevice').hidden=true;
  document.getElementById('connectFeedback').textContent='';
}
async function switchHostedSpace(key){
  const deadline=Date.now()+5000;
  while(state.syncing && Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,100));
  if(state.syncing)throw new Error('Finishing the current sync. Try once more in a few seconds.');
  await saveLocal();
  const saved=await dbGet('clipboard:'+(key||'local'));
  await dbPut('accessKey',key);accessKey=key;
  deviceIdentity=genId();await dbPut('deviceId',deviceIdentity);state.myDeviceId=deviceIdentity;
  items=saved?.items || [];devices=saved?.devices || [];
  devices.push({...detectDevice(),lastSeen:Date.now(),updatedAt:Date.now()});
  state.search='';state.deviceFilter=null;state.filter='all';state.detailId=null;state.selected.clear();state.queue=items.filter(x=>x.synced==='pending').map(x=>x.id);
  state.syncError='';state.online=true;lastBrowserClipboard='';document.getElementById('searchInput').value='';
  await saveLocal();render();if(key)await syncNow();
}
async function joinHostedSpace(){
  const button=document.getElementById('confirmAddDevice');button.disabled=true;
  try{
    const invite=document.getElementById('spaceInvite').value.trim();let key=invite;
    if(/^\d{4}$/.test(invite)){
      const response=await fetch('/api/join-space',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:invite}),signal:AbortSignal.timeout(15000)});const result=await response.json();if(!response.ok)throw new Error(result.error);key=result.key;
    }
    if(!/^[a-f0-9]{64}$/.test(key)){const url=new URL(invite);if(url.origin!==location.origin)throw new Error('Open that invite on its original website.');key=new URLSearchParams(url.hash.slice(1)).get('key');}
    if(!/^[a-f0-9]{64}$/.test(key||''))throw new Error('Enter the four-digit code or paste a valid invite link.');
    const response=await fetch('/api/connection',{headers:{Authorization:'Bearer '+key},signal:AbortSignal.timeout(15000)});const result=await response.json();if(!response.ok)throw new Error(result.error);
    await switchHostedSpace(key);devices.find(d=>d.id===state.myDeviceId).name=document.getElementById('newDeviceName').value.trim() || detectDevice().name;
    await saveLocal();await syncNow();document.getElementById('spaceInvite').value='';overlay.classList.remove('show');toast('Joined your shared space.');
  }catch(e){document.getElementById('connectFeedback').textContent=e.message || 'Could not join the space.';}finally{button.disabled=false;}
}

// A right-click on a clip opens the same small action set as the card buttons.
const clipMenu=document.getElementById('clipContextMenu');let clipMenuId=null;
const deviceMenu=document.getElementById('deviceContextMenu');let deviceMenuId=null;
document.addEventListener('contextmenu',e=>{const row=e.target.closest('.item');if(!row)return;e.preventDefault();clipMenuId=row.dataset.id;const item=items.find(x=>x.id===clipMenuId);if(!item)return;clipMenu.querySelector('[data-context-action="pin"]').textContent=item.pinned?'Unpin':'Pin';clipMenu.hidden=false;clipMenu.style.left=Math.min(e.clientX,innerWidth-150)+'px';clipMenu.style.top=Math.min(e.clientY,innerHeight-150)+'px';});
document.addEventListener('contextmenu',e=>{const row=e.target.closest('.device-row');if(!row)return;e.preventDefault();deviceMenuId=row.dataset.deviceId;const d=devices.find(x=>x.id===deviceMenuId);if(!d)return;deviceMenu.querySelector('[data-device-action="pause"]').textContent=(d.id===state.myDeviceId&&state.receivePaused)?'Resume receiving':'Pause receiving';deviceMenu.hidden=false;deviceMenu.style.left=Math.min(e.clientX,innerWidth-170)+'px';deviceMenu.style.top=Math.min(e.clientY,innerHeight-150)+'px';});
document.addEventListener('click',async e=>{const action=e.target.closest('[data-context-action]');if(action&&clipMenuId){const fn={copy:copyItem,pin:togglePin,delete:id=>deleteItems([id])}[action.dataset.contextAction];fn?.(clipMenuId);}const da=e.target.closest('[data-device-action]');if(da&&deviceMenuId){const d=devices.find(x=>x.id===deviceMenuId);if(d){if(da.dataset.deviceAction==='rename'){const name=prompt('Device name',d.name);if(name?.trim()){d.name=name.trim();await saveLocal();render();}}else if(da.dataset.deviceAction==='pause'&&d.id===state.myDeviceId){state.receivePaused=!state.receivePaused;toast(state.receivePaused?'Receiving paused on this device.':'Receiving resumed.');render();}else if(da.dataset.deviceAction==='remove'){const btn=[...document.querySelectorAll('.remove-device')].find(x=>x.parentElement?.dataset.deviceId===deviceMenuId);btn?.click();}}}if(!e.target.closest('#clipContextMenu'))clipMenu.hidden=true;if(!e.target.closest('#deviceContextMenu'))deviceMenu.hidden=true;});
let pairingAddresses=[];
function showPairAddress(){
  const address=pairingAddresses[Number(document.getElementById('networkChoice').value)];
  if(!address)return;
  document.getElementById('pairQR').src=address.qr;
  const link=document.getElementById('pairAddress');link.href=address.url;link.textContent=address.url;
}
document.getElementById('networkChoice').onchange=showPairAddress;
document.getElementById('generatePairCode').onclick=async()=>{
  const button=document.getElementById('generatePairCode');button.disabled=true;
  document.getElementById('pairingResult').hidden=true;
  try{
    const response=await fetch('/api/pair-code',{method:'POST',headers:{Authorization:'Bearer '+accessKey},signal:AbortSignal.timeout(10000)});
    const result=await response.json();if(!response.ok)throw new Error(result.error);
    pairingAddresses=result.addresses;
    if(!pairingAddresses.length)throw new Error('Connect the PC to Wi-Fi or a phone hotspot first.');
    document.getElementById('networkChoice').replaceChildren(...pairingAddresses.map((a,i)=>{
      const option=document.createElement('option');option.value=i;option.textContent=a.name+' — '+a.url;return option;
    }));
    document.getElementById('pairDigits').textContent=result.code;
    showPairAddress();document.getElementById('pairingResult').hidden=false;
    document.getElementById('connectFeedback').textContent='Scan the QR code, or open the address on your phone and enter these six digits.';
  }catch(e){document.getElementById('connectFeedback').textContent=e.message || 'Could not create pairing code.';}
  finally{button.disabled=false;}
};
async function redeemPairCode(code){
  const response=await fetch('/api/pair',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code}),signal:AbortSignal.timeout(10000)});
  const result=await response.json();if(!response.ok)throw new Error(result.error || 'Pairing failed');
  accessKey=result.key;await dbPut('accessKey',accessKey);
  const oldId=state.myDeviceId;deviceIdentity=genId();await dbPut('deviceId',deviceIdentity);state.myDeviceId=deviceIdentity;
  devices=devices.filter(d=>d.id!==oldId);devices.push({...detectDevice(),lastSeen:Date.now(),updatedAt:Date.now()});
}
document.getElementById('openAddDevice').onclick=openConnect;
document.getElementById('connectButton').onclick=openConnect;
document.getElementById('cancelAddDevice').onclick=()=>overlay.classList.remove('show');
overlay.onclick=e=>{if(e.target===overlay)overlay.classList.remove('show');};
document.getElementById('connectForm').onsubmit=async e=>{
  e.preventDefault();
  if(HOSTED){await joinHostedSpace();return;}
  const button=document.getElementById('confirmAddDevice');button.disabled=true;
  try{
    const code=document.getElementById('joinCode').value.trim();
    if(code){await redeemPairCode(code);document.getElementById('joinCode').value='';}
    else{
      const entered=document.getElementById('accessKey').value.trim();
      if(!/^[a-f0-9]{64}$/.test(entered))throw new Error('Enter the six-digit code from the PC, or paste an existing access key under Advanced.');
      accessKey=entered;await dbPut('accessKey',accessKey);
    }
    const mine=devices.find(x=>x.id===state.myDeviceId);
    mine.name=document.getElementById('newDeviceName').value.trim() || detectDevice().name;
    state.online=true;
    const ok=await syncNow();
    document.getElementById('connectFeedback').textContent=ok?'Connected. Your clips now sync over this network.':state.syncError || 'Sync in progress. Try again shortly.';
    if(ok){toast('Connected over Wi-Fi','check');document.getElementById('pairCodeField').hidden=true;}
  }catch(e){document.getElementById('connectFeedback').textContent=e.message || 'Could not connect.';}
  finally{button.disabled=false;}
};
document.getElementById('onlineToggle').onclick=()=>{
  if(HOSTED && !accessKey){openConnect();return;}
  state.online=!state.online; render(); if(state.online) syncNow();
};
function openComposer(text='',copyOnly=false){
  document.getElementById('composerTitle').textContent=copyOnly?'Copy text manually':'Type or paste text';
  document.getElementById('composerHint').textContent=copyOnly?'Clipboard access was blocked. Select the text, then use Copy.':'Long-press in the box to paste on a phone. Line breaks are preserved.';
  const input=document.getElementById('composerText'); input.value=text;
  document.getElementById('saveNote').hidden=copyOnly;
  composer.classList.add('show'); input.focus(); if(copyOnly) input.select();
}
document.getElementById('writeNote').onclick=()=>openComposer();
document.getElementById('closeComposer').onclick=()=>composer.classList.remove('show');
composer.onclick=e=>{if(e.target===composer) composer.classList.remove('show');};
document.getElementById('composerForm').onsubmit=e=>{
  e.preventDefault();if(document.getElementById('saveNote').hidden)return;
  const text=document.getElementById('composerText').value;
  if(text.trim()){addTextItem(text);composer.classList.remove('show');}
};
async function writeClipboard(text){
  if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return;}
  // Local HTTP cannot use the modern Clipboard API. Try the legacy user-gesture
  // copy path, then offer selectable text if the browser refuses it.
  const active=document.activeElement;
  const input=document.createElement('textarea');input.value=text;input.style.cssText='position:fixed;top:0;left:0;opacity:0;font-size:16px';
  document.body.append(input);input.focus();input.select();input.setSelectionRange(0,text.length);
  let copied=false;try{copied=document.execCommand('copy');}finally{input.remove();active?.focus();}
  if(!copied)throw new Error('Select the text to copy it.');
}
function downloadItem(it){
  if(!it.meta?.dataUrl){toast('No file data is available','offline');return;}
  const a=document.createElement('a'); a.href=it.meta.dataUrl; a.download=it.type==='image'?'loop-image.png':it.title;
  document.body.append(a);a.click();a.remove();toast('Download requested','check');
}
async function imageAsPNG(dataUrl){
  const blob=await (await fetch(dataUrl)).blob();
  if(blob.type==='image/png')return blob;
  const img=await new Promise((resolve,reject)=>{
    const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=dataUrl;
  });
  const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
  canvas.getContext('2d').drawImage(img,0,0);
  return new Promise((resolve,reject)=>canvas.toBlob(x=>x?resolve(x):reject(new Error('Image conversion failed')),'image/png'));
}
document.getElementById('uploadFile').onclick=()=>document.getElementById('fileInput').click();
document.getElementById('fileInput').onchange=async e=>{
  const file=e.target.files[0];e.target.value='';if(!file)return;
  if(file.size>2*1024*1024){toast('Maximum file size is 2 MB','offline');return;}
  try{
    if(/^image\/(png|jpeg|gif|webp)$/.test(file.type)){await addImageItem(file);return;}
    pushNewItem({id:genId(),type:'file',title:file.name.slice(0,200),content:'',device:state.myDeviceId,
      ts:Date.now(),updatedAt:Date.now(),pinned:false,fav:false,deleted:false,synced:'pending',
      meta:{dataUrl:await blobToDataURL(new Blob([file],{type:'application/octet-stream'})),ext:file.name.split('.').pop().slice(0,12),size:(file.size/1024).toFixed(0)+' KB'}});
    toast('File added','check');
  }catch{toast('Could not read this file','offline');}
};
document.addEventListener('paste',e=>{
  if(e.target.closest('input,textarea,[contenteditable]'))return;
  const image=[...(e.clipboardData?.files || [])].find(x=>/^image\/(png|jpeg|gif|webp)$/.test(x.type));
  const text=e.clipboardData?.getData('text/plain');
  if(image){e.preventDefault();addImageItem(image).catch(()=>toast('Could not read image','offline'));}
  else if(text){e.preventDefault();addTextItem(text);}
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') composer.classList.remove('show');
  if(e.key==='Tab'){
    const dialog=document.querySelector('.overlay.show');if(!dialog)return;
    const focusable=[...dialog.querySelectorAll('button,input,textarea')].filter(x=>!x.hidden && !x.disabled);
    const first=focusable[0],last=focusable.at(-1);
    if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
  }
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncNow();});
window.addEventListener('online',()=>syncNow());
window.addEventListener('offline',()=>{state.syncError='Offline · changes queued';render();});
// Give the original custom controls keyboard equivalents without changing the design.
const originalRender=render;
render=function(){
  const focused=document.activeElement.closest?.('.item');
  const focusedId=focused?.dataset.id, focusedAction=document.activeElement.dataset?.act;
  const scrollTop=document.getElementById('listScroll').scrollTop;
  originalRender();
  document.getElementById('listScroll').scrollTop=scrollTop;
  document.getElementById('navScrim').hidden=!document.getElementById('sidebar').classList.contains('open');
  document.querySelectorAll('.nav-item,.tab,.device-row,.mini-btn,.item,.icon-btn,#daFavToggle').forEach(el=>{
    if(el.tagName==='BUTTON')return;
    el.tabIndex=0;el.setAttribute('role','button');
    if(el.title)el.setAttribute('aria-label',el.title);
    el.onkeydown=e=>{if(e.target===el && (e.key==='Enter'||e.key===' ')){e.preventDefault();el.click();}};
  });
  if(focusedId){const row=[...document.querySelectorAll('.item')].find(x=>x.dataset.id===focusedId);(focusedAction?row?.querySelector('[data-act="'+focusedAction+'"]'):row)?.focus({preventScroll:true});}
};
async function initialize(){
  try{
    if(HOSTED)setupHostedUI();
    localDb=await new Promise((resolve,reject)=>{
      const req=indexedDB.open('loop-clipboard',1);
      req.onupgradeneeded=()=>req.result.createObjectStore('state');
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
    deviceIdentity=await dbGet('deviceId');
    if(!deviceIdentity){deviceIdentity=genId();await dbPut('deviceId',deviceIdentity);}
    accessKey=await dbGet('accessKey') || '';
    const fragment=new URLSearchParams(location.hash.slice(1));
    const pairingCode=fragment.get('pair');
    if(pairingCode){history.replaceState(null,'',location.pathname+location.search);}
    if(!accessKey && ['localhost','127.0.0.1'].includes(location.hostname)){
      try{const response=await fetch('/api/local-session');if(response.ok){accessKey=(await response.json()).key;await dbPut('accessKey',accessKey);}}catch{}
    }
    if(/^[a-f0-9]{64}$/.test(fragment.get('key') || '')){
      accessKey=fragment.get('key');await dbPut('accessKey',accessKey);
      if(HOSTED){deviceIdentity=genId();await dbPut('deviceId',deviceIdentity);}
      history.replaceState(null,'',location.pathname+location.search);
    }
    const saved=await dbGet(HOSTED?'clipboard:'+(accessKey||'local'):'clipboard');items=saved?.items || [];devices=saved?.devices || [];
    const detected=detectDevice();state.myDeviceId=detected.id;
    if(!devices.some(x=>x.id===detected.id))devices.push({...detected,lastSeen:Date.now(),updatedAt:Date.now()});
    state.queue=items.filter(x=>x.synced==='pending').map(x=>x.id);
    state.ready=true;await saveLocal();render();
    let pairError='';
    if(pairingCode){try{await redeemPairCode(pairingCode);}catch(e){pairError=e.message;}}
    if(accessKey)await syncNow();else if(!HOSTED)await openConnect();
    if(pairError){await openConnect();document.getElementById('connectFeedback').textContent=pairError;}
    setInterval(()=>{if(!document.hidden)syncNow();},HEARTBEAT_MS);
    if('serviceWorker' in navigator && window.isSecureContext) navigator.serviceWorker.register('/sw.js').catch(()=>{});
  }catch(e){
    state.storageError=true;state.ready=true;renderGlobalStatus();
    document.getElementById('listScroll').textContent='Loop could not open browser storage. Enable site storage and reload. Use Start Loop instead of opening the HTML file directly.';
    document.querySelectorAll('button').forEach(x=>x.disabled=true);
  }
}
render();
initialize();

// Desktop shortcuts leave typing, clipboard selections, and modal input intact.
document.getElementById('shortcutHelp').onclick=()=>document.getElementById('shortcutsDialog').showModal();
document.getElementById('navScrim').onclick=()=>{document.getElementById('sidebar').classList.remove('open');document.getElementById('navScrim').hidden=true;};
document.addEventListener('keydown',e=>{
 const typing=e.target.closest('input,textarea,[contenteditable]');
 const mod=e.ctrlKey||e.metaKey;
 if(e.key==='Escape'){document.getElementById('sidebar').classList.remove('open');document.getElementById('navScrim').hidden=true;}
 if(mod && e.shiftKey && e.key.toLowerCase()==='l'){e.preventDefault();if(!document.querySelector('.overlay.show')&&!document.querySelector('dialog[open]'))openComposer();}
 if(mod && e.key==='Enter' && composer.classList.contains('show') && !document.getElementById('saveNote').hidden){e.preventDefault();document.getElementById('composerForm').requestSubmit();}
 if(typing || document.querySelector('.overlay.show,dialog[open]'))return;
 const rows=[...document.querySelectorAll('.item')],row=e.target.closest('.item');
 if((e.key==='ArrowDown'||e.key==='ArrowUp') && rows.length){e.preventDefault();const i=rows.indexOf(row),next=Math.max(0,Math.min(rows.length-1,i+(e.key==='ArrowDown'?1:-1)));rows[next].focus();}
 if(mod && e.key.toLowerCase()==='c' && row && !window.getSelection().toString()){e.preventDefault();copyItem(row.dataset.id);}
 if(e.key==='?'){e.preventDefault();document.getElementById('shortcutsDialog').showModal();}
});
