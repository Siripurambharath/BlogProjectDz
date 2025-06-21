import React, { useEffect, useState } from 'react';
import {
  Box, Button, Input, Table, TableHead, TableRow,
  TableCell, TableBody, Typography, IconButton,
  CircularProgress, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // ✅ Only once
import { Link, useNavigate } from 'react-router-dom';
import Navbar2 from './Navbar2';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/blogs');
      setPosts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`);
        alert('Blog deleted successfully');
        fetchPosts();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete blog');
      }
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPosts = filteredPosts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (newPage) => {
    if (newPage < 0 || newPage >= Math.ceil(filteredPosts.length / rowsPerPage)) return;
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Navbar2 />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Posts Table
        </Typography>

        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
        >
          <Button
            sx={{ backgroundColor: '#ff5722', color: '#fff', width: 120, height: 40 }}
            component={Link}
            to="/writetext"
          >
            NEW ONE
          </Button>

          <Input
            placeholder="Search by Title"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            sx={{ width: 200, borderBottom: '1px solid #ccc' }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#a5d6a7' }}>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>ID</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>Title</TableCell>
<TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>Category</TableCell>
<TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>Subcategory</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>Image</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>Post Content</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>Actions</TableCell>
              
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell align="center">{post.id}</TableCell>
                    <TableCell align="center">{post.title}</TableCell>
<TableCell align="center">{post.category}</TableCell>
<TableCell align="center">{post.subcategory || '-'}</TableCell>
                    <TableCell align="center">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        width="150"
                        height="80"
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 300,
                          mx: 'auto',
                        }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                      <Button
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => navigate(`/single-blog/${post.id}`)}
                      >
                        Read More
                      </Button>
                    </TableCell>
<TableCell align="center">
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 0.5, // more spacing between icons
      height: '100%',
    }}
  >
    <IconButton
      component={Link}
      to={`/edit/${post.id}`}
      sx={{ color: '#1976d2' }}
    >
      <EditIcon />
    </IconButton>

    <IconButton onClick={() => handleDelete(post.id)} sx={{ color: 'red' }}>
      <DeleteIcon />
    </IconButton>
  </Box>
</TableCell>


                  </TableRow>
                ))}

                {paginatedPosts.length === 0 && (
                  <TableRow>
<TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      No posts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Box>
                Rows per page:{' '}
                <Select value={rowsPerPage} onChange={handleChangeRowsPerPage} size="small">
                  {[5, 10, 15].map((count) => (
                    <MenuItem key={count} value={count}>
                      {count}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <Button
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 0}
                  sx={{ mr: 1 }}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page >= Math.ceil(filteredPosts.length / rowsPerPage) - 1}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default Posts;
