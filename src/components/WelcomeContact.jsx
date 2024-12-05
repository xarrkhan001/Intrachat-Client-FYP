import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ContactsIcon from "@mui/icons-material/Contacts"; // Material UI contacts icon

const WelcomeContact = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    setFadeIn(true);
  }, []);

  return (
    <Box
      sx={{
        width: "70%",
        height: "41rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        backgroundColor: "#F7F4FF", // Soft background color
        padding: 2,
        opacity: fadeIn ? 1 : 0, // Fade-in effect
        transition: "opacity 1s ease-in-out", // Smooth fade-in transition
      }}
    >
      {/* Icon with a lighter blue color and scaling animation */}
      <Box
        sx={{
          mb: 2,
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "scale(1)" : "scale(0.8)", // Scale-up effect on load
          transition: "transform 1s ease-in-out, opacity 1s ease-in-out",
        }}
      >
        <ContactsIcon sx={{ fontSize: 60, color: "#7986cb" }} />{" "}
        {/* Lighter blue contacts icon */}
      </Box>

      {/* Subtitle with enhanced font style */}
      <Typography
        variant="h5" // Smaller title font size
        component="h1"
        sx={{
          fontFamily: "'Poppins', sans-serif", // Stylish, modern font
          fontWeight: 700,
          color: "#333",
          mb: 1,
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateY(0)" : "translateY(-20px)", // Slide up effect
          transition: "opacity 1s ease-in-out, transform 1s ease-in-out", // Smooth transition
        }}
      >
        Contacts
      </Typography>

      {/* Subtitle with enhanced font style */}
      <Typography
        variant="body1" // Smaller subtitle font size
        sx={{
          fontFamily: "'Roboto', sans-serif", // Clean, readable font
          color: "#555",
          maxWidth: 500,
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateY(0)" : "translateY(-20px)", // Slide up effect
          transition: "opacity 1s ease-in-out, transform 1s ease-in-out", // Smooth transition
        }}
      >
        Browse through your contacts and start connecting!
      </Typography>
    </Box>
  );
};

export default WelcomeContact;
