import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
} from "@mui/material";
import { Search, Person } from "@mui/icons-material";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import AudioCallModal from "./AudioCallModal"; // Import AudioCallModal
import VideoCallModal from "./VideoCallModal"; // Import VideoCallModal

const ContactList = ({ onSelectContact }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true); // Initially loading is true
  const [contacts, setContacts] = useState([]); // Empty contacts array
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAudioCallModalOpen, setIsAudioCallModalOpen] = useState(false);
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false); // Video call modal state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        if (response.data && response.data.users) {
          setContacts(response.data.users); // Set contacts with fetched users
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredContacts = contacts
    .filter((contact) => {
      switch (filter) {
        case "All":
          return true;
        case "Online":
          return contact.status === "Online";
        case "Offline":
          return contact.status === "Offline";
        default:
          return true;
      }
    })
    .filter((contact) =>
      `${contact.firstname} ${contact.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const handleAudioCallClick = (contact) => {
    setSelectedContact(contact); // Set the selected contact for the audio call
    setIsAudioCallModalOpen(true); // Open the audio call modal
  };

  const handleVideoCallClick = (contact) => {
    setSelectedContact(contact); // Set the selected contact for the video call
    setIsVideoCallModalOpen(true); // Open the video call modal
  };

  const handleCloseAudioCallModal = () => {
    setIsAudioCallModalOpen(false);
    setSelectedContact(null); // Clear the selected contact
  };

  const handleCloseVideoCallModal = () => {
    setIsVideoCallModalOpen(false);
    setSelectedContact(null); // Clear the selected contact
  };

  const Loader = () => (
    <div
      className="loader"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <CircularProgress />
    </div>
  );

  return (
    <div
      style={{
        width: "22rem",
        backgroundColor: " #F7F4FF",
        borderRight: "1px solid #e0e0e0",
        position: "relative",
      }}
    >
      {/* Contacts heading */}
      <div
        style={{
          padding: "16px",
          fontSize: "24px",
          fontWeight: "bold",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Contacts
      </div>

      {/* Search bar */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e0e0e0" }}>
        <TextField
          variant="outlined"
          placeholder="Search contacts"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search />,
            sx: {
              borderRadius: "20px",
              backgroundColor: "#F7F4FF",
              height: "3rem",
            },
          }}
        />
      </div>

      {/* Filter options */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          gap: "16px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {["All", "Online", "Offline"].map((option) => (
          <div
            key={option}
            style={{
              cursor: "pointer",
              fontWeight: filter === option ? "bold" : "normal",
              color: filter === option ? "#1976d2" : "#757575",
            }}
            onClick={() => setFilter(option)}
          >
            {option}
          </div>
        ))}
      </div>

      {/* Scrollable list container */}
      <div
        style={{
          padding: "8px",
          overflowY: "auto",
          height: "calc(100vh - 320px)", // Adjust for header and search/filter
          scrollbarWidth: "thin", // Firefox
          scrollbarColor: "#D3D3D3 #f7f7f7", // Firefox (thumb and track color)
        }}
      >
        <List>
          {loading ? (
            <Loader />
          ) : error ? (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <p>{error}</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <ListItem
                button
                key={contact._id}
                onClick={() => onSelectContact(contact)} // Handle contact selection
                sx={{
                  padding: "8px 16px",
                  borderBottom: "1px solid #e0e0e0",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "#e8f0fe",
                    cursor: "pointer", // This will change the cursor to a pointer
                  },
                }}
              >
                <Avatar sx={{ width: 36, height: 36, marginRight: 2 }}>
                  {contact.profilePic ? (
                    <img
                      src={contact.profilePic}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <Person />
                  )}
                </Avatar>
                <ListItemText
                  primary={`${contact.firstname} ${contact.lastname}`}
                  secondary={contact.status || "No status"}
                />

                {/* Audio Call and Video Call Icons */}
                <Box sx={{ marginLeft: "auto" }}>
                  <Tooltip title="Audio Call">
                    <IconButton
                      onClick={() => handleAudioCallClick(contact)}
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        borderRadius: "50%",
                        marginLeft: "8px",
                      }}
                    >
                      <CallIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Video Call">
                    <IconButton
                      onClick={() => handleVideoCallClick(contact)} // Trigger Video Call Modal
                      sx={{
                        backgroundColor: "#ff5722",
                        color: "#fff",
                        borderRadius: "50%",
                        marginLeft: "8px",
                      }}
                    >
                      <VideoCallIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
            ))
          )}
        </List>
      </div>

      {/* Audio Call Modal */}
      {selectedContact && isAudioCallModalOpen && (
        <AudioCallModal
          open={isAudioCallModalOpen}
          onClose={handleCloseAudioCallModal}
          selectedUser={selectedContact}
        />
      )}

      {/* Video Call Modal */}
      {selectedContact && isVideoCallModalOpen && (
        <VideoCallModal
          open={isVideoCallModalOpen}
          onClose={handleCloseVideoCallModal}
          selectedUser={selectedContact}
        />
      )}
    </div>
  );
};

export default ContactList;
