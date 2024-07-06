# Importing necessary libraries for the script
import streamlit as st
import whisper
import os
import openai
from pytube import YouTube
openai.api_key = st.secrets["OPENAI_API_KEY"]
@st.cache_resource
def load_model():
    # Loading the Whisper model for speech recognition which will be used to transcribe audio to text
    model = whisper.load_model("base")
    return model

def save_video(url):
    # Function to download a YouTube video from the provided URL
    youtube_obj = YouTube(url)
    youtube_obj = youtube_obj.streams.get_highest_resolution()
    try:
        video_path = youtube_obj.download()
    except:
        print("An error has occurred")
    print("Download completed successfully")
    
    # Rename and move the downloaded video file to a consistent filename
    if os.path.exists("video.mp4"):
        os.remove("video.mp4")

    base_name, ext = os.path.splitext(video_path)
    old_name = base_name + ext
    new_name = "video.mp4"
    os.rename(old_name, new_name)
    return new_name

def save_audio(url, destination, file_name):
    # Downloading the audio track from the YouTube video specified by the URL
    if os.path.exists("audio.mp3"):
        os.remove("audio.mp3")
        
    video = YouTube(url)
    audio = video.streams.filter(only_audio=True).first()
    output_path = audio.download(output_path=".")
    new_file_name = file_name + '.mp3'
    os.rename(output_path, new_file_name)

def audio_to_transcript():
    # Transcribing the audio file to text using the Whisper model
    model = load_model()
    result = model.transcribe("audio.mp3")
    transcript = result["text"]
    return transcript
# TODO:LEGACY USED FROM A PREVIOUS ITERATION OF TREHIVE, USING THE LEGACY 0.28 VERSION OF THE OPENAI MODULE
def text_to_prompt(query):
    # Generating detailed feedback using OpenAI's GPT-3 model based on the provided transcription
    response = openai.Completion.create(
        model="gpt-3.5-turbo-instruct",
        prompt=(
            "I am a lecturer at the University of Melbourne. I want you to thoroughly analyze my portion of the transcription "
            "from the lecture and provide detailed feedback on how I can improve the delivery, tone, explanation, and examples "
            "to better help the students understand and grasp the topic and also improve engagement if possible. Also, provide "
            "detailed feedback on things I did well and should continue to do. Be as specific as possible with all feedback and "
            "include lots of detail. Provide feedback as you deem fit. Also, give a numerical rating out of 5 stars. Use the Star emojis to show the rating. Make sure to use nice formatting to make the text look clean. " + query
        ),
        temperature=0.7,
        max_tokens=600,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    return response['choices'][0]['text']
