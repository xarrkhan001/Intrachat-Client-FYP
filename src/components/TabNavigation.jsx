// TabNavigation.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logo from "../assets/ISL0.png";
import Chat from "./Chat";
import Contacts from "./Contacts";
import Stories from "./Stories";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const TabNavigation = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "John Doe called you" },
    { id: 2, message: "Jane Doe missed your call" },
  ]);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleNotificationClick = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleProfileClick = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  const handleLogout = () => {
    // Implement the logout logic (if any)
    navigate("/"); // Redirect to home page ("/")
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      {/* Navbar / Tabs with sticky position */}
      <Box
        sx={{
          padding: "10px 20px",
          boxShadow: 2,
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F7F4FF",
          width: "100%",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            left: "10px",
            gap: 1.5,
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "50px", height: "50px" }}
          />
          <Typography
            sx={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "1.6rem",
              fontWeight: "600",
              color: "#0077b6",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            INTRACHAT
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="tab navigation"
            sx={{ display: "flex", justifyContent: "center", gap: 3 }}
          >
            <Tab
              label="Chat"
              sx={{
                fontSize: "1rem",
                padding: "10px 15px",
                color: selectedTab === 0 ? "#0077b6" : "gray",
                fontWeight: selectedTab === 0 ? "bold" : "normal",
                minWidth: "auto",
                height: "auto",
                textTransform: "none",
              }}
            />
            <Tab
              label="Contacts"
              sx={{
                fontSize: "1rem",
                padding: "10px 15px",
                color: selectedTab === 1 ? "#0077b6" : "gray",
                fontWeight: selectedTab === 1 ? "bold" : "normal",
                minWidth: "auto",
                height: "auto",
                textTransform: "none",
              }}
            />
            <Tab
              label="Stories"
              sx={{
                fontSize: "1rem",
                padding: "10px 15px",
                color: selectedTab === 2 ? "#0077b6" : "gray",
                fontWeight: selectedTab === 2 ? "bold" : "normal",
                minWidth: "auto",
                height: "auto",
                textTransform: "none",
              }}
            />
          </Tabs>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            right: "20px",
            gap: 1, // Reduced gap between icons
          }}
        >
          {/* Notification Icon */}
          <IconButton
            onClick={handleNotificationClick}
            sx={{
              color: "#0077b6",
              borderRadius: "50%", // Rounded button
              border: "2px solid #0077b6", // Thicker border
              padding: "6px", // Smaller button size
              fontSize: "1.3rem", // Smaller icon size
            }}
          >
            <NotificationsIcon sx={{ fontSize: "1.3rem" }} />
          </IconButton>

          <Menu
            anchorEl={anchorElNotification}
            open={Boolean(anchorElNotification)}
            onClose={handleCloseNotification}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right", // Open towards the right of the notification icon
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right", // Align towards the right side of the notification icon
            }}
            sx={{ width: "250px" }}
          >
            <Typography sx={{ padding: "10px", fontWeight: "bold" }}>
              Notifications
            </Typography>
            {notifications.map((notification) => (
              <MenuItem key={notification.id} onClick={handleCloseNotification}>
                {notification.message}
              </MenuItem>
            ))}
          </Menu>

          {/* Profile Icon */}
          <IconButton
            onClick={handleProfileClick}
            sx={{
              color: "#0077b6",
              borderRadius: "50%", // Rounded button
              border: "2px solid #0077b6", // Thicker border
              padding: "6px", // Smaller button size
              fontSize: "1.3rem", // Smaller icon size
            }}
          >
            <AccountCircleIcon sx={{ fontSize: "1.3rem" }} />
          </IconButton>

          <Menu
            anchorEl={anchorElProfile}
            open={Boolean(anchorElProfile)}
            onClose={handleCloseProfile}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right", // Open towards the right of the profile icon
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right", // Align towards the right side of the profile icon
            }}
            sx={{ width: "250px" }}
          >
            <MenuItem onClick={() => (window.location.href = "/profile")}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Content Area */}
      <Box sx={{ flexGrow: 1, display: "flex", width: "100%" }}>
        {selectedTab === 0 ? (
          <Chat />
        ) : selectedTab === 1 ? (
          <Contacts />
        ) : (
          <Stories />
        )}
      </Box>
    </Box>
  );
};

export default TabNavigation;
