from youtube_transcript_api import YouTubeTranscriptApi

# pip install youtube-transcript-api

transcipt = ''

for line in YouTubeTranscriptApi.get_transcript('lkbV8oP-F44a'):
    transcipt += line['text'] + ' '
print(transcipt)