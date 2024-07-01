import sys
from youtube_transcript_api import YouTubeTranscriptApi

def get_youtube_transcript(video_id):
    try:
        transcript = ''
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        for line in transcript_list:
            transcript += line['text'] + ' '
        return transcript.strip()  # Strip any leading or trailing whitespace
    except Exception as e:
        return f"Error retrieving transcript: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide the video ID as an argument.")
        sys.exit(1)
    
    video_id = sys.argv[1]
    print(get_youtube_transcript(video_id))
