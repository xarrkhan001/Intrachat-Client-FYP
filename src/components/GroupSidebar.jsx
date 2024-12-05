import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
} from "@mui/material";
import { Close as CloseIcon, GroupAdd } from "@mui/icons-material";

const GroupSidebar = ({ open, onClose, users, onGroupCreate }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const maxUsers = 50; // Limit number of users that can be selected

  const handleSelectUser = (user) => {
    if (selectedUsers.includes(user._id)) {
      setSelectedUsers((prevSelected) =>
        prevSelected.filter((id) => id !== user._id)
      );
    } else if (selectedUsers.length < maxUsers) {
      setSelectedUsers((prevSelected) => [...prevSelected, user._id]);
    } else {
      alert(`You can select a maximum of ${maxUsers} users.`);
    }
  };

  const handleCreateGroup = () => {
    if (selectedUsers.length >= 2 && groupName.trim()) {
      onGroupCreate(groupName, selectedUsers);
      onClose();
      setGroupName("");
      setSelectedUsers([]);
    } else {
      alert("Please select at least two users and provide a group name.");
    }
  };

  return (
    <Box
      sx={{
        width: "22rem",
        backgroundColor: "#F7F4FF",
        padding: "16px",
        zIndex: 2000,
        borderTop: "1px solid #e0e0e0",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Close button and Heading */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Create Group
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider style={{ margin: "10px 0" }} />

      {/* Group Name Input */}
      <TextField
        variant="outlined"
        label="Group Name"
        fullWidth
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        InputProps={{
          sx: {
            backgroundColor: "#F7F4FF",
            borderRadius: "20px",
            height: "3rem",
            padding: "8px 16px",
          },
        }}
        style={{ marginBottom: "16px", marginTop: "8px" }}
      />

      {/* User Selection */}
      <Typography variant="body2" style={{ marginBottom: "2px" }}>
        Select Users (Max {maxUsers})
      </Typography>

      {/* Scrollable list container */}
      <div
        style={{
          padding: "8px",
          overflowY: "auto",
          height: "calc(100vh - 360px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#D3D3D3 #f7f7f7",
        }}
      >
        <List>
          {users.map((user) => (
            <ListItem
              button
              key={user._id}
              onClick={() => handleSelectUser(user)}
              style={{
                backgroundColor: selectedUsers.includes(user._id)
                  ? "#e3f2fd"
                  : "transparent",
                marginBottom: "8px",
                marginTop: "12px",
                padding: "8px 4px",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Avatar sx={{ width: 36, height: 36, marginRight: 2 }}>
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <GroupAdd />
                )}
              </Avatar>
              <ListItemText primary={`${user.firstname} ${user.lastname}`} />
            </ListItem>
          ))}
        </List>
      </div>

      {/* Create Group Button */}
      <Button
        variant="outlined"
        onClick={handleCreateGroup}
        fullWidth
        sx={{
          marginTop: "16px",
          backgroundColor: "transparent",
          border: "1px solid blue",
          color: "blue",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 255, 0.1)",
          },
        }}
      >
        {selectedUsers.length > 0
          ? selectedUsers.length === 1
            ? `Create Group with ${selectedUsers.length} User`
            : `Create Group with ${selectedUsers.length} Users`
          : "Create Group"}
      </Button>
    </Box>
  );
};

export default GroupSidebar;
