import {
  AppBar,
  Box,
  Toolbar,
  TextField,
  InputAdornment,
  Button,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import bloglogo from './Images/bloglogo.jpg';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const [navItems, setNavItems] = useState([]);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        setNavItems(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Box sx={{backgroundColor:'#cfd8dc',}}>
<AppBar
  position="static"
  elevation={0} // ✅ Removes shadow
  sx={{
    width: '100vw',
    backgroundColor: 'transparent', 
    boxShadow: 'none',              
  }}
>
        <Toolbar sx={{ px: 2, display: 'flex' }}>
          {/* Left: Logo + Search */}
   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
     {/* Logo Left */}
     <img
       src={bloglogo}
       alt="blog logo"
       style={{ height: 45, borderRadius: '50%', marginRight: 8 }}
     />
   <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent:'space-between' }}>
  <Typography variant="h5" sx={{ color: '#42a5f5', fontWeight: 'bold' }}>
    Blog 
  </Typography>
</Box>

   </Box>

      <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    width: '100%', // Ensure full width for centering
    flexWrap: 'wrap', // Optional: handles small screen wrapping

  }}
>
  <Button
    component={Link}
    to="/home"
    sx={{
      fontSize: '1rem',
      color: '#4e342e',
      borderBottom: isActive('/home') ? '3px solid #388e3c' : '3px solid transparent',
      borderRadius: 0,
      px: 2,
      '&:hover': {
        backgroundColor: 'transparent',
        fontWeight: 'bold',
      },
    }}
  >
    Home
  </Button>

  {navItems.map((item, index) => (
    <Button
      key={index}
      component={Link}
      to={`/category/${encodeURIComponent(item.name.toLowerCase())}`}
      sx={{
        fontSize: '1rem',
        color: '#4e342e',
        borderBottom: isActive(`/category/${item.name.toLowerCase()}`) ? '3px solid #388e3c' : '3px solid transparent',
        borderRadius: 0,
        px: 2,
        '&:hover': {
          backgroundColor: 'transparent',
          fontWeight: 'bold',
        },
      }}
    >
      {item.name}
    </Button>
  ))}
</Box>



       
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
