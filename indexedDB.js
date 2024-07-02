// indexedDB.js

const DB_NAME = 'videoFeedbackDB';
const DB_VERSION = 1;
let db;

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Failed to open database:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const store = db.createObjectStore('videos', { keyPath: 'id', autoIncrement: true });
      store.createIndex('url', 'url', { unique: true });
    };
  });
}

export function saveVideoDetails(db, videoDetails) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['videos'], 'readwrite');
    const store = transaction.objectStore('videos');
    
    const request = store.add(videoDetails);
    
    request.onsuccess = () => {
      console.log('Video details saved successfully');
      resolve();
    };
    
    request.onerror = (event) => {
      console.error('Error saving video details:', event.target.error);
      reject(event.target.error);
    };
  });
}

export function getAllVideos(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['videos'], 'readonly');
    const store = transaction.objectStore('videos');
    
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = (event) => {
      console.error('Error fetching videos:', event.target.error);
      reject(event.target.error);
    };
  });
}
