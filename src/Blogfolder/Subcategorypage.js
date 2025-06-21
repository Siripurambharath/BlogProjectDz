import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, Avatar, Divider, IconButton, Modal, TextField, Paper, Button
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import avatarImage from './Images/avatar1.png';
import Navbar from './Navbar';

const SubcategoryPage = () => {
  const { subcategoryName } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/blogs');
        const posts = res.data;

        const filtered = posts.filter(
          post => post.subcategory.toLowerCase() === subcategoryName.toLowerCase()
        );

        const blogsWithStats = await Promise.all(
          filtered.map(async (post) => {
            try {
              const [commentRes, likeRes, unlikeRes] = await Promise.all([
                axios.get(`http://localhost:5000/comment-count/${post.id}`),
                axios.get(`http://localhost:5000/like/${post.id}`),
                axios.get(`http://localhost:5000/unlike/${post.id}`)
              ]);
              return {
                ...post,
                comments: Number(commentRes.data.commentCount) || 0,
                likes: Number(likeRes.data.likeCount) || 0,
                unlikes: Number(unlikeRes.data.unlikeCount) || 0
              };
            } catch {
              return { ...post, comments: 0, likes: 0, unlikes: 0 };
            }
          })
        );

        setBlogs(blogsWithStats);
      } catch (err) {
        console.error('Error loading subcategory blogs:', err);
      }
    };

    fetchBlogs();
  }, [subcategoryName]);

  const handleLike = async (postId) => {
    try {
      await axios.post('http://localhost:5000/like', { post_id: postId });
      const res = await axios.get(`http://localhost:5000/like/${postId}`);
      setBlogs(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, likes: Number(res.data.likeCount) || 0 } : post
        )
      );
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await axios.post('http://localhost:5000/unlike', { post_id: postId });
      const res = await axios.get(`http://localhost:5000/unlike/${postId}`);
      setBlogs(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, unlikes: Number(res.data.unlikeCount) || 0 } : post
        )
      );
    } catch (err) {
      console.error('Unlike failed', err);
    }
  };

  const handleOpenModal = async (postId) => {
    setActivePostId(postId);
    setOpenModal(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/comment/${postId}`);
      setComments(res.data || []);
    } catch (err) {
      console.error('Failed to load comments', err);
      setComments([]);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCommentText('');
    setComments([]);
    setReplyTexts({});
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/comment', {
        post_id: activePostId,
        comment: commentText
      });

      const res = await axios.get(`http://localhost:5000/comment-count/${activePostId}`);
      setBlogs(prev =>
        prev.map(post =>
          post.id === activePostId ? { ...post, comments: Number(res.data.commentCount) || 0 } : post
        )
      );

      handleOpenModal(activePostId);
      setCommentText('');
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  const handleReplySubmit = async (commentId) => {
    try {
      await axios.post('http://localhost:5000/reply', {
        comment_id: commentId,
        reply: replyTexts[commentId] || ''
      });

      const res = await axios.get(`http://localhost:5000/replies/${commentId}`);
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? { ...comment, replies: res.data } : comment
        )
      );
      setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
    } catch (err) {
      console.error('Failed to submit reply:', err);
    }
  };

  const handleReplyChange = (commentId, text) => {
    setReplyTexts(prev => ({ ...prev, [commentId]: text }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <>
      <Navbar />
      <Box p={3} sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Posts in Subcategory: {subcategoryName}
        </Typography>

        {blogs.length === 0 ? (
          <Typography>No posts available in this subcategory.</Typography>
        ) : (
          blogs.map((post, index) => (
            <React.Fragment key={post.id}>
              <Box sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', border: '1px solid black', width: 50, borderRadius: '20%', mt: 1, mb: 2 }}>
                  <Link to="/home">
                    <IconButton color="primary"><ArrowBackIcon /></IconButton>
                  </Link>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar src={avatarImage} sx={{ width: 56, height: 56 }} />
                    <Typography variant="caption" color="text.secondary" mt={1}>
                      {formatDate(post.published_date)}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {post.title}
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary">
                      Category: <strong>{post.category}</strong> | Subcategory: <strong>{post.subcategory}</strong>
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
                      <IconButton onClick={() => handleLike(post.id)} size="small">
                        <ThumbUpIcon sx={{ color: '#4caf50' }} />
                      </IconButton>
                      <Typography variant="caption">{post.likes}</Typography>

                      <IconButton onClick={() => handleUnlike(post.id)} size="small">
                        <ThumbDownIcon sx={{ color: '#f44336' }} />
                      </IconButton>
                      <Typography variant="caption">{post.unlikes}</Typography>

                      <IconButton size="small" onClick={() => handleOpenModal(post.id)}>
                        <ChatBubbleOutlineIcon sx={{ color: '#ff9800' }} />
                      </IconButton>
                      <Typography variant="caption">{post.comments}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        onError={(e) => { e.target.src = '/fallback-image.png'; }}
                        style={{ width: 650, height: 400, objectFit: 'cover', borderRadius: 8 }}
                      />
                    </Box>

                    <Box
                      sx={{
                        mb: 4,
                        maxWidth: 700,
                        width: '100%',
                        px: 2,
                        lineHeight: 1.8,
                        fontSize: '1.05rem',
                        textAlign: 'justify',
                      }}
                      dangerouslySetInnerHTML={{ __html: post.content || '<p>No content available.</p>' }}
                    />
                  </Box>
                </Box>
              </Box>

              {index < blogs.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </Box>

      {/* Right-side Comment Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{ display: 'flex', justifyContent: 'flex-end', mt: 8, mr: 4 }}
      >
        <Paper sx={{ width: 400, p: 3, maxHeight: '90vh', overflowY: 'auto' }}>
          <Typography variant="h6" mb={2}>Comments</Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button onClick={handleCommentSubmit} variant="contained" sx={{ mt: 1 }}>
            Submit
          </Button>

          <Divider sx={{ my: 2 }} />

          {comments.length === 0 ? (
            <Typography>No comments yet.</Typography>
          ) : (
            comments.map((comment) => (
              <Box key={comment.id} sx={{ mb: 3 }}>
                <Typography variant="subtitle2">{comment.comment}</Typography>

                {comment.replies?.map((reply, i) => (
                  <Box key={i} sx={{ ml: 2, mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">↳ {reply.reply}</Typography>
                  </Box>
                ))}

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Reply..."
                  value={replyTexts[comment.id] || ''}
                  onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                  sx={{ mt: 1 }}
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleReplySubmit(comment.id)}
                  sx={{ mt: 1 }}
                >
                  Reply
                </Button>
              </Box>
            ))
          )}
        </Paper>
      </Modal>
    </>
  );
};

export default SubcategoryPage;
