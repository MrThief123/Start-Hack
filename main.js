import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Wow Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
    <div>
      <input type="text" id="urlInput" placeholder="Enter a URL" />
      <button id="goButton">Go</button>
    </div>
  </div>
`

setupCounter(document.querySelector('#counter'))

document.querySelector('#goButton').addEventListener('click', () => {
  const url = document.querySelector('#urlInput').value
  if (url) {
    window.open(url, '_blank')
  } else {
    alert('Please enter a URL')
  }
})
