import React from "react";
import { Box, Card } from "@mui/material"; // Import both Box and Card
import { Routes, Route } from "react-router-dom"; // Import Router, Routes, Route
import MainApp from "./components/MainApp";
import SignUpLogin from "./components/SignUpLogin";
import ProfilePage from "./components/ProfilePage";

const App = () => {
  return (
    <Box
      sx={{
        display: "flex", // Use flexbox to center the Card
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        height: "100vh", // Take full viewport height
        backgroundColor: "#F4F9FD", // Optional: Light background for better visibility
      }}
    >
      <Routes>
        {/* Define Route for the SignUpLogin component */}
        <Route path="/" element={<SignUpLogin />} />

        {/* Define Route for the MainApp component */}
        <Route path="/main" element={<MainApp />} />

        {/* Define Route for the ProfilePage component wrapped inside a Card */}
        <Route
          path="/profile"
          element={
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: 20,
                height: "45rem",
                width: "40rem",
                maxWidth: "1200px",
                position: "relative",
                backgroundColor: "#F7F4FF",
              }}
            >
              <ProfilePage />
            </Card>
          }
        />
      </Routes>
    </Box>
  );
};

export default App;
