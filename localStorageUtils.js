// localStorageUtils.js

// Function to save current video details to localStorage
export function saveVideoDetailsToLocalStorage(videoDetails) {
    localStorage.setItem('currentVideoDetails', JSON.stringify(videoDetails));
  }
  
  // Function to get current video details from localStorage
  export function getVideoDetailsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('currentVideoDetails'));
  }
  
  // Function to save recent videos to localStorage
  export function saveRecentVideosToLocalStorage(recentVideos) {
    localStorage.setItem('recentVideos', JSON.stringify(recentVideos));
  }
  
  // Function to get recent videos from localStorage
  export function getRecentVideosFromLocalStorage() {
    return JSON.parse(localStorage.getItem('recentVideos')) || [];
  }
  