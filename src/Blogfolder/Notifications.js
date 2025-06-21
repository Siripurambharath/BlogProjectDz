import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
} from '@mui/material';
import React, { useState } from 'react';
import Navbar from './Navbar';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('All');

  // Dummy notifications data for example
  const notificationsData = {
    All: [
      { id: 1, type: 'Like', text: 'User1 liked your post' },
      { id: 2, type: 'Comment', text: 'User2 commented: Nice!' },
      { id: 3, type: 'Like', text: 'User3 liked your photo' },
    ],
    Likes: [
      { id: 1, type: 'Like', text: 'User1 liked your post' },
      { id: 3, type: 'Like', text: 'User3 liked your photo' },
    ],
    Comments: [
      { id: 2, type: 'Comment', text: 'User2 commented: Nice!' },
    ],
  };

  const renderContent = () => {
    const notifications = notificationsData[activeTab] || [];

    return (
      <Box>
        <Typography variant="h6" mb={2}>{activeTab} Notifications</Typography>
        {notifications.length === 0 ? (
          <Typography>No {activeTab.toLowerCase()} notifications.</Typography>
        ) : (
          <List>
            {notifications.map((notif) => (
              <ListItemButton key={notif.id} sx={{ cursor: 'default' }}>
                <ListItemText primary={notif.text} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    );
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', minHeight: 480, p: 2 }}>
        {/* Left Vertical Navbar */}
        <Paper elevation={3} sx={{ width: 200, mr: 3 }}>
          <List>
            <Typography variant="h5" sx={{ p: 2, textAlign: 'center' }}>
              Notifications
            </Typography>

            {['All', 'Likes', 'Comments'].map((tab) => (
              <ListItemButton
                key={tab}
                selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                <ListItemText primary={tab} />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* Right Content */}
        <Paper elevation={3} sx={{ flex: 1, p: 3 }}>
          {renderContent()}
        </Paper>
      </Box>
    </>
  );
};

export default Notifications;
