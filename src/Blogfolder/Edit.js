import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton
} from '@mui/material';
import ReactQuill from 'react-quill';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useParams, useNavigate, data } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import Navbar2 from './Navbar2';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [postContent, setPostContent] = useState('');
  const [imageName, setImageName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {

    const fetchAllData = async () => {
      try {
        // Fetch categories and subcategories first
        const [catRes, subRes] = await Promise.all([
          fetch('http://localhost:5000/categories'),
          fetch('http://localhost:5000/subcategories'),
        ]);

        const catData = await catRes.json();
        const subData = await subRes.json();

        setCategories(catData);
        setSubcategories(subData);

        // Now fetch the blog after subcategories are loaded
        const blogRes = await fetch(`http://localhost:5000/api/blogs/${id}`);
        if (!blogRes.ok) throw new Error('Failed to fetch blog');
        const blog = await blogRes.json();

        setTitle(blog.title);
        setCategory(blog.category);
        setSubcategory(blog.subcategory);
        setPostContent(blog.content);
        setImageName(blog.image_name || '');
        setLoading(false);

        
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      setImageFile(file);
    }
  };

  const handleUpdate = async () => {
    try {
      debugger
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('subcategory', subcategory);
      formData.append('content', postContent);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update blog');

      alert('Blog updated successfully!');
      navigate('/posts');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Error updating blog');
    }
  };

  if (loading) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading...</Typography>;

  return (
    <>
      <Navbar2 />
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 4 }}>
          <Link to="/posts">
            <IconButton color="primary"><ArrowBackIcon /></IconButton>
          </Link>
        </Box>

        <Paper
          sx={{
            maxWidth: 700,
            margin: 'auto',
            p: 3,
            borderRadius: 3,
            boxShadow: 5,
            backgroundColor: '#f5f5f5'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
            Update Blog
          </Typography>

          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory('');
              }}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Subcategory</InputLabel>
            <Select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              label="Select Subcategory"
            >
              <MenuItem value="" disabled>
                -- Choose a Subcategory --
              </MenuItem>
              {subcategories
                .filter((sub) => sub.categoryName === category)
                .map((sub) => (
                  <MenuItem key={sub.id} value={sub.name}>
                    {sub.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ textTransform: 'none', mt: 2 }}
          >
            {imageName || 'Select Image'}
            <input type="file" hidden onChange={handleImageChange} />
          </Button>

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Post Content
          </Typography>

          <ReactQuill
            theme="snow"
            value={postContent}
            onChange={setPostContent}
            style={{ height: '200px', marginBottom: '40px' }}
            placeholder="Write your post here..."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['clean'],
              ],
            }}
          />

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Edit;
