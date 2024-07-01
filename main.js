// main.js
import './style.css';
import { setupFetchAndDisplaySubtitles } from './transcript_extract.js'; // Corrected import path

document.querySelector('#app').innerHTML = `
  
    <h1>Hello!</h1>

    
    
    <div>
      <input type="text" id="urlInput" placeholder="Enter a URL" />
      <button id="goButton">Go</button>
    </div>
  </div>
`;


// Now call setupYoutubeCaptions after setting up the DOM
setupFetchAndDisplaySubtitles(document.querySelector('#goButton'), document.querySelector('#urlInput'));
