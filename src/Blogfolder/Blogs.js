import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import axios from 'axios';

import Navbar from './Navbar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const [activeTab, setActiveTab] = useState('Blogs');
  const [blogs, setBlogs] = useState([]);

  // Helper to format date as DD/MM
  const formatDateDM = (dateStr) => {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;

    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return `${formattedDay}/${formattedMonth}`;
  };

  // Fetch blog data from backend
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/blogs');
      // Sort blogs by published_date descending (newest first)
      const sortedBlogs = res.data.sort(
        (a, b) => new Date(b.published_date) - new Date(a.published_date)
      );
      setBlogs(sortedBlogs);
    } catch (err) {
      console.error('Failed to fetch blogs', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`);
        alert('Blog deleted successfully');
        fetchBlogs(); // refresh list
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete blog');
      }
    }
  };

  const renderContent = () => {
    if (activeTab !== 'Blogs') return null;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" mb={2}>Published Blogs</Typography>

        {blogs.map((blog) => (
          <Box
            key={blog.id}
            sx={{
              display: 'flex',
          
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 2
            }}
          >
            {/* Left: Image */}
            <Box>
              <img
                src={`http://localhost:5000/image/${blog.id}`}
                alt={blog.title}
                style={{ width: 120, minHeight: 80, objectFit: 'cover', borderRadius: 7 }}
              />
            </Box>

            {/* Middle: Info */}
            <Box sx={{ flex: 1, ml: 2 }}>
              <Typography variant="h6">{blog.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Published: {formatDateDM(blog.published_date)}
              </Typography>

              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Link to={`/edit/${blog.id}`}>
                  <EditIcon sx={{ mr: 1, cursor: 'pointer' }} />
                </Link>
                <IconButton onClick={() => handleDelete(blog.id)}>
                  <DeleteIcon sx={{ cursor: 'pointer', color: 'red' }} />
                </IconButton>
              </Box>
            </Box>

            {/* Right: Likes & Comments */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1">Like</Typography>
              <Typography variant="subtitle2">{blog.likes}</Typography>
              <Typography variant="body1" mt={2}>Comment</Typography>
              <Typography variant="subtitle2">{blog.comments}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', minHeight: 480, p: 2 }}>
        {/* Sidebar */}
        <Paper elevation={3} sx={{ width: 200, mr: 3 }}>
          <List>
            <Typography variant='h5' sx={{ p: 2, textAlign: 'center' }}>Dashboard</Typography>
            <ListItemButton
              selected={activeTab === 'Blogs'}
              onClick={() => setActiveTab('Blogs')}
            >
              <ListItemText primary="Blogs" />
            </ListItemButton>
          </List>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 3 }}>
          {renderContent()}
        </Box>
      </Box>
    </>
  );
};

export default Blogs;
