import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  Button,
  TextField,
  Avatar
} from '@mui/material';
import React, { useState } from 'react';
import Navbar from './Navbar';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('edit');
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'edit':
        return (
          <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Left: Image Upload */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Edit Profile</Typography>
              <Avatar
                src={imagePreview}
                sx={{ width: 100, height: 100 }}
              />
              <Button variant="contained" component="label">
                Upload
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>
            </Box>

            {/* Right: Form */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Your Name"
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Email"
                  margin="normal"
                  fullWidth
                />
              </Box>

              <Box>
                <TextField
                  label="@"
                  margin="normal"
                  fullWidth
                />
                <Typography variant="body2" sx={{ color: 'gray', mt: 0.5 }}>
                  Username will be used and searchable by other users.
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Bio"
                  multiline
                  rows={4}
                  margin="normal"
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
        );

      case 'password':
        return (
          <Box>
            <Typography variant="h6">Change Password</Typography>
            <Box sx={{display:'flex',flexDirection:'column',gap:2 ,width:300}}>
            <TextField
              label="Current Password"
              type="password"
              
              margin="normal"
            />
            <TextField
              label="New Password"
              type="password"
   
              margin="normal"
            />
       </Box>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Update 
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', minHeight: 480, p: 2 }}>
        {/* Left Vertical Navbar */}
        <Paper elevation={3} sx={{ width: 200, mr: 3 }}>
          <List>
            <Typography variant='h5' sx={{p:2,textAlign:'center'}} >Settings</Typography>
            <ListItemButton
              selected={activeTab === 'edit'}
              onClick={() => setActiveTab('edit')}
            >
              <ListItemText primary="Edit Profile" />
            </ListItemButton>
            <ListItemButton
              selected={activeTab === 'password'}
              onClick={() => setActiveTab('password')}
            >
              <ListItemText primary="Change Password" />
            </ListItemButton>
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

export default Settings;
