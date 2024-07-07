// transcript_extract.js

// Import functions from other modules
import { openDatabase, saveVideoDetails, getAllVideos } from './indexedDB.js';
import { updateRecentVideosTable } from './main.js';



// Function to set up fetching and displaying subtitles
export function setupFetchAndDisplaySubtitles(goButton, urlInput, recentVideosTableBody, db, updateRecentVideos) {
  goButton.addEventListener('click', async () => {
    const videoUrl = urlInput.value.trim(); // Get and trim the video URL from the input

    try {
      const response = await fetch(`http://localhost:3003/fetchTranscript?url=${encodeURIComponent(videoUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }

      // Decode HTML entities in the fetched transcript text
      let encodedText = await response.text();
      let transcriptText = encodedText.replace(/&amp;#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
      console.log('Transcript:', transcriptText);

      const videoTitle = await getVideoTitle(videoUrl); // Fetch video title
      console.log('Video Title:', videoTitle);

      const currentDate = new Date().toLocaleDateString(); // Get the current date

      let input = `
giving ratings out of 10 for lecture delievery, engagment clairty and overal. I want you to thoroughly analyse my portion of the transcription from the lecture and provide detailed feedback on how I can improve the delivery, tone, explanation, and examples to better help the students understand and grasp the topic and also improve engagement if possible. Also provide detailed feedback on this I did well and should continue to do. be as specific as possible with all feedback and include lots of detail. Provide feedback as you deem fit. Also give a numerical rating out of 10    
 You are strict and critical and are not scared to admit my when the lecture or delivery is subpar.  Rate the transcript from my lecture out of 10 Do not be scared to give low ratingsif the lecture is bad. Do not always assume that all learners sitting the lecture are beginners:
output the feedback as html in the template given below make sure to fill out everything. If for example there isnt anythign for for a section  leave it blank. ALWAYS leave a rating where it says rating  out of /10 but do not change the format of the ratings part
<title>Detailed Feedback on Your Lecture</title>
    <style>
        body {
            font-family: 'Source Sans Pro Light', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
            color: #fff; /* Set text color to white */
            background-color: #1a1a1a;
            padding: 20px;
            margin: 0;
        }
        h2, h3, h4 {
            color: #fff; /* Set headings to white */
        }
        ul, p {
            color: #fff; /* Set paragraphs and lists to white */
        }
    </style>
</head>
<body>
    <h2>Detailed Feedback on Your Lecture</h2>

    <div>
        <h2>Delivery and Tone</h2>
        <p>Rating: /10</p>
        <div>
            <h3>What You Did Well:</h3>
            <ul>
            </ul>
        </div>
        
        <div>
            <h3>Suggestions for Improvement:</h3>
            
            <ul>
                <li></li>
            </ul>
        </div>
        <h2></h2>
    </div>

    (same for engagment then clarity)

    <div>
        <h2>Explanation and Examples</h2>
        <p>Rating: /10</p> 
        <div>
            <h3>What You Did Well:</h3>
            <ul>
            </ul>
        </div>

        <div>
            <h3>Suggestions for Improvement:</h3>
            
            <ul>
            </ul>
        </div>
        <h2></h2>
    </div>


    <div>
        <h2>Content Specific Feedback</h2>
        <p>Rating: /10</p>
        <div>
            <h3>topic1</h3> (use a maximum of 3 topics)

            <div>
                <h4>What You Did Well:</h4>
                <ul>
                </ul>
            </div>

            <div>
                <h4>Suggestions for Improvement:</h4>
                
                <ul>
                </ul>
            </div>
        </div>
        <h2></h2>

    </div>

    <div>
        <h2>Overall Feedback</h2>

        <div>
            <h3>Strengths:</h3>
            <ul>
            </ul>
        </div>

        <div>
            <h3>Areas for Improvement:</h3>
            <ul>
            </ul>
            <p>Overall Rating: /10</p>
        </div>
    </div>

</body>
`;
      // Parse the HTML string
// Parse the HTML string

    let feedback = await textToPrompt(transcriptText + input);
    console.log(feedback)
    var el = document.createElement( 'html' );
    el.innerHTML = feedback;

    var ratings = el.getElementsByTagName('p');
    var ratingList = [];

    const scoreRegex = /Rating: (\d+(\.\d+)?)/;
    
    for (let i = 0; i < ratings.length; i++) {
        const text = ratings[i].textContent.trim();
        const match = text.match(scoreRegex);
    
        if (match) {
            const score = parseFloat(match[1]);
            ratingList.push(score);
        } else {
            console.log(`No match found for element ${i}: "${text}"`);
        }
    }

    
    let overall = parseFloat(ratingList[ratingList.length - 1]);
    let lectureDelivery = parseFloat(ratingList[0]);
    let clarity = parseFloat(ratingList[2]);
    let engagement = parseFloat(ratingList[1]);
    

    



     console.log(ratingList)

      // Create an object to store video details
      const videoDetails = {
        url: videoUrl,
        title: videoTitle,
        date: currentDate,
        lectureDelivery: lectureDelivery,
        engagement: engagement,
        clarity: clarity,
        overall: overall,
        //transcript: transcriptText,
        feedback: feedback 
      };

      await saveVideoDetails(db, videoDetails); // Save video details to IndexedDB

      // Fetch all videos from IndexedDB after saving the new video
      const recentVideos = await getAllVideos(db);
      updateRecentVideos(recentVideosTableBody, recentVideos); // Update the table with all videos

    } catch (error) {
      console.error('Error fetching transcript:', error); // Log any errors
    }
  });
}

// Function to fetch the video title from YouTube API
async function getVideoTitle(videoUrl) {
  try {
    const videoId = getVideoIdFromUrl(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const apiKey = 'AIzaSyD6nrtMBXfiBptdNJx9hZznN3UGCR6-boY'; // Replace with your YouTube Data API key
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();
    const videoTitle = data.items[0].snippet.title; // Extract video title from response data
    return videoTitle;
  } catch (error) {
    console.error('Error fetching video title:', error); // Log any errors
    return 'Video Title'; // Fallback title or error handling
  }
}

// Function to extract video ID from the YouTube URL
function getVideoIdFromUrl(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null; // Return video ID if found, otherwise null
}


async function textToPrompt(message) {
    const apiKey = 'sk-proj-hxBaD11hz4kLiZEPWwniT3BlbkFJ9613fGK0er83TTWOQLPN'; // Replace with your OpenAI API key
    const model = 'gpt-4o'; // Specify GPT-3.5 model name
    
    // Construct the endpoint URL for chat completions
    const endpoint = `https://api.openai.com/v1/chat/completions`;
    
    // Make a POST request to the chat endpoint
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        })
    });

    // Handle errors if the response is not OK
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    // Parse the JSON response
    const responseData = await response.json();
    
    // Extract and trim the text from the model's response
    const gptResponse = responseData.choices[0].message.content.trim();
    
    // Return the trimmed response text
    return gptResponse;
}






