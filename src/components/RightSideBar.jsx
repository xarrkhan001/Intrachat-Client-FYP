import React from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  FileCopy as FileIcon,
  Link as LinkIcon,
} from "@mui/icons-material";

const RightSideBar = ({ open, onClose, messages }) => {
  if (!open) return null;

  // Helper function to categorize the messages into media types
  const getSharedMedia = (messages) => {
    const images = [];
    const videos = [];
    const files = [];
    const links = [];

    messages.forEach((message) => {
      if (message.filePreview) {
        // If file is a media type (image/video)
        if (message.fileType.startsWith("image")) {
          images.push(message);
        } else if (message.fileType.startsWith("video")) {
          videos.push(message);
        } else if (message.fileType.startsWith("audio")) {
          files.push(message);
        }
      } else if (message.content && message.content.startsWith("http")) {
        // If content is a link (e.g., URL)
        links.push(message);
      }
    });

    return { images, videos, files, links };
  };

  const { images, videos, files, links } = getSharedMedia(messages);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "20rem", // Increased width for better layout
        height: "100%",
        backgroundColor: "#F7F4FF",
        boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        zIndex: 20,
        overflowY: "auto",
        transition: "transform 0.3s ease-in-out",
        transform: open ? "translateX(0)" : "translateX(100%)",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#D3D3D3",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#D3D3D3",
        },
        "&::-webkit-scrollbar-track": {
          borderRadius: "10px",
          background: "#f1f1f1",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Shared Media
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#888" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ margin: "8px 0" }} />

      {/* Images Section */}
      {images.length > 0 && (
        <>
          <Typography
            variant="body1"
            sx={{ marginBottom: "8px", fontWeight: "bold", color: "#333" }}
          >
            Images
          </Typography>
          <Grid container spacing={1} sx={{ marginBottom: "16px" }}>
            {images.map((image, index) => (
              <Grid item xs={4} key={index}>
                <Card
                  sx={{
                    maxWidth: "20rem",
                    cursor: "pointer",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={image.filePreview}
                    alt={`Image ${index + 1}`}
                    sx={{
                      height: "8rem", // Adjusted height for images
                      objectFit: "cover",
                      borderRadius: "8px",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                    onClick={() => window.open(image.filePreview, "_blank")}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <>
          <Typography
            variant="body1"
            sx={{ marginBottom: "8px", fontWeight: "bold", color: "#333" }}
          >
            Videos
          </Typography>
          <Grid container spacing={1} sx={{ marginBottom: "16px" }}>
            {videos.map((video, index) => (
              <Grid item xs={6} key={index}>
                <Card
                  sx={{
                    maxWidth: "100%",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {video.fileName || `Video ${index + 1}`}
                    </Typography>
                    <video
                      controls
                      src={video.filePreview}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Files Section */}
      {files.length > 0 && (
        <>
          <Typography
            variant="body1"
            sx={{ marginBottom: "8px", fontWeight: "bold", color: "#333" }}
          >
            Files
          </Typography>
          <List sx={{ marginBottom: "16px" }}>
            {files.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FileIcon sx={{ marginRight: "8px", color: "#1976d2" }} />
                  <ListItemText
                    primary={file.fileName}
                    secondary={`${file.fileSize || "Unknown size"}`}
                    sx={{ color: "#555" }}
                  />
                </Box>

                {/* Download button aligned with file name */}
                <Tooltip title="Download" placement="top">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ marginLeft: "8px" }}
                    onClick={() => window.open(file.filePreview, "_blank")}
                  >
                    Download
                  </Button>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Links Section */}
      {links.length > 0 && (
        <>
          <Typography
            variant="body1"
            sx={{ marginBottom: "8px", fontWeight: "bold", color: "#333" }}
          >
            Links
          </Typography>
          <List>
            {links.map((link, index) => (
              <ListItem
                key={index}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <LinkIcon sx={{ marginRight: "8px", color: "#1976d2" }} />
                <ListItemText
                  primary={link.content}
                  secondary={
                    <a
                      href={link.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1976d2", textDecoration: "none" }}
                    >
                      {link.content}
                    </a>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default RightSideBar;
