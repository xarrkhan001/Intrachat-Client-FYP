import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import {
  Videocam,
  VideocamOff,
  CallEnd,
  Mic,
  MicOff,
} from "@mui/icons-material";
import { AiOutlineUser } from "react-icons/ai"; // Default user icon
import AgoraRTC from "agora-rtc-sdk-ng"; // Correct import for Agora

const appId = "af4a7e4a57d7491ca447fc9ec97e8899"; // Replace with your Agora App ID
const channelName = "videoCall"; // Channel name for video call
const token = null; // Token for the channel (can be null for testing, use token in production)

const VideoCallModal = ({
  open,
  onClose,
  selectedUser,
  isIncomingCall,
  isCallAccepted,
  onAddUser,
  onStartCall,
  onEndCall,
  onAnswerCall,
  onRejectCall,
}) => {
  const client = useRef(null); // Agora client
  const localVideoTrack = useRef(null); // Local video track
  const remoteVideoTrack = useRef(null); // Remote video track
  const [callStatus, setCallStatus] = useState(
    isIncomingCall ? "incoming" : "calling"
  );
  const [isLocalVideoOn, setIsLocalVideoOn] = useState(true);
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(false); // Remote video initially off
  const [isMuted, setIsMuted] = useState(false); // Microphone mute state
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    if (open) {
      // Initialize Agora client when modal is open
      client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      // Handle incoming call and events
      client.current.on("user-published", handleUserPublished);
      client.current.on("user-unpublished", handleUserUnpublished);

      // Start Agora call if not already started
      if (!isCallAccepted) {
        startAgora();
      }

      return () => {
        // Cleanup on component unmount
        if (client.current) {
          client.current.leave();
          localVideoTrack.current.stop();
          localVideoTrack.current.close();
        }
      };
    }
  }, [open, isCallAccepted]); // This ensures the Agora client starts only when the modal is open and call is not accepted

  const startAgora = async () => {
    try {
      // Create local tracks (video and audio)
      const [videoTrack, audioTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks();
      localVideoTrack.current = videoTrack;
      // Display local stream in the local video container
      videoTrack.play("local-stream"); // Ensure this id is the same as in the div

      // Join the channel
      await client.current.join(appId, channelName, token, null);

      // Publish the local tracks to the Agora channel
      await client.current.publish([videoTrack, audioTrack]);

      setLocalStream(videoTrack); // Store the local video track
    } catch (error) {
      console.error("Error starting Agora:", error);
    }
  };

  const handleUserPublished = (user, mediaType) => {
    // Subscribe to the remote user's stream
    client.current.subscribe(user, mediaType).then(() => {
      if (mediaType === "video") {
        remoteVideoTrack.current = user.videoTrack;
        // Play the remote stream in the remote video container
        remoteVideoTrack.current.play("remote-stream");
        setRemoteStream(user.videoTrack); // Set the remote stream
        setIsRemoteVideoOn(true); // Set remote video on
      }
    });
  };

  const handleUserUnpublished = (user) => {
    // Stop playing remote video stream if the user leaves
    remoteVideoTrack.current.stop();
    remoteVideoTrack.current.close();
    setIsRemoteVideoOn(false); // Set remote video off
  };

  const toggleLocalVideo = () => {
    // Toggle the local video on/off
    if (localVideoTrack.current) {
      localVideoTrack.current.setEnabled(!isLocalVideoOn);
      setIsLocalVideoOn(!isLocalVideoOn);
    }
  };

  const handleMicToggle = () => {
    // Toggle the microphone mute/unmute
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = !isMuted;
          setIsMuted(!isMuted);
        }
      });
    }
  };

  const handleEndCall = () => {
    // Leave the call and clean up
    client.current.leave();
    localVideoTrack.current.stop();
    localVideoTrack.current.close();
    onClose();
  };

  const handleRejectCall = () => {
    // Handle rejecting the call
    if (onRejectCall) onRejectCall();
    onClose();
  };

  const handleIncomingCallAction = (action) => {
    if (action === "accept") {
      setCallStatus("ongoing");
      if (onAnswerCall) onAnswerCall();
    } else {
      handleRejectCall();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Video Call</DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {/* Local and remote video streams */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ gap: 2, marginBottom: 2 }}
          >
            <Box
              sx={{
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                overflow: "hidden",
                border: "2px solid #e0e0e0",
              }}
            >
              {isRemoteVideoOn ? (
                <div
                  id="remote-stream"
                  style={{ width: "100%", height: "100%" }}
                ></div>
              ) : (
                <Avatar
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  <Typography variant="h3" color="primary">
                    {selectedUser.firstname[0]}
                  </Typography>
                </Avatar>
              )}
            </Box>

            <Box
              sx={{
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                overflow: "hidden",
                border: "2px solid #e0e0e0",
              }}
            >
              {isLocalVideoOn ? (
                <div
                  id="local-stream"
                  style={{ width: "100%", height: "100%" }}
                ></div>
              ) : (
                <Avatar
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  <AiOutlineUser className="text-white text-3xl" />
                </Avatar>
              )}
            </Box>
          </Box>

          {/* Call status */}
          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            mt={1}
          >
            {callStatus === "incoming"
              ? "Incoming Call..."
              : callStatus === "ringing"
              ? "Ringing..."
              : callStatus === "calling"
              ? "Calling..."
              : "Ongoing Call"}
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={3}
          >
            {/* Microphone toggle */}
            <IconButton
              onClick={handleMicToggle}
              color={isMuted ? "secondary" : "primary"}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </IconButton>

            {/* Video toggle */}
            <IconButton
              onClick={toggleLocalVideo}
              color="primary"
              sx={{ marginLeft: 2 }}
            >
              {isLocalVideoOn ? <VideocamOff /> : <Videocam />}
            </IconButton>

            {/* End call button */}
            <IconButton
              onClick={handleEndCall}
              color="error"
              sx={{ marginLeft: 2 }}
            >
              <CallEnd />
            </IconButton>
          </Box>

          {/* Incoming call buttons (accept/reject) */}
          {callStatus === "incoming" && (
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="success"
                onClick={() => handleIncomingCallAction("accept")}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleIncomingCallAction("reject")}
                sx={{ marginLeft: 2 }}
              >
                Reject
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;
