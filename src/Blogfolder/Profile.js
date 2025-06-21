import { Box, Paper, Typography, Button } from '@mui/material';
import React from 'react';
import avatar1 from "./Images/avatar1.png";
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Profile = () => {
  const publishedDate = new Date();
  const formattedDate = publishedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  return (
    <>
    <Navbar />
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={3}
        sx={{
          width: 700,
          height: 500,
          display: 'flex',
          p: 3,
          gap: 4,
          borderRadius: 2,
        }}
      >
        {/* Left Side - Section Title */}
        <Box
          sx={{
            width: 480,
          
            display: 'flex',
   
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Published Blogs
          </Typography>
        </Box>

        {/* Right Side - Fully Right-Aligned */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          {/* Avatar and Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              component="img"
              src={avatar1}
              alt="Profile Avatar"
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #1976d2',
              }}
            />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                @kumar51
              </Typography>
              <Typography variant="h6" color="text.secondary">
                kumarvarma
              </Typography>

                <Button
            component={Link}
            to="/setting"
            variant="outlined"
            sx={{ textTransform: 'none', mb:2,mt:2 }}
          >
            Edit Profile
          </Button>

              <Typography variant="body1" sx={{ mt: 2 }}>
                Blogs: 0
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Published: {formattedDate}
              </Typography>
            </Box>
          </Box>

          {/* Edit Button aligned to right */}
        
        </Box>
      </Paper>
    </Box>
    </>
  );
};

export default Profile;
