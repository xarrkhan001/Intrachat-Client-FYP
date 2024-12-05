import React from "react";
import { Container, Card } from "@mui/material";
import { useLocation } from "react-router-dom"; // Import Router and useLocation
import TabNavigation from "./TabNavigation";

const MainApp = () => {
  // Use location to get the current route path
  const location = useLocation();

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
        margin: 0,
        backgroundColor: "#F4F9FD",
      }}
    >
      <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: 20,
          height: "45rem",
          width: "75rem",
          maxWidth: "1200px",
          position: "relative",
          backgroundColor: "#F7F4FF",
        }}
      >
        {/* Conditionally render TabNavigation based on the route */}
        {location.pathname !== "/profile" && <TabNavigation />}
      </Card>
    </Container>
  );
};

export default MainApp;
