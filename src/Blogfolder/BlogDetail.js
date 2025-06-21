import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box, Paper, Typography, Avatar, IconButton, TextField, Button, Chip, Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import axios from 'axios';
import avatarImage from './Images/avatar1.png';
import Navbar from './Navbar';
import CloseIcon from '@mui/icons-material/Close';


const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);
  const [repliesMap, setRepliesMap] = useState({});
  const [openComment, setOpenComment] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [unlikeCount, setUnlikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  const getRandomColor = () => {
    const colors = ['#e3f2fd', '#f3e5f5', '#e8f5e9', '#fff3e0', '#fbe9e7', '#f1f8e9', '#e0f7fa', '#e8eaf6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const refreshCounts = async () => {
    try {
      const [likeRes, unlikeRes, commentRes] = await Promise.all([
        axios.get(`http://localhost:5000/like/${id}`),
        axios.get(`http://localhost:5000/unlike/${id}`),
        axios.get(`http://localhost:5000/comments/${id}`),
      ]);
      setLikeCount(likeRes.data.likeCount || 0);
      setUnlikeCount(unlikeRes.data.unlikeCount || 0);
      setCommentCount(commentRes.data.length || 0);
    } catch (error) {
      console.error('Error refreshing counts:', error);
    }
  };

  const fetchRepliesForComment = async (commentId) => {
    try {
      const res = await axios.get(`http://localhost:5000/replies/${commentId}`);
      setRepliesMap(prev => ({ ...prev, [commentId]: res.data }));
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(res.data);
    } catch (error) {
      console.error('Failed to fetch blog', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/comments/${id}`);
      setComments(res.data);

      // Fetch replies for each comment
      res.data.forEach(comment => {
        fetchRepliesForComment(comment.id);
      });
    } catch (error) {
      console.error('Failed to fetch comments', error);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchCategories();
    fetchComments();
    refreshCounts();

    const retryTimeout = setTimeout(() => {
      refreshCounts();
    }, 1500);

    return () => clearTimeout(retryTimeout);
  }, [id]);

  const handleLike = async () => {
    try {
      await axios.post('http://localhost:5000/like', { post_id: id });
      refreshCounts();
    } catch (error) {
      console.error('Error liking post', error);
    }
  };

  const handleUnlike = async () => {
    try {
      await axios.post('http://localhost:5000/unlike', { post_id: id });
      refreshCounts();
    } catch (error) {
      console.error('Error unliking post', error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/comment', { post_id: id, comment: commentText });
      setCommentText('');
      fetchComments();
      refreshCounts();
    } catch (error) {
      console.error('Error submitting comment', error);
    }
  };

const handleReplySubmit = async () => {
  try {
    await axios.post('http://localhost:5000/reply', {
      comment_id: currentCommentId,
      reply: replyText
    });
    setReplyText('');
    setReplyDialogOpen(false);
    fetchRepliesForComment(currentCommentId);
    refreshCounts();

    // ✅ Show success alert
    window.alert('Reply submitted successfully!');
  } catch (error) {
    console.error('Failed to submit reply', error);
    window.alert('Failed to submit reply. Please try again.');
  }
};


  if (!blog) {
    return <Typography sx={{ mt: 5, textAlign: 'center' }}>Loading...</Typography>;
  }

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', justifyContent: 'center', backgroundColor:'#cfd8dc '  }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%', maxWidth: 1200 }}>
          {/* Left Side */}
          <Box sx={{ flex: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems:'center',border: '1px solid black',width:50,borderRadius:'20%',mt:2 }}>
              <Link to="/home">
                <IconButton color="primary"><ArrowBackIcon /></IconButton>
              </Link>
            </Box>

            <Box sx={{ p: 3,}}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                  <Avatar src={avatarImage} alt="Author" sx={{ width: 56, height: 56 }} />
                  <Typography variant="body2" color="text.secondary">
                    {blog.published_date ? formatDate(blog.published_date) : 'Date unavailable'}
                  </Typography>
                </Box>
<Box
  sx={{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    mt: 2,
  }}
>
  <Box
    sx={{
      display: 'flex',                 
      flexDirection: 'row',
      justifyContent:'center',
      alignItems:'center',
      border: '1px solid #9e9e9e',
      borderRadius: '12px',            
      p: 1,                              
       
      gap: 1                            
    }}
  >
    <IconButton color="primary" onClick={handleLike}>
      <ThumbUpIcon />
    </IconButton>
    <Typography>{likeCount}</Typography>

    <IconButton color="error" onClick={handleUnlike}>
      <ThumbDownIcon />
    </IconButton>
    <Typography>{unlikeCount}</Typography>

    <IconButton color="secondary" onClick={() => setOpenComment(!openComment)}>
      <ChatBubbleOutlineIcon />
    </IconButton>
    <Typography>{commentCount}</Typography>
  </Box>
</Box>


              </Box>
            <Box >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 3 }}>{blog.title}</Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>{blog.subtitle}</Typography>

              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start' }}>
                <img
                  src={`http://localhost:5000/image/${blog.id}`}
                  alt={blog.title}
                  style={{ width: 650, maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
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
    '& p': {
      marginBottom: '1.2rem',
    },
    '& h1, & h2, & h3': {
      fontWeight: 'bold',
      mt: 3,
      mb: 1.5,
    },
    '& ul': {
      pl: 3,
      mb: 2,
    },
    '& li': {
      mb: 1,
    },
  }}
  dangerouslySetInnerHTML={{ __html: blog.content || '<p>No content available.</p>' }}
/>


              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>Categories:</Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {categories.map((cat) => (
                    <Chip
                      key={cat.id}
                      label={cat.name}
                      sx={{
                        mr: 1,
                        mb: 1,
                        backgroundColor: blog.category === cat.name ? '#90caf9' : getRandomColor(),
                        fontWeight: blog.category === cat.name ? 'bold' : 'medium',
                        px: 1.5, py: 1
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>
            </Box>
          </Box>

          {/* Right Side: Comments */}
{openComment && (
  <Box
    sx={{
      flex: 1.2,
      p: 2,
      height: 'calc(100vh - 100px)',
      overflowY: 'auto',
      position: 'sticky',
      top: 80,
      backgroundColor: '#d7ccc8',
      borderRadius: 2,
      boxShadow: 3,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Comments ({commentCount})
      </Typography>
      <IconButton onClick={() => setOpenComment(false)} color="error">
        <CloseIcon />
      </IconButton>
    </Box>


              <TextField
                fullWidth
                multiline
                rows={3}
                label="Add a comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button fullWidth variant="contained" onClick={handleCommentSubmit} sx={{ mb: 2 }}>
                Submit
              </Button>

              {comments.length === 0 ? (
                <Typography color="text.secondary">No comments yet.</Typography>
              ) : (
                comments.map((comment) => (
                  <Box key={comment.id} sx={{ mb: 2, p: 1, backgroundColor: '#cfd8dc ' , borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={avatarImage} sx={{ width: 28, height: 28 }} />
                      <Typography variant="body1">{comment.comment}</Typography>
                    </Box>
                    <Button
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setCurrentCommentId(comment.id);
                        setReplyDialogOpen(true);
                      }}
                    >
                      Reply
                    </Button>

                    {repliesMap[comment.id] && repliesMap[comment.id].length > 0 && (
                      <Box sx={{ ml: 4, mt: 1 }}>
                        {repliesMap[comment.id].map((reply) => (
                          <Box key={reply.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1,backgroundColor:'#cfd8dc '  }}>
                            <Avatar src={avatarImage} sx={{ width: 20, height: 20 }} />
                            <Typography variant="body2" color="text.secondary">{reply.reply}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))
              )}

              {replyDialogOpen && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Your reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleReplySubmit}>Reply</Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default BlogDetail;
