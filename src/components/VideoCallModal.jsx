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

const signalingServer = "ws://localhost:5000"; // Replace with your signaling server URL

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
  const [callStatus, setCallStatus] = useState(
    isIncomingCall ? "incoming" : "calling"
  );
  const [isLocalVideoOn, setIsLocalVideoOn] = useState(true);
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(false); // Remote video initially off
  const [isMuted, setIsMuted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(signalingServer);

    socketRef.current.onopen = () => {
      console.log("Connected to signaling server");
    };

    socketRef.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "offer") {
        await handleOffer(data.offer);
      } else if (data.type === "answer") {
        await handleAnswer(data.answer);
      } else if (data.type === "candidate") {
        await handleNewICECandidate(data.candidate);
      } else if (data.type === "call-rejected") {
        onRejectCall(); // Handle rejection
      }
    };

    startLocalStream();

    return () => {
      socketRef.current.close();
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const handleOffer = async (offer) => {
    peerConnectionRef.current = new RTCPeerConnection();
    localStream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStream);
    });

    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socketRef.current.send(
      JSON.stringify({
        type: "answer",
        answer: answer,
      })
    );

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.send(
          JSON.stringify({
            type: "candidate",
            candidate: event.candidate,
          })
        );
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      setIsRemoteVideoOn(true); // Turn on remote video once track is added
    };
  };

  const handleAnswer = async (answer) => {
    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const handleNewICECandidate = (candidate) => {
    const iceCandidate = new RTCIceCandidate(candidate);
    peerConnectionRef.current.addIceCandidate(iceCandidate);
  };

  const toggleLocalVideo = () => {
    setIsLocalVideoOn(!isLocalVideoOn);
  };

  const handleMicToggle = () => {
    setIsMuted(!isMuted);
    localStream.getTracks().forEach((track) => {
      if (track.kind === "audio") {
        track.enabled = !track.enabled;
      }
    });
  };

  const handleCallAction = () => {
    if (callStatus === "calling") {
      setCallStatus("ringing");
      if (onStartCall) onStartCall(); // Ensure function is passed correctly
    } else {
      setCallStatus("ended");
      if (onEndCall) onEndCall(); // Ensure function is passed correctly
      onClose();
    }
  };

  const handleEndCall = () => {
    peerConnectionRef.current.close();
    if (onEndCall) onEndCall(); // Ensure function is passed correctly
    onClose();
  };

  const handleRejectCall = () => {
    socketRef.current.send(
      JSON.stringify({
        type: "call-rejected",
      })
    );
    if (onRejectCall) onRejectCall(); // Ensure function is passed correctly
    onClose();
  };

  const handleIncomingCallAction = (action) => {
    if (action === "accept") {
      setCallStatus("ongoing");
      if (onAnswerCall) onAnswerCall(); // Ensure function is passed correctly
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
          {/* Video streams */}
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
                <video
                  autoPlay
                  ref={(video) => {
                    if (video && remoteStream) {
                      video.srcObject = remoteStream;
                    }
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
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
                <video
                  autoPlay
                  muted
                  ref={(video) => {
                    if (video && localStream) {
                      video.srcObject = localStream;
                    }
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
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

          {/* Start / End call button */}
          {callStatus === "calling" && (
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="success"
                onClick={handleCallAction}
              >
                Start Call
              </Button>
            </Box>
          )}

          {/* Incoming call buttons (answer / reject) */}
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
