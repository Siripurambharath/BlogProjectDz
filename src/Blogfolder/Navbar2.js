import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import bloglogo from './Images/bloglogo.jpg';

const Navbar2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // You can clear auth data or tokens here
    navigate('/login');
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: '#ffcdd2'  }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' , }}>
<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
  {/* Logo Left */}
  <img
    src={bloglogo}
    alt="blog logo"
    style={{ height: 45, borderRadius: '50%', marginRight: 8 }}
  />
  <Typography variant="h5" sx={{color:'#ef5350',fontWeight:'bold'}}>Blog </Typography>
</Box>


          {/* Center Nav Links */}
          <Box sx={{ display: 'flex', gap: 3 }}>
        <Button
  component={Link}
  to="/dashboard"
  sx={{
    color: isActive('/dashboard') ? '#fff' : 'black',
    fontWeight: isActive('/dashboard') ? 'bold' : 'normal',
    backgroundColor: isActive('/dashboard') ? '#e57373' : 'transparent', // active background
    borderBottom: isActive('/dashboard') ? '2px solid white' : 'none',
    borderRadius: 0,
    '&:hover': {
      borderBottom: '2px solid #000', // on hover
      backgroundColor: isActive('/dashboard') ? '#e57373' : '#f8bbd0' // subtle hover
    }
  }}
>
  Dashboard
</Button>

<Button
  component={Link}
  to="/categories"
  sx={{
    color: isActive('/categories') ? '#fff' : 'black',
    fontWeight: isActive('/categories') ? 'bold' : 'normal',
    backgroundColor: isActive('/categories') ? '#e57373' : 'transparent',
    borderBottom: isActive('/categories') ? '2px solid white' : 'none',
    borderRadius: 0,
    '&:hover': {
      borderBottom: '2px solid #000',
      backgroundColor: isActive('/categories') ? '#e57373' : '#f8bbd0'
    }
  }}
>
  Categories
</Button>

<Button
  component={Link}
  to="/posts"
  sx={{
    color: isActive('/posts') ? '#fff' : 'black',
    fontWeight: isActive('/posts') ? 'bold' : 'normal',
    backgroundColor: isActive('/posts') ? '#e57373' : 'transparent',
    borderBottom: isActive('/posts') ? '2px solid white' : 'none',
    borderRadius: 0,
    '&:hover': {
      borderBottom: '2px solid #000',
      backgroundColor: isActive('/posts') ? '#e57373' : '#f8bbd0'
    }
  }}
>
  Posts
</Button>

          </Box>

          {/* Logout Right */}
          <IconButton onClick={handleLogout} sx={{ color: 'black' }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar2;
