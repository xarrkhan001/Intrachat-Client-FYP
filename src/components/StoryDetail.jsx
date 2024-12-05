import React, { useState, useRef, useEffect } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";
import img1 from "../assets/islamia.png"; // Default image

const StoryDetail = ({ selectedStory }) => {
  const defaultImage = img1; // Default image for story content

  const { profilePic, firstname, lastname, about, storyImage, mediaType } =
    selectedStory || {}; // Retrieve story image and media type

  const [isHovered, setIsHovered] = useState(false); // Track hover effect for media content
  const [videoProgress, setVideoProgress] = useState(0); // Track video progress for border animation
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // Track if video is playing
  const videoRef = useRef(null); // Reference for video element

  // Handle mouse hover events to play/pause video
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play(); // Play video on hover
      setIsVideoPlaying(true); // Set video playing status
      videoRef.current.muted = false; // Unmute video on hover
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause(); // Pause video on mouse leave
      setIsVideoPlaying(false); // Set video playing status to false
      videoRef.current.muted = true; // Mute video when not hovering
    }
  };

  // Handle video progress on time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress); // Update progress for the blue border
    }
  };

  // Check if the media is a video based on its file type
  const isVideo = mediaType === "video"; // Check the mediaType directly

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#F7F4FF",
        padding: "30px",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {/* Header with User's Profile Picture and Name */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "30px",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 70,
            height: 70,
            border: `3px solid ${
              isHovered
                ? `linear-gradient(to right, #007bff ${videoProgress}%, #fff ${videoProgress}%)`
                : "#fff"
            }`, // Dynamic blue border based on video progress
            boxShadow: isHovered
              ? "0px 4px 12px rgba(0, 123, 255, 0.6)" // Glow effect on hover
              : "0px 4px 12px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#e1e1e1",
            transition:
              "border 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for border change
            "&:hover": {
              transform: "scale(1.1)", // Slightly enlarge on hover
            },
          }}
        >
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Person sx={{ color: "#7f7f7f", fontSize: "2rem" }} />
          )}
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: "600", color: "#333" }}>
          {firstname} {lastname}
        </Typography>
      </Box>

      {/* Image or Video */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "25rem",
          marginTop: "-4px",
          borderRadius: "12px",
          overflow: "hidden",
          transition: "transform 0.3s ease-in-out", // Smooth transition on hover
          transform: isHovered ? "scale(1.05)" : "scale(1)", // Slight zoom effect on hover
        }}
        onMouseEnter={handleMouseEnter} // Trigger video play on hover
        onMouseLeave={handleMouseLeave} // Pause video on mouse leave
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={storyImage} // Use the uploaded video URL
            alt="Story"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease-in-out", // Smooth transition effect for video
            }}
            muted={isHovered ? false : true} // Mute/unmute based on hover
            loop
            onTimeUpdate={handleTimeUpdate} // Track video progress
          />
        ) : (
          <img
            src={storyImage || defaultImage} // Show default if no story image
            alt="Story"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        )}
      </Box>

      {/* Story Description */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "600",
          color: "#333",
          marginTop: "30px", // Adjust margin for spacing
          textAlign: "center",
        }}
      >
        Story Description
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#555",
          fontSize: "1rem",
          textAlign: "center",
          lineHeight: "1.6",
          letterSpacing: "0.5px",
          marginTop: "10px", // Add margin for spacing
        }}
      >
        {about ||
          "This is a captivating story, but no description is available right now."}{" "}
        {/* Fallback text */}
      </Typography>
    </Box>
  );
};

export default StoryDetail;
