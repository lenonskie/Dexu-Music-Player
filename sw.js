self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>self.clients.claim());
// DEXU Music Player - FIXED for background playback and lock screen next/prev
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = req.url.toLowerCase();
  // CRITICAL: Never intercept audio/video for background playback to work
  if(
    url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg') || 
    url.includes('.m4a') || url.includes('.flac') || url.includes('.aac') ||
    req.destination === 'audio' || req.destination === 'video'
  ){
    return;
  }
  // For other assets, try network first
  event.respondWith(
    fetch(req).then(res=>{
      // Cache html/css/js for offline
      if(req.method==='GET' && res.status===200){
        const clone = res.clone();
        caches.open('dexu-v2').then(cache=>cache.put(req, clone));
      }
      return res;
    }).catch(()=> caches.match(req))
  );
});
