import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  Person,
  MoreVert,
  GroupAdd,
  NotificationsOff,
} from "@mui/icons-material";
import GroupSidebar from "./GroupSidebar"; // Import GroupSidebar

const ChatList = ({ onSelectUser }) => {
  const currentUser = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [groupSidebarOpen, setGroupSidebarOpen] = useState(false);
  const [muteDialogOpen, setMuteDialogOpen] = useState(false);
  const [muteDuration, setMuteDuration] = useState(30); // Mute duration in minutes
  const [mutedUsers, setMutedUsers] = useState([]); // Store muted users
  const [toastOpen, setToastOpen] = useState(false);

  // Fetching users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        if (response.data && response.data.users) {
          setUsers(
            response.data.users?.filter((item) => item?._id !== currentUser)
          );

          console.log(response.data.users[1]._id);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term and selected filter
  const filteredUsers = users
    .filter((user) => {
      switch (filter) {
        case "All":
          return true;
        case "New":
          return user.isNew;
        case "Archived":
          return user.isArchived;
        default:
          return true;
      }
    })
    .filter((user) =>
      `${user.firstname} ${user.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  // Handle dropdown button click
  const handleDropdownClick = (event, userId) => {
    setSelectedUserId(userId);
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  // Handle mark as read
  const handleMarkAsRead = (userId, e) => {
    e.stopPropagation();
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, isNew: false } : user
      )
    );
    handleDropdownClose();
  };

  // Handle delete user
  const handleDelete = (userId, e) => {
    e.stopPropagation();
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    handleDropdownClose();
  };

  // Handle archive user
  const handleArchive = (userId, e) => {
    e.stopPropagation();
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, isArchived: true } : user
      )
    );
    handleDropdownClose();
  };

  // Handle mute
  const handleMute = (userId, e) => {
    e.stopPropagation();
    setSelectedUserId(userId);
    setMuteDialogOpen(true);
  };

  // Handle unmute
  const handleUnmute = (userId, e) => {
    e.stopPropagation();
    setMutedUsers((prevMutedUsers) =>
      prevMutedUsers.filter((user) => user.userId !== userId)
    );
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000); // Close toast after 3 seconds
    handleDropdownClose(); // Close dropdown when unmute happens
  };

  // Handle mute duration change
  const handleMuteDurationChange = (event) => {
    setMuteDuration(event.target.value);
  };

  // Mute user for the specified duration
  const muteUser = () => {
    setMutedUsers((prevMutedUsers) => [
      ...prevMutedUsers,
      { userId: selectedUserId, muteUntil: Date.now() + muteDuration * 60000 },
    ]);
    setMuteDialogOpen(false);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000); // Close toast after 3 seconds
    handleDropdownClose(); // Close dropdown when mute happens
  };

  // Loader component
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

  // Check if user is muted
  const isMuted = (userId) => {
    const mutedUser = mutedUsers.find((user) => user.userId === userId);
    return mutedUser && mutedUser.muteUntil > Date.now();
  };

  // Group creation function
  const handleGroupCreate = (groupName) => {
    const newGroup = {
      id: Date.now(), // or generate a unique ID
      name: groupName,
      isGroup: true,
      isNew: true,
      profilePic: null,
      message: `${groupName} created!`,
    };

    // Add the new group at the top of the list
    setUsers([newGroup, ...users]);
    setGroupSidebarOpen(false);
  };

  return (
    <div
      style={{
        width: "22rem",
        backgroundColor: "#F7F4FF",
        borderRight: "1px solid #e0e0e0",
        position: "relative",
      }}
    >
      {/* Chat heading */}
      <div
        style={{
          padding: "16px",
          fontSize: "24px",
          fontWeight: "bold",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Chat
        {/* Create Group Icon */}
        <IconButton
          onClick={() => setGroupSidebarOpen(true)}
          style={{
            marginLeft: "auto",
          }}
        >
          <GroupAdd />
        </IconButton>
      </div>

      {/* Search bar */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e0e0e0" }}>
        <TextField
          variant="outlined"
          placeholder="Search contact / chat"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Fixed typo here
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
        {["All", "New", "Archived"].map((option) => (
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

      {/* Error message */}
      {error && (
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            color: "red",
          }}
        >
          {error}
        </div>
      )}

      {/* Scrollable list container */}
      <div
        style={{
          padding: "8px",
          overflowY: "auto",
          height: "calc(100vh - 320px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#D3D3D3 #f7f7f7", // Firefox (thumb and track color)
        }}
      >
        <List>
          {loading ? (
            <Loader />
          ) : (
            filteredUsers.map((user) => (
              <ListItem
                button
                key={user._id || user.id}
                onClick={() => onSelectUser(user)}
                sx={{
                  padding: "8px 16px",
                  borderBottom: "1px solid #e0e0e0",
                  ":hover": {
                    backgroundColor: "#e8f0fe",
                    cursor: "pointer", // This will change the cursor to a pointer
                  },
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
                    <Person />
                  )}
                </Avatar>
                <ListItemText
                  primary={
                    user.isGroup
                      ? user.name
                      : `${user.firstname} ${user.lastname}`
                  }
                  secondary={user.message || "No message"}
                />
                {isMuted(user._id || user.id) && (
                  <NotificationsOff
                    style={{
                      color: "lightcoral", // Light red color for muted users
                      marginLeft: "8px",
                    }}
                  />
                )}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick(e, user._id || user.id);
                  }}
                >
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={selectedUserId === (user._id || user.id)}
                  onClose={handleDropdownClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    onClick={(e) => handleMarkAsRead(user._id || user.id, e)}
                  >
                    Mark as Reads
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => handleDelete(user._id || user.id, e)}
                  >
                    Delete
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => handleArchive(user._id || user.id, e)}
                  >
                    Archive
                  </MenuItem>
                  <MenuItem onClick={(e) => handleMute(user._id || user.id, e)}>
                    Mute
                  </MenuItem>
                  {isMuted(user._id || user.id) && (
                    <MenuItem
                      onClick={(e) => handleUnmute(user._id || user.id, e)}
                    >
                      Unmute
                    </MenuItem>
                  )}
                </Menu>
              </ListItem>
            ))
          )}
        </List>
      </div>

      {/* Group Sidebar (Modal) */}
      {groupSidebarOpen && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "22rem",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <GroupSidebar
            open={groupSidebarOpen}
            onClose={() => setGroupSidebarOpen(false)}
            users={users}
            onGroupCreate={handleGroupCreate} // Pass handleGroupCreate function
          />
        </Box>
      )}

      {/* Mute Dialog */}
      <Dialog open={muteDialogOpen} onClose={() => setMuteDialogOpen(false)}>
        <DialogTitle>Mute User</DialogTitle>
        <DialogContent>
          <TextField
            label="Mute Duration (minutes)"
            type="number"
            value={muteDuration}
            onChange={handleMuteDurationChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMuteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={muteUser} color="primary">
            Mute
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {mutedUsers.find((user) => user.userId === selectedUserId)
            ? "User has been muted!"
            : "User has been unmuted!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ChatList;
