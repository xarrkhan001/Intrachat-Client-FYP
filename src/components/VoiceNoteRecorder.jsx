// VoiceNoteRecorder.js
import React, { useState, useRef } from "react";
import { IconButton, CircularProgress } from "@mui/material";
import { Mic } from "@mui/icons-material";

const VoiceNoteRecorder = ({ onAudioRecorded, isSendingAudio }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start recording audio
  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsRecording(true);
      audioChunksRef.current = []; // Reset audio chunks
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Collect audio data as it becomes available
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // When recording stops, create an audio blob and pass it to the parent
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl); // Optionally set the audio URL for preview
        onAudioRecorded(audioBlob, audioUrl); // Send the audio blob back to parent
        setIsRecording(false);
      };

      mediaRecorderRef.current.start();
    } else {
      alert("Your browser does not support audio recording.");
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <IconButton
      onMouseDown={startRecording} // Start recording on mouse down
      onMouseUp={stopRecording} // Stop recording on mouse up
      onTouchStart={startRecording} // Handle touch start (for mobile)
      onTouchEnd={stopRecording} // Handle touch end (for mobile)
      sx={{
        padding: "8px",
        backgroundColor: "#e1e1e1",
        color: "#ff5722",
        borderRadius: "50%",
        marginLeft: "8px",
      }}
    >
      {isSendingAudio ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <Mic />
      )}
    </IconButton>
  );
};

export default VoiceNoteRecorder;
