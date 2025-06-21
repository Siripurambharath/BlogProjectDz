import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Select,
  Button,
  IconButton,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar2 from './Navbar2';

const Writetext = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [postContent, setPostContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          fetch('http://localhost:5000/categories'),
          fetch('http://localhost:5000/subcategories'),
        ]);
        const catData = await catRes.json();
        const subData = await subRes.json();
        setCategories(catData);
        setSubcategories(subData);
      } catch (error) {
        console.error('Error fetching categories and subcategories:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
const selectedCategory = categories.find((c) => c.id === Number(category));
const filteredSubcategories = subcategories.filter(
  (sub) => sub.category_id === Number(category)
);

    const selectedSubcategory = subcategories.find((s) => s.id === Number(subcategory));


 
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', selectedCategory?.name || '');
    formData.append('subcategory', selectedSubcategory?.name || 'null');
    formData.append('content', postContent);
    formData.append('image', imageFile);

    try {
      const res = await fetch('http://localhost:5000/blog', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Blog submitted!');
        setTitle('');
        setCategory('');
        setSubcategory('');
        setPostContent('');
        setImageFile(null);
        setImageName('');
      } else {
        alert('Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const filteredSubcategories = subcategories.filter((sub) => {
    const selectedCat = categories.find((c) => c.id === Number(category));
    return sub.categoryName === selectedCat?.name;
  });

  return (
    <>
      <Navbar2 />
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 4 }}>
          <Link to="/posts">
            <IconButton color="primary"><ArrowBackIcon /></IconButton>
          </Link>
        </Box>

        <Paper
          sx={{
            width: 600,
            margin: 'auto',
            p: 2,
            borderRadius: 3,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Typography variant="h4" align="center" fontWeight="bold">
            Create Blog
          </Typography>

          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Category Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory('');
              }}
              label="Select Category"
            >
              <MenuItem value="" disabled>
                -- Choose a Category --
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Subcategory Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Subcategory</InputLabel>
            <Select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              label="Select Subcategory"
              disabled={!category || filteredSubcategories.length === 0}
            >
              <MenuItem value="" disabled>
                -- Choose a Subcategory --
              </MenuItem>
              {filteredSubcategories.map((sub) => (
                <MenuItem key={sub.id} value={sub.id}>
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Image Upload */}
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            {imageName || 'Select Image'}
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                  setImageName(file.name);
                }
              }}
            />
          </Button>

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Post Content
          </Typography>

          <ReactQuill
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

          <Button variant="contained" component={Link} to="/posts" sx={{ mt: 2 }} onClick={handleSubmit}>
            SUBMIT
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default Writetext;
