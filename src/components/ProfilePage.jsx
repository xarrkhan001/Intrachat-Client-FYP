import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Avatar,
  Container,
  Paper,
  IconButton,
  Fade,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ImageIcon from "@mui/icons-material/Image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import ArrowBackIcon
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import your default background image
import backgroundImg from "../assets/is01.jpg"; // Replace with actual path to your image
import profilePic from "../assets/islamia00.png"; // Replace with actual path to your profile image

const ProfilePage = () => {
  const [name, setName] = useState(""); // Initialize state with empty strings
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicState, setProfilePicState] = useState(profilePic); // Use imported profile picture
  const [backgroundImageState, setBackgroundImageState] =
    useState(backgroundImg); // Use imported background image
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);

    // Get user ID from local storage
    const userId = localStorage.getItem("userId");

    if (userId) {
      axios
        .get(`http://localhost:5000/api/users/${userId}`)
        .then((response) => {
          // Update the state with the fetched user data
          setName(response.data.user.firstname);
          setLastname(response.data.user.lastname);
          setEmail(response.data.user.email);
          setBio(response.data.user.position);
          setProfilePicState(response.data.profilePic || profilePic);
          setBackgroundImageState(
            response.data.backgroundImage || backgroundImg
          );
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.error("User ID not found in local storage");
    }
  }, []);

  const handleSaveProfile = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in!");
      return;
    }

    const updatedUserData = {
      firstname: name,
      lastname: lastname,
      email: email,
      position: bio,
    };

    axios
      .put(`http://localhost:5000/api/update/${userId}`, updatedUserData)
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        toast.success("Profile updated successfully!"); // Toast message
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error("Error updating profile!"); // Toast message
      });
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match!"); // Toast message
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in!"); // Toast message
      return;
    }

    axios
      .put(`http://localhost:5000/api/change-password/${userId}`, {
        currentPassword,
        newPassword,
        confirmNewPassword,
      })
      .then((response) => {
        toast.success("Password updated successfully!"); // Toast message
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        console.error("Error updating password:", error);
        toast.error("Error updating password!"); // Toast message
      });
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicState(URL.createObjectURL(file));
    }
  };

  const handleBackgroundChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBackgroundImageState(URL.createObjectURL(file));
    }
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <Container
      sx={{
        maxWidth: "lg",
        paddingTop: "20px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "auto",
        backgroundColor: "#F7F4FF",
      }}
    >
      <IconButton
        color="primary"
        onClick={handleBackButtonClick}
        sx={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 100,
          color: "black",
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 30 }} />
      </IconButton>

      <Fade in={fadeIn} timeout={1000}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            marginTop: "1rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Profile
        </Typography>
      </Fade>

      <Fade in={fadeIn} timeout={1500}>
        <Paper
          sx={{
            backgroundImage: `url(${backgroundImageState})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "220px 20px 20px 20px",
            borderRadius: "10px",
            height: "20rem",
            marginTop: "1rem",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundChange}
            style={{ display: "none" }}
            id="backgroundImageUpload"
          />
          <IconButton
            color="primary"
            component="label"
            htmlFor="backgroundImageUpload"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: 1,
            }}
          >
            <ImageIcon sx={{ color: "white" }} />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              top: "11rem",
              left: "20px",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={profilePicState}
                alt={name}
                sx={{
                  width: 90,
                  height: 90,
                  border: "3px solid white",
                  boxShadow: 3,
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                style={{ display: "none" }}
                id="profilePicUpload"
              />
              <IconButton
                color="primary"
                component="label"
                htmlFor="profilePicUpload"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: 1,
                }}
              >
                <PhotoCameraIcon sx={{ color: "white" }} />
              </IconButton>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#E0E0E0",
                  textAlign: "center",
                }}
              >
                {name} {lastname}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                  color: "#E0E0E0",
                  textAlign: "center",
                }}
              >
                {bio}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#E0E0E0",
                  textAlign: "center",
                }}
              >
                {email}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>

      <Box
        sx={{
          marginTop: "1rem",
          overflowY: "auto",
          flexGrow: 1,
          paddingBottom: "50px", // Add space for footer or scrolling
          "&::-webkit-scrollbar": {
            width: "6px", // Set scrollbar width
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
          },
        }}
      >
        <Fade in={fadeIn} timeout={2000}>
          <Box
            sx={{
              backgroundColor: "#fff",
              padding: "20px",
              marginTop: "2rem",
              borderRadius: "10px",
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              Edit Profile Information
            </Typography>

            <TextField
              label="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "20px" }}
              onClick={handleSaveProfile}
              startIcon={<SaveIcon />}
            >
              Save Profile
            </Button>
          </Box>
        </Fade>

        <Fade in={fadeIn} timeout={2500}>
          <Box
            sx={{
              marginTop: "2rem",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#333", marginBottom: "20px" }}
            >
              Change Password
            </Typography>

            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "20px" }}
              onClick={handleUpdatePassword}
              startIcon={<SaveIcon />}
            >
              Change Password
            </Button>
          </Box>
        </Fade>
      </Box>

      {/* Toast Notifications */}
      <ToastContainer />
    </Container>
  );
};

export default ProfilePage;
