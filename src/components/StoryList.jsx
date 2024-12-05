import React, { useState, useEffect } from "react";
import {
  TextField,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  ListItemText,
  List,
  ListItem,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { Search, Person, MoreVert, ImportExport } from "@mui/icons-material";
import axios from "axios";
import { useDebounce } from "use-debounce";

const StoryList = ({ onSelectStory }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [users, setUsers] = useState([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [description, setDescription] = useState("");

  // Retrieve the userId from localStorage
  const userId = localStorage.getItem("userId");

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        if (response.data && response.data.users) {
          setUsers(response.data.users);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
        setToastMessage("Failed to fetch users.");
        setToastOpen(true);
      }
    };

    fetchUsers();
  }, []);

  // Expire stories after 24 hours
  useEffect(() => {
    const expireStories = () => {
      setUsers((prevUsers) =>
        prevUsers.map((story) => {
          const creationTime = new Date(story.creationTime).getTime();
          const currentTime = new Date().getTime();
          const hoursPassed = (currentTime - creationTime) / (1000 * 60 * 60); // Time difference in hours

          // If 24 hours have passed, mark the story as expired
          if (hoursPassed >= 24 && story.status !== "Expired") {
            return { ...story, status: "Expired" };
          }
          return story;
        })
      );
    };

    // Set an interval to check for expired stories every hour
    const intervalId = setInterval(expireStories, 1000 * 60 * 60); // Every hour
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Remove expired stories after 30 minutes
  useEffect(() => {
    const removeExpiredStories = () => {
      setUsers((prevUsers) =>
        prevUsers.filter((story) => {
          if (story.status === "Expired") {
            const creationTime = new Date(story.creationTime).getTime();
            const currentTime = new Date().getTime();
            const minutesPassed = (currentTime - creationTime) / (1000 * 60); // Time difference in minutes

            // If 30 minutes have passed, remove the story from the list
            return minutesPassed < 30;
          }
          return true;
        })
      );
    };

    // Set an interval to check for stories to remove every 10 minutes
    const removeIntervalId = setInterval(removeExpiredStories, 1000 * 60 * 10); // Every 10 minutes
    return () => clearInterval(removeIntervalId); // Cleanup interval on component unmount
  }, []);

  const filteredStories = users
    .filter((story) => {
      switch (filter) {
        case "All":
          return true;
        case "Active":
          return story.status === "Active";
        case "Expired":
          return story.status === "Expired";
        default:
          return true;
      }
    })
    .filter((story) =>
      `${story.firstname} ${story.lastname}`
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );

  // Dropdown menu actions (Archive/Delete)
  const handleDropdownClick = (event, storyId) => {
    setSelectedStoryId(storyId);
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
    setSelectedStoryId(null);
  };

  const handleDelete = (storyId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this story?")) {
      setUsers((prevUsers) =>
        prevUsers.filter((story) => story._id !== storyId)
      );
      handleDropdownClose();
    }
  };

  const handleArchive = (storyId, e) => {
    e.stopPropagation();
    setUsers((prevUsers) =>
      prevUsers.map((story) =>
        story._id === storyId ? { ...story, status: "Archived" } : story
      )
    );
    handleDropdownClose();
  };

  // Handle the import (upload story)
  const handleImportStory = () => {
    setOpenDialog(true); // Open the media upload dialog
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0]; // Get file type (image/video)
      setMediaType(fileType);
      setMediaFile(file);
    }
  };

  const handleUploadConfirm = () => {
    if (!mediaFile || !description) return;

    setUsers((prevUsers) =>
      prevUsers.map((story) =>
        story._id === userId
          ? {
              ...story,
              storyImage: URL.createObjectURL(mediaFile),
              mediaType,
              about: description,
              hasUploadedStory: true,
              status: "Active", // Ensure the story is "Active"
            }
          : story
      )
    );

    // Close dialog and show success toast
    setOpenDialog(false);
    setToastMessage("Story uploaded successfully!");
    setToastOpen(true);

    // Reset media state
    setMediaFile(null);
    setMediaType("");
    setDescription(""); // Reset description field
  };

  const handleUploadCancel = () => {
    setOpenDialog(false);
    setMediaFile(null);
    setDescription(""); // Reset description field
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
        backgroundColor: "#F7F4FF",
        borderRight: "1px solid #e0e0e0",
        position: "relative",
      }}
    >
      {/* Stories heading with import icon */}
      <div
        style={{
          padding: "16px",
          fontSize: "24px",
          fontWeight: "bold",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>Stories</span>
        <IconButton onClick={handleImportStory}>
          <ImportExport />
        </IconButton>
      </div>
      {/* Search bar */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e0e0e0" }}>
        <TextField
          variant="outlined"
          placeholder="Search stories"
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
        {["All", "Active", "Expired"].map((option) => (
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
      {/* List of stories */}
      <div
        style={{
          padding: "8px",
          overflowY: "auto",
          height: "calc(100vh - 320px)", // Adjust for header and search/filter
          scrollbarWidth: "thin", // Firefox
          scrollbarColor: "#D3D3D3 #f7f7f7", // Firefox (thumb and track color)
        }}
      >
        <List
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px", // Set the width of the scrollbar
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#D3D3D3", // Light gray thumb color
              borderRadius: "8px", // Round corners
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f7f7f7", // Light gray track color
              borderRadius: "8px", // Round corners
            },
          }}
        >
          {loading ? (
            <Loader />
          ) : (
            filteredStories
              .sort(
                (a, b) =>
                  (b.hasUploadedStory ? 1 : 0) - (a.hasUploadedStory ? 1 : 0)
              ) // Move users with uploaded stories to the top
              .map((story) => (
                <ListItem
                  button
                  key={story._id}
                  onClick={() => onSelectStory(story)}
                  sx={{
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f7f7f7",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    ":hover": {
                      backgroundColor: "#e8f0fe",
                      cursor: "pointer", // This will change the cursor to a pointer
                    },
                  }}
                >
                  <Avatar
                    alt={story.firstname}
                    src={story.storyImage || "default.jpg"}
                    sx={{
                      width: "50px",
                      height: "50px",
                      marginRight: "16px",
                      border: `2px solid ${
                        story.storyImage
                          ? mediaType === "image"
                            ? "blue"
                            : "green"
                          : "gray"
                      }`,
                      borderRadius: "50%",
                      boxShadow: `0 0 10px ${
                        story.storyImage ? "blue" : "gray"
                      }`,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontSize: "1rem" }}>
                      {story.firstname} {story.lastname}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ fontSize: "1rem" }}
                    >
                      {story.hasUploadedStory ? "Uploaded a Story" : "No story"}
                    </Typography>
                  </div>

                  <IconButton
                    onClick={(e) => handleDropdownClick(e, story._id)}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={selectedStoryId === story._id}
                    onClose={handleDropdownClose}
                    anchorOrigin={{
                      vertical: "top", // The vertical alignment of the menu
                      horizontal: "left", // Align the menu to the left of the anchor element
                    }}
                    transformOrigin={{
                      vertical: "top", // Keep the menu's top aligned
                      horizontal: "right", // The menu will open towards the left
                    }}
                  >
                    <MenuItem onClick={(e) => handleArchive(story._id, e)}>
                      Archive
                    </MenuItem>
                    <MenuItem onClick={(e) => handleDelete(story._id, e)}>
                      Delete
                    </MenuItem>
                  </Menu>
                </ListItem>
              ))
          )}
        </List>
      </div>

      {/* Toast Notifications */}
      {/* Success Toast Snackbar */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert severity="success" onClose={() => setToastOpen(false)}>
          {toastMessage}
        </Alert>
      </Snackbar>

      {/* dialog modal  */}
      <Dialog
        open={openDialog}
        onClose={handleUploadCancel}
        sx={{
          maxWidth: 500,
          padding: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
        }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", fontSize: 24, textAlign: "center" }}
        >
          Upload Your Story
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 1, paddingBottom: 2 }}>
          <Typography
            variant="body2"
            gutterBottom
            sx={{ fontSize: "0.9rem", color: "gray" }}
          >
            Add a description (optional):
          </Typography>
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3} // Reduced height for description input
            variant="outlined"
            placeholder="Write a description..."
            sx={{
              borderRadius: 1,
              backgroundColor: "#f9f9f9",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          />
          <div style={{ marginTop: 16 }}>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              style={{ display: "none" }}
              id="upload-file-input"
            />
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                style={{ display: "none" }}
                id="upload-file-input"
              />
              <label htmlFor="upload-file-input" style={{ width: "100%" }}>
                <Button
                  component="span"
                  variant="outlined"
                  sx={{
                    marginTop: 2,
                    width: "100%", // Makes the button fill the width of its parent container
                    padding: "6px 12px", // Reduced padding for a smaller button
                    fontSize: "0.875rem", // Smaller font size
                    borderRadius: 2, // Slightly smaller border radius
                    borderColor: "#1976d2", // Blue border
                    color: "#1976d2", // Blue text color
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow
                    "&:hover": {
                      backgroundColor: "#1976d2", // Blue background on hover
                      color: "#fff", // White text color on hover
                    },
                  }}
                >
                  Upload Media
                </Button>
              </label>
            </div>

            {mediaFile && (
              <div style={{ marginTop: 16 }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.9rem", color: "gray" }}
                >
                  Selected file:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                  {mediaFile.name}
                </Typography>
                <div style={{ marginTop: 16 }}>
                  {mediaType === "image" ? (
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="Uploaded Preview"
                      style={{
                        width: "100%",
                        maxHeight: 250, // Slightly smaller preview
                        objectFit: "cover",
                        borderRadius: 4,
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  ) : (
                    <video
                      controls
                      style={{
                        width: "100%",
                        maxHeight: 250,
                        borderRadius: 4,
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <source
                        src={URL.createObjectURL(mediaFile)}
                        type={mediaFile.type}
                      />
                    </video>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions sx={{ paddingTop: 1, justifyContent: "center" }}>
          {/* Cancel Button */}
          <Button
            onClick={handleUploadCancel}
            color="primary"
            sx={{
              fontWeight: "bold",
              color: "#1976d2", // Consistent with Upload button
              width: "100%", // Set width to 100% to match Upload Media button
              padding: "6px 12px", // Reduced padding for a smaller button
              fontSize: "0.875rem", // Same font size as Upload Media button
              borderRadius: 2, // Slightly smaller border radius
              borderColor: "#1976d2", // Blue border
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow
              "&:hover": { backgroundColor: "#e0e0e0" }, // Hover effect
            }}
          >
            Cancel
          </Button>
          {/* Upload Button */}
          <Button
            onClick={handleUploadConfirm}
            color="primary"
            sx={{
              fontWeight: "bold",
              backgroundColor: "#1976d2", // Same blue color for consistency
              color: "white",
              width: "100%", // Set width to 100% to match Upload Media button
              padding: "6px 12px", // Reduced padding for a smaller button
              fontSize: "0.875rem", // Same font size as Upload Media button
              borderRadius: 2, // Slightly smaller border radius
              "&:hover": { backgroundColor: "#1565c0" }, // Darker blue for hover
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StoryList;
