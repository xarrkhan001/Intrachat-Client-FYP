import React, { useState } from "react";
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
import { Call, CallEnd, Mic, MicOff, PersonAdd } from "@mui/icons-material";
import { AiOutlineUser } from "react-icons/ai"; // Default user icon

const AudioCallModal = ({
  open,
  onClose,
  selectedUser,
  onToggleMic,
  onAddUser,
  onAnswerCall,
  onEndCall,
  onStartCall,
  isIncomingCall,
}) => {
  const [callStatus, setCallStatus] = useState(
    isIncomingCall ? "incoming" : "calling"
  );
  const [isMuted, setIsMuted] = useState(false);

  // Handle microphone toggling
  const handleMicToggle = () => {
    setIsMuted(!isMuted);
    onToggleMic(); // Toggle microphone logic here
  };

  // Handle call actions
  const handleCallAction = () => {
    if (callStatus === "ongoing") {
      onEndCall();
      onClose(); // Close the modal immediately when the call ends
      return; // Exit here, no further action
    }

    if (callStatus === "incoming") {
      setCallStatus("ringing");
      onAnswerCall();
    } else if (callStatus === "ringing" || callStatus === "calling") {
      setCallStatus("ongoing");
      onStartCall();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Audio Call</DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {/* Profile Picture or Default Icon */}
          <Avatar
            sx={{
              width: 100,
              height: 100,
              marginBottom: 2,
              border: "3px solid #e0e0e0",
              backgroundImage: selectedUser.profilePic
                ? `url(${selectedUser.profilePic})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!selectedUser.profilePic && (
              <AiOutlineUser className="text-white text-3xl" />
            )}
          </Avatar>

          {/* Display User's Full Name */}
          <Typography variant="h6" align="center">
            {selectedUser.firstname} {selectedUser.lastname}
          </Typography>

          {/* Display Call Status */}
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
            {/* Microphone Toggle */}
            <IconButton
              onClick={handleMicToggle}
              color={isMuted ? "secondary" : "primary"}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </IconButton>

            {/* Add User Button */}
            {callStatus === "ongoing" && (
              <IconButton
                onClick={onAddUser}
                color="primary"
                sx={{ marginLeft: 2 }}
              >
                <PersonAdd />
              </IconButton>
            )}

            {/* Call Action Button (Answer / Start / End Call) */}
            <IconButton
              onClick={handleCallAction}
              color={
                callStatus === "incoming" || callStatus === "ringing"
                  ? "success"
                  : "error"
              }
              sx={{ marginLeft: 2 }}
            >
              {callStatus === "incoming" || callStatus === "ringing" ? (
                <Call />
              ) : (
                <CallEnd />
              )}
            </IconButton>
          </Box>

          {/* Call Action Button - Start Call */}
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
        </Box>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default AudioCallModal;
