const V='ac-shell-v1',SHELL=['./','index.html','logo.png','favicon.png','icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.hostname==='api.github.com')return; // data always live
  if(u.origin===location.origin||u.hostname.includes('fonts.g')){
    e.respondWith(caches.open(V).then(c=>c.match(r).then(hit=>{
      const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>hit);
      return hit||net;
    })));
  }
});
