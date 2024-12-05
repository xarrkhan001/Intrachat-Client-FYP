import React, { useState } from "react";
import { Box } from "@mui/material";
import ContactList from "./ContactList"; // Import the ContactList component
import UserProfile from "./UserProfile"; // Import the UserProfile component
import WelcomeContact from "./WelcomeContact"; // Import the WelcomeContact component

const Contacts = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  // Handle the selection of a contact
  const handleSelectContact = (contact) => {
    setSelectedContact(contact); // Update the selected contact state
  };

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
      {/* ContactList component */}
      <ContactList onSelectContact={handleSelectContact} />

      {/* Show WelcomeContact if no contact is selected */}
      {!selectedContact && <WelcomeContact />}

      {/* Show UserProfile if a contact is selected */}
      {selectedContact && (
        <Box sx={{ width: "70%", borderLeft: "1px solid #e0e0e0" }}>
          <UserProfile contact={selectedContact} />
        </Box>
      )}
    </Box>
  );
};

export default Contacts;
