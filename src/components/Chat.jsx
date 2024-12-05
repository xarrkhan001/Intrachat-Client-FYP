// Chat.js
import React, { useState } from "react";
import { Box } from "@mui/material";
import ChatList from "./ChatList"; // Import ChatList component
import ChatField from "./ChatField"; // Import ChatField component
import WelcomePage from "./WelcomePage"; // Import WelcomePage component

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user

  const handleUserSelect = (user) => {
    setSelectedUser(user); // Set the selected user
  };

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
      {/* Chat List on the left side */}
      <ChatList onSelectUser={handleUserSelect} />

      {/* Welcome Page on the right side when no user is selected */}
      {!selectedUser && <WelcomePage />}

      {/* Chat Field on the right side when a user is selected */}
      {selectedUser && (
        <Box sx={{ width: "70%", borderLeft: "1px solid #e0e0e0" }}>
          <ChatField
            selectedUser={selectedUser}
            user={selectedUser}
            onBack={() => setSelectedUser(null)}
          />
        </Box>
      )}
    </Box>
  );
};

export default Chat;
