# Importing necessary libraries for the application
import streamlit as st
import openai
from model import save_video, save_audio, audio_to_transcript, text_to_prompt
import ssl
ssl._create_default_https_context = ssl._create_stdlib_context
# Extracting the API key from Streamlit secrets for secure API access
API_KEY = st.secrets['OPENAI_API_KEY']
# Configuring the OpenAI API key to enable API requests

# Setting the Streamlit page configuration including the page title and layout
st.set_page_config(page_title="Lecture Feedback Tool", page_icon="📼", layout="wide")

# Displaying the main header with a bold title and a description to inform users about the functionality of the tool
st.markdown(
    '<p style="display:inline-block;font-size:40px;font-weight:bold;">Lecture Feedback Tool</p> <p style="display:inline-block;font-size:16px;">Utilizing OpenAI&#39;s Whisper model for converting lecture videos to transcripts and GPT-3 for generating personalized feedback based on the content<br><br></p>',
    unsafe_allow_html=True
)

# Input field for the user to provide the URL of the lecture video they want to process
lecture_url = st.text_input('Enter the URL of the Lecture Video:')

if lecture_url is not None:
    if st.button("Generate Feedback"):
        # Creating a three-column layout to display the video, its transcription, and the generated feedback
        video_col, transcript_col, summary_col = st.columns([1, 1, 1])
        
        # Displaying the uploaded lecture video in the first column
        with video_col:
            st.info("Lecture successfully uploaded")
            processing_msg = "Processing may take a few moments..."
            st.text(processing_msg)
            video_file = save_video(lecture_url)
            st.video(video_file)
        
        # Displaying the transcription of the video in the second column
        with transcript_col:
            st.info("Transcription of the Lecture:")
            save_audio(lecture_url, ".", "audio")
            transcript_text = audio_to_transcript()
            # Enclosing the transcription text in a scrollable div for better readability
            st.markdown(f"<div style='height: 200px; overflow-y: scroll;'>{transcript_text}</div>", unsafe_allow_html=True)
        
        # Displaying the summarized feedback based on the transcription in the third column
        with summary_col:
            st.info("Generated Feedback")
            feedback_text = text_to_prompt(transcript_text)
            st.success(feedback_text)

# CSS styling to hide Streamlit's default header, footer, and menu for a cleaner interface
hide_elements_style = """
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    </style>
"""

# Applying the CSS styling to hide the specified elements
st.markdown(hide_elements_style, unsafe_allow_html=True)
