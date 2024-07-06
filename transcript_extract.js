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



      //make gtp figure out
      let lectureDelivery = 8;
      let engagement = 7;
      let clarity = 1;
      let overall = 9;
      let feedback = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        
        <div>
            <h3>What You Did Well:</h3>
            <ul>
                <li>You provided a clear structure by recapping previous lectures and introducing the main topics for the current lecture.</li>
                <li>Your tone is conversational and approachable, which can make complex topics more accessible to students.</li>
            </ul>
        </div>
        
        <div>
            <h3>Suggestions for Improvement:</h3>
            <p>Rating: ★★★★☆ (4/5)</p>
            <ul>
                <li>While your tone is engaging, consider varying your pitch and pace more to emphasize key points and maintain student interest.</li>
                <li>Transitions: Use smoother transitions between topics to help students follow the flow of the lecture. For example, when moving from the topic of justice to specific questions like taxation or immigration, clearly signal this shift and explain the connection.</li>
            </ul>
        </div>
    </div>

    <div>
        <h2>Engagement</h2>

        <div>
            <h3>What You Did Well:</h3>
            <ul>
                <li>You ask rhetorical questions and invite students to think about their own intuitions, which helps engage them.</li>
                <li>You relate abstract concepts to real-world issues (e.g., taxation, healthcare, employment contracts).</li>
            </ul>
        </div>

        <div>
            <h3>Suggestions for Improvement:</h3>
            <p>Rating: ★★★★☆ (4/5)</p>
            <ul>
                <li>Increase student interaction by incorporating more direct questions and opportunities for discussion. For example, pause after introducing a new concept and ask for their thoughts or examples.</li>
                <li>Interactive Elements: Use more interactive elements such as quick polls, think-pair-share activities, or short group discussions to break up the lecture and make it more dynamic.</li>
            </ul>
        </div>
    </div>

    <div>
        <h2>Explanation and Examples</h2>

        <div>
            <h3>What You Did Well:</h3>
            <ul>
                <li>You effectively introduce complex philosophical ideas and provide clear definitions.</li>
                <li>You use practical examples to illustrate abstract concepts, which helps students understand the relevance of these theories.</li>
            </ul>
        </div>

        <div>
            <h3>Suggestions for Improvement:</h3>
            <p>Rating: ★★★★☆ (4/5)</p>
            <ul>
                <li>While your explanations are clear, try to simplify some of the jargon and provide more concrete examples. For instance, when discussing Rawls’ idea of the "veil of ignorance," give a detailed, step-by-step example of how it might be applied to a real-world policy decision.</li>
                <li>Analogies and Metaphors: Incorporate more analogies and metaphors to make abstract concepts more relatable. For example, compare the "veil of ignorance" to a situation where students have to make rules for a game without knowing their role in it.</li>
            </ul>
        </div>
    </div>

    <div>
        <h2>Depth and Breadth</h2>

        <div>
            <h3>What You Did Well:</h3>
            <ul>
                <li>You cover a broad range of topics and provide a comprehensive overview of the theories of justice and utilitarianism.</li>
                <li>You mention criticisms and alternative perspectives, which enriches the discussion.</li>
            </ul>
        </div>

        <div>
            <h3>Suggestions for Improvement:</h3>
            <p>Rating: ★★★★☆ (4/5)</p>
            <ul>
                <li>Provide more depth in certain areas by elaborating on key points. For example, delve deeper into Rawls' two principles of justice and how they contrast with utilitarian views.</li>
                <li>Case Studies: Use more detailed case studies to illustrate points. For example, discuss a specific tax policy or healthcare decision and analyze it from both a utilitarian and Rawlsian perspective.</li>
            </ul>
        </div>
    </div>

    <div>
        <h2>Content Specific Feedback</h2>

        <div>
            <h3>Utilitarianism</h3>

            <div>
                <h4>What You Did Well:</h4>
                <ul>
                    <li>You clearly explain the basic premise of utilitarianism and why it is intuitively appealing.</li>
                </ul>
            </div>

            <div>
                <h4>Suggestions for Improvement:</h4>
                <p>Rating: ★★★★☆ (4/5)</p>
                <ul>
                    <li>Discuss common criticisms of utilitarianism in more detail and provide examples of how these criticisms manifest in real-world scenarios. For instance, explore the potential issues with utilitarian approaches to healthcare prioritization.</li>
                </ul>
            </div>
        </div>

        <div>
            <h3>Rawls’ Theory of Justice</h3>

            <div>
                <h4>What You Did Well:</h4>
                <ul>
                    <li>You provide a good introduction to Rawls' ideas and their significance in political philosophy.</li>
                </ul>
            </div>

            <div>
                <h4>Suggestions for Improvement:</h4>
                <p>Rating: ★★★★☆ (4/5)</p>
                <ul>
                    <li>Spend more time explaining key concepts such as the "original position" and the "difference principle." Use diagrams or visual aids to help students visualize these abstract ideas.</li>
                    <li>Real-World Applications: Highlight more real-world applications of Rawls’ principles. For example, discuss how his theory might influence modern debates on income inequality or educational reform.</li>
                </ul>
            </div>
        </div>
    </div>

    <div>
        <h2>Overall Feedback</h2>

        <div>
            <h3>Strengths:</h3>
            <ul>
                <li>Engaging and approachable tone.</li>
                <li>Clear structure and logical flow.</li>
                <li>Effective use of real-world examples.</li>
            </ul>
        </div>

        <div>
            <h3>Areas for Improvement:</h3>
            <ul>
                <li>Increase student interaction and engagement through more direct questions and interactive elements.</li>
                <li>Simplify jargon and provide more concrete examples and analogies.</li>
                <li>Offer deeper explanations of key concepts and incorporate more detailed case studies.</li>
            </ul>
            <p>Overall Rating: ★★★★☆ (4/5)</p>
        </div>
    </div>

</body>
</html>
`;

      

      console.log(transcriptText)

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
