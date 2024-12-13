import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  InputBase,
  Paper,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";
import { Send, Person, AttachFile, EmojiEmotions } from "@mui/icons-material";
import { Picker } from "emoji-mart-next";
import "emoji-mart-next/css/emoji-mart.css";
import VoiceNoteRecorder from "./VoiceNoteRecorder"; // Import the new component
import AudioCallModal from "./AudioCallModal"; // Import the AudioCallModal component
import VideoCallModal from "./VideoCallModal"; // Import the VideoCallModal component
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Call as CallIcon,
  VideoCall as VideoCallIcon,
  Menu as RightSidebarIcon,
} from "@mui/icons-material";
import RightSideBar from "./RightSideBar"; // Import the RightSideBar component
import axios from "axios";

const ChatField = ({ selectedUser, onBack, user }) => {
  const currentUser = localStorage.getItem("userId");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null); // State for last message
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSendingAudio, setIsSendingAudio] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const inputFileRef = useRef(null);

  // Modal state for Audio and Video calls
  const [audioCallOpen, setAudioCallOpen] = useState(false);
  const [videoCallOpen, setVideoCallOpen] = useState(false);

  // Right Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch stored messages for the selected user
  const getAllMessage = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/${currentUser}/${user._id}`
      );

      setMessages(response?.data?.data);

      // Show a toast notification only for the last message if not already shown
      if (response?.data?.data?.length) {
        const latestMessage =
          response?.data?.data[response?.data?.data.length - 1];

        // Check if this message has already been shown
        if (latestMessage.content !== lastShownMessageRef.current) {
          // Show the toast for the new message
          toast.info(`${selectedUser.firstname}: ${latestMessage.content}`, {
            position: "top-right",
            autoClose: 5000, // Close after 5 seconds
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Update the ref with the current message content to prevent it from showing again
          lastShownMessageRef.current = latestMessage.content;
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // console.log(user, "test");
    // setMessages([
    //   {
    //     sender: "John",
    //     content: "Hello! How are you?" + user.firstname + " " + user.lastname,
    //     time: new Date(),
    //     status: "sent",
    //   },
    // ]);
    getAllMessage();
  }, [selectedUser]);

  const simulateReceiveMessage = () => {
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "John",
          content: "What's up?",
          time: new Date(),
          status: "sent",
        },
      ]);
    }, 3000);
  };

  const handleSendMessage = async (audioBlob, audioUrl) => {
    let newMessage = {};

    // Handle Voice Message
    if (audioBlob) {
      newMessage = {
        sender: "You",
        content: <audio controls src={audioUrl} style={{ width: "100%" }} />,
        audioUrl: audioUrl,
        createdAt: new Date(),
        status: "sent", // Mark as "sent" because it's static (no API call)
      };
      // Directly add the voice message to the state
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...newMessage, createdAt: new Date(), senderId: currentUser },
      ]);
      return; // Exit early, don't need API call for voice message
    }

    // Handling text and file messages (as usual)
    if (message.trim()) {
      newMessage = {
        sender: "You",
        content: message,
        createdAt: new Date(),
        status: "loading",
      };
      setMessage(""); // reset message input
    }

    // Send new message and update state via API (text or file message)
    try {
      const response = await axios.post("http://localhost:5000/api/messages", {
        ...newMessage,
        senderId: currentUser,
        receiverId: user._id,
        createdAt: new Date(),
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...newMessage, createdAt: new Date(), senderId: currentUser },
      ]);

      toast.success(`You: ${newMessage.content}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.log(err);
    }

    // Simulate message sending completion
    setTimeout(() => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].status = "sent";
        return updatedMessages;
      });
      setIsSendingAudio(false); // Reset the audio sending state
    }, 2000);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setShowPreview(true);
      setIsFileSelected(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && message.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileInputClick = () => {
    inputFileRef.current.click();
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
    setShowEmojiPicker(false);
  };

  const openAudioCall = () => {
    setAudioCallOpen(true);
    const newMessage = {
      sender: "You",
      content: "Audio call initiated",
      time: new Date(),
      status: "sent",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const openVideoCall = () => {
    setVideoCallOpen(true);
    const newMessage = {
      sender: "You",
      content: "Video call initiated",
      time: new Date(),
      status: "sent",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "41rem",
        padding: "16px",
        backgroundColor: "transparent",
        borderRadius: "8px",
        boxShadow: "none",
        position: "relative",
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "8px",
          marginBottom: "16px",
        }}
      >
        <Avatar sx={{ width: 36, height: 36, marginRight: 2 }}>
          {selectedUser.profilePic ? (
            <img
              src={selectedUser.profilePic}
              alt="Profile"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          ) : (
            <Person />
          )}
        </Avatar>
        <Box sx={{ fontWeight: "bold", fontSize: "16px" }}>
          {selectedUser.firstname} {selectedUser.lastname}
        </Box>

        {/* Audio, Video Call, and Sidebar Icons */}
        <Box sx={{ marginLeft: "auto" }}>
          <Tooltip title="Audio Call">
            <IconButton
              onClick={openAudioCall}
              sx={{
                backgroundColor: "#4caf50",
                color: "#fff",
                borderRadius: "50%",
                marginLeft: "8px",
              }}
            >
              <CallIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Video Call">
            <IconButton
              onClick={openVideoCall}
              sx={{
                backgroundColor: "#ff5722",
                color: "#fff",
                borderRadius: "50%",
                marginLeft: "8px",
              }}
            >
              <VideoCallIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          {/* Right Sidebar Icon */}
          <Tooltip title="Open Sidebar">
            <IconButton
              onClick={toggleSidebar}
              sx={{
                backgroundColor: "#2196f3",
                color: "#fff",
                borderRadius: "50%",
                marginLeft: "8px",
              }}
            >
              <RightSidebarIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          overflowY: "auto",
          flex: 1,
          paddingBottom: "8px",
          paddingTop: "8px",
          marginBottom: "16px",
          flexGrow: 1,

          paddingRight: "8px",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#D3D3D3",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#D3D3D3" },
          "&::-webkit-scrollbar-track": {
            borderRadius: "10px",
            background: "#f1f1f1",
          },
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent:
                  msg.senderId === currentUser ||
                  msg.content.includes("call initiated")
                    ? "flex-end" // Right-aligned for messages you send
                    : "flex-start", // Left-aligned for messages from others
              }}
            >
              <ListItemText
                primary={
                  msg.filePreview ? (
                    msg.fileType.startsWith("image") ? (
                      <img
                        src={msg.filePreview}
                        alt="File"
                        style={{
                          maxWidth: "150px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    ) : msg.fileType.startsWith("video") ? (
                      <video
                        controls
                        src={msg.filePreview}
                        style={{
                          maxWidth: "150px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    ) : msg.fileType.startsWith("audio") ? (
                      <audio
                        controls
                        src={msg.filePreview}
                        style={{ width: "100%" }}
                      />
                    ) : msg.fileType.startsWith("application/pdf") ? (
                      <a
                        href={msg.filePreview}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View PDF
                      </a>
                    ) : msg.fileType.startsWith("application/msword") ||
                      msg.fileType.startsWith(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      ) ? (
                      <a
                        href={msg.filePreview}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    ) : (
                      "Unsupported file type"
                    )
                  ) : (
                    msg.content
                  )
                }
                secondary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "5px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ fontSize: "12px" }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </Typography>
                    {msg.status === "loading" ? (
                      <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
                    ) : (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginLeft: "8px" }}
                      >
                        ✓
                      </Typography>
                    )}
                  </Box>
                }
                sx={{
                  backgroundColor:
                    msg.senderId === currentUser ||
                    msg.content.includes("call initiated")
                      ? "#d0e7ff" // Lighter blue background for your messages
                      : "#e1e1e1", // Default gray color for other messages
                  padding: "12px",
                  borderRadius: "20px",
                  maxWidth: "40%",
                  textAlign: "left",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #e0e0e0",
          paddingTop: "8px",
          position: "relative",
        }}
      >
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "8px",
            borderRadius: "30px",
            backgroundColor: "#F7F4FF",
          }}
        >
          <Tooltip title="Attach File">
            <IconButton
              sx={{
                padding: "8px",
                backgroundColor: "#e1e1e1",
                color: "#4caf50",
                borderRadius: "50%",
              }}
              onClick={handleFileInputClick}
            >
              <AttachFile />
            </IconButton>
          </Tooltip>

          <Tooltip title="Insert Emoji">
            <IconButton
              sx={{
                padding: "8px",
                backgroundColor: "#e1e1e1",
                color: "#ff9800",
                borderRadius: "50%",
                marginLeft: "8px",
                marginRight: "8px",
              }}
              onClick={toggleEmojiPicker}
            >
              <EmojiEmotions />
            </IconButton>
          </Tooltip>

          <input
            ref={inputFileRef}
            type="file"
            accept="audio/*, video/*, .docx, .pdf, .png, .jpg, .jpeg"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          <InputBase
            sx={{
              flex: 1,
              fontSize: "14px",
              padding: "8px",
              borderRadius: "25px",
              backgroundColor: "#E1D9FF",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <IconButton
            onClick={() => handleSendMessage()}
            sx={{
              padding: "8px",
              backgroundColor: "#4caf50",
              color: "#fff",
              borderRadius: "50%",
              marginLeft: "8px",
            }}
          >
            {isSendingAudio ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Send />
            )}
          </IconButton>

          <VoiceNoteRecorder
            onAudioRecorded={handleSendMessage}
            isSendingAudio={isSendingAudio}
          />
        </Paper>
      </Box>

      {/* File Preview */}
      {showPreview && (
        <Box
          sx={{
            position: "absolute",
            bottom: "70px",
            left: "16px",
            zIndex: 10,
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "16px",
            maxWidth: "300px",
            width: "100%",
          }}
        >
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preview & Send
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {file?.name}
              </Typography>
              {file?.type.startsWith("image") && (
                <CardMedia
                  component="img"
                  image={filePreview}
                  alt="File Preview"
                  sx={{ maxHeight: "200px", objectFit: "contain" }}
                />
              )}
              {file?.type.startsWith("video") && (
                <video
                  controls
                  src={filePreview}
                  style={{ width: "100%", height: "auto", marginTop: "8px" }}
                />
              )}
              {file?.type.startsWith("audio") && (
                <audio controls src={filePreview} style={{ width: "100%" }} />
              )}
              {file?.type.startsWith("application/pdf") && (
                <a href={filePreview} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "16px",
                }}
              >
                <IconButton
                  onClick={() => setShowPreview(false)}
                  color="secondary"
                >
                  Cancel
                </IconButton>
                <IconButton onClick={() => handleSendMessage()} color="primary">
                  Send
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            left: "16px",
            zIndex: 20,
          }}
        >
          <Picker
            onSelect={handleEmojiSelect}
            style={{
              position: "absolute",
              bottom: "70px",
              left: 0,
              zIndex: 10,
            }}
          />
        </Box>
      )}

      {/* Audio and Video Call Modals */}
      <AudioCallModal
        open={audioCallOpen}
        onClose={() => setAudioCallOpen(false)}
        selectedUser={selectedUser}
      />
      <VideoCallModal
        open={videoCallOpen}
        onClose={() => setVideoCallOpen(false)}
        selectedUser={selectedUser}
      />

      {/* Right Sidebar */}
      <RightSideBar
        open={sidebarOpen}
        onClose={toggleSidebar}
        selectedUser={selectedUser}
        messages={messages}
      />

      {/* ToastContainer for Notifications */}
      <ToastContainer />
    </Box>
  );
};

export default ChatField;
