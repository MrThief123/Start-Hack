// indexedDB.js

export function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('videoDB', 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('videos', { keyPath: 'url' });
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
  
  export function saveVideoDetails(db, videoDetails) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('videos', 'readwrite');
      const objectStore = transaction.objectStore('videos');
      const request = objectStore.put(videoDetails);
  
      request.onsuccess = () => {
        resolve();
      };
  
      request.onerror = () => {
        reject();
      };
    });
  }
  
  export function getAllVideos(db) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('videos', 'readonly');
      const objectStore = transaction.objectStore('videos');
      const request = objectStore.getAll();
  
      request.onsuccess = () => {
        resolve(request.result);
      };
  
      request.onerror = () => {
        reject();
      };
    });
  }
  
  export function clearDatabase(db) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('videos', 'readwrite');
      const objectStore = transaction.objectStore('videos');
      const clearRequest = objectStore.clear();
  
      clearRequest.onsuccess = () => {
        console.log('Database cleared');
        resolve();
      };
  
      clearRequest.onerror = () => {
        console.error('Error clearing database');
        reject();
      };
    });
  }
  