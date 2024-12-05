import React from "react";
import { Avatar, Paper, Typography, Grid, Divider, Box } from "@mui/material";
import backgroundImg from "../assets/islamian01.png.jpg"; // Import your background image
import PersonIcon from "@mui/icons-material/Person"; // Default icon if no image is available

const UserProfile = ({ contact }) => {
  // Destructuring props with default values
  const {
    firstname,
    lastname,
    profilePic,
    about,
    mutualContacts = [],
  } = contact;

  // Return a loading message if no contact is passed yet
  if (!contact) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        padding: "16px",
        flexGrow: 1,
        overflowY: "auto",
        marginBottom: "16px",
        paddingRight: "8px",
        maxHeight: "85vh", // Set max height for scrolling
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#D3D3D3", // Set thumb color to #D3D3D3
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#D3D3D3", // Set hover color to #D3D3D3
        },
        "&::-webkit-scrollbar-track": {
          borderRadius: "10px",
          background: "#f1f1f1", // Track color remains the same
        },
      }}
    >
      {/* User Profile Background */}
      <Paper
        elevation={3}
        style={{
          backgroundImage: `url(${backgroundImg})`, // Use the imported background image
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "26rem",
          borderRadius: "8px",
          marginBottom: "16px",
        }}
      ></Paper>

      {/* Profile and Info */}
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar
            alt={firstname}
            src={profilePic || undefined} // Use undefined to trigger fallback
            sx={{
              width: 80,
              height: 80,
              objectFit: "cover", // Ensure the image maintains aspect ratio
            }}
          >
            {!profilePic && <PersonIcon />}{" "}
            {/* Show default icon if no profile pic */}
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h6" component="div">
            {firstname} {lastname}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {about || "No about information available."}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Mutual Contacts
      </Typography>
      <Grid container spacing={1}>
        {mutualContacts.length ? (
          mutualContacts.map((contactItem, index) => (
            <Grid item key={index} xs="auto">
              <Grid
                container
                alignItems="center"
                spacing={1}
                direction="column"
              >
                <Grid item>
                  <Avatar
                    alt={contactItem.name}
                    src={contactItem.profilePic || undefined} // Fallback to icon if no image
                    sx={{
                      width: 32, // Reduced size
                      height: 32, // Reduced size
                      backgroundColor: contactItem.profilePic
                        ? "transparent"
                        : "#ADD8E6", // Light blue background for the default icon
                    }}
                  >
                    {!contactItem.profilePic && <PersonIcon />}{" "}
                    {/* Default icon */}
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="primary">
                    {contactItem.name}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No mutual contacts found.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default UserProfile;
