import React, { useState } from "react";
import { Box } from "@mui/material";
import StoryList from "./StoryList"; // Import the StoryList component
import StoryDetail from "./StoryDetail"; // Import the StoryDetail component
import WelcomeStories from "./WelcomeStories"; // Import the WelcomeStories component

const Stories = () => {
  const [selectedStory, setSelectedStory] = useState(null);

  // Handle the selection of a story
  const handleSelectStory = (story) => {
    setSelectedStory(story); // Update the selected story state
  };

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
      {/* StoryList component */}
      <StoryList onSelectStory={handleSelectStory} />

      {/* Show WelcomeStories if no story is selected */}
      {!selectedStory && <WelcomeStories />}

      {/* Show StoryDetail if a story is selected */}
      {selectedStory && (
        <Box sx={{ width: "70%", borderLeft: "1px solid #e0e0e0" }}>
          <StoryDetail selectedStory={selectedStory} />
        </Box>
      )}
    </Box>
  );
};

export default Stories;
