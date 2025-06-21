// Home.js
import React, { useState, useEffect } from 'react';
import {
  Box, Avatar, Typography, Divider, TextField, Button, Chip, IconButton
} from '@mui/material';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import avatarImage from './Images/avatar1.png';
import Navbar from './Navbar';

const Home = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [openComment, setOpenComment] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [repliesMap, setRepliesMap] = useState({});
  const { categoryName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/blogs');
        const posts = res.data;

        const filteredPosts = categoryName
          ? posts.filter(post => post.category.toLowerCase() === categoryName.toLowerCase())
          : posts;

        const postsWithStats = await Promise.all(
          filteredPosts.map(async (post) => {
            try {
              const [commentRes, likeRes, unlikeRes] = await Promise.all([
                axios.get(`http://localhost:5000/comment-count/${post.id}`),
                axios.get(`http://localhost:5000/like/${post.id}`),
                axios.get(`http://localhost:5000/unlike/${post.id}`)
              ]);

              return {
                ...post,
                comments: Number(commentRes.data?.commentCount) || 0,
                likes: Number(likeRes.data.likeCount) || 0,
                unlikes: Number(unlikeRes.data.unlikeCount) || 0
              };
            } catch {
              return { ...post, comments: 0, likes: 0, unlikes: 0 };
            }
          })
        );

        setBlogPosts(postsWithStats);

        // ✅ Filter only subcategories that have blog posts
        const subRes = await axios.get('http://localhost:5000/subcategories');
        const allSubcategories = subRes.data;

        const usedSubcategories = allSubcategories.filter((sub) =>
          postsWithStats.some(post =>
            post.subcategory?.toLowerCase() === sub.name.toLowerCase()
          )
        );

        setSubcategories(usedSubcategories);
        
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchBlogs();
  }, [categoryName]);

  const handleLike = async (postId) => {
    try {
      await axios.post('http://localhost:5000/like', { post_id: postId });
      const res = await axios.get(`http://localhost:5000/like/${postId}`);
      setBlogPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: res.data.likeCount } : p));
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await axios.post('http://localhost:5000/unlike', { post_id: postId });
      const res = await axios.get(`http://localhost:5000/unlike/${postId}`);
      setBlogPosts(prev => prev.map(p => p.id === postId ? { ...p, unlikes: res.data.unlikeCount } : p));
    } catch (err) {
      console.error('Unlike error:', err);
    }
  };

  const handleOpenComments = async (postId) => {
    setSelectedPostId(postId);
    setOpenComment(true);
    setCommentText('');
    try {
      const res = await axios.get(`http://localhost:5000/comments/${postId}`);
      setComments(res.data);
      setCommentCount(res.data.length);

      const replyMap = {};
      for (const comment of res.data) {
        const replyRes = await axios.get(`http://localhost:5000/replies/${comment.id}`);
        replyMap[comment.id] = replyRes.data;
      }
      setRepliesMap(replyMap);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/comment', {
        post_id: selectedPostId,
        comment: commentText
      });
      handleOpenComments(selectedPostId);
    } catch (err) {
      console.error('Comment submit error:', err);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      await axios.post('http://localhost:5000/reply', {
        comment_id: currentCommentId,
        reply: replyText
      });
      setReplyText('');
      setReplyDialogOpen(false);
      handleOpenComments(selectedPostId);
    } catch (err) {
      console.error('Reply submit error:', err);
    }
  };

  const formatDate = (str) => {
    const d = new Date(str);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', justifyContent: 'center', backgroundColor: '#eceff1' }}>
        <Box sx={{ width: 1100, p: 3, display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 2 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              {categoryName ? `Posts in "${categoryName}"` : 'Latest Blog Posts'}
            </Typography>

            {/* ✅ Subcategory buttons only if they exist and have posts */}
            {categoryName && subcategories.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>Subcategories:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {subcategories.map((sub) => (
                    <Chip
                      key={sub.id}
                      label={sub.name}
                      clickable
                      onClick={() => navigate(`/subcategory/${sub.name}`)}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {blogPosts.map((post) => (
              <React.Fragment key={post.id}>
                <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Avatar src={avatarImage} sx={{ width: 40, height: 46 ,mb:2}} />
                    <Typography variant="body2">{formatDate(post.published_date)}</Typography>
                    <Typography variant="h6" fontWeight="bold">{post.title}</Typography>
                    <Box dangerouslySetInnerHTML={{ __html: post.content }} sx={{ mt: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Chip label={post.category} color="primary" />
                      <Box onClick={() => handleLike(post.id)} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ThumbUpIcon fontSize="small" color="success" /><Typography>{post.likes}</Typography>
                      </Box>
                      <Box onClick={() => handleUnlike(post.id)} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ThumbDownIcon fontSize="small" color="error" /><Typography>{post.unlikes}</Typography>
                      </Box>
                      <Box onClick={() => handleOpenComments(post.id)} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ChatBubbleOutlineIcon fontSize="small" color="warning" /><Typography>{post.comments}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <img
                      src={`http://localhost:5000/image/${post.id}`}
                      alt={post.title}
                      style={{ width: 250, height: 180, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </Box>
                </Box>
                <Divider />
              </React.Fragment>
            ))}
          </Box>

          {openComment && (
            <Box sx={{ flex: 1.2, p: 2, height: 'calc(100vh - 100px)', overflowY: 'auto', position: 'sticky', top: 80, backgroundColor: '#d7ccc8', borderRadius: 2, boxShadow: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Comments ({commentCount})</Typography>
                <IconButton onClick={() => setOpenComment(false)}><CloseIcon /></IconButton>
              </Box>
              <TextField fullWidth multiline rows={3} label="Add a comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} sx={{ mb: 2 }} />
              <Button fullWidth variant="contained" disabled={!commentText.trim()} onClick={handleCommentSubmit} sx={{ mb: 2 }}>
                Submit
              </Button>
              {comments.length === 0 ? (
                <Typography>No comments yet.</Typography>
              ) : comments.map((comment) => (
                <Box key={comment.id} sx={{ mb: 2, p: 1, backgroundColor: '#cfd8dc', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={avatarImage} sx={{ width: 28, height: 28 }} />
                    <Typography>{comment.comment}</Typography>
                  </Box>
                  <Button size="small" sx={{ mt: 1 }} onClick={() => { setCurrentCommentId(comment.id); setReplyDialogOpen(true); }}>
                    Reply
                  </Button>
                  {repliesMap[comment.id]?.map((reply) => (
                    <Box key={reply.id} sx={{ ml: 4, mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={avatarImage} sx={{ width: 20, height: 20 }} />
                      <Typography variant="body2">{reply.reply}</Typography>
                    </Box>
                  ))}
                </Box>
              ))}
              {replyDialogOpen && (
                <Box sx={{ mt: 2 }}>
                  <TextField fullWidth multiline rows={2} label="Your reply" value={replyText} onChange={(e) => setReplyText(e.target.value)} sx={{ mb: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" disabled={!replyText.trim()} onClick={handleReplySubmit}>Reply</Button>
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

export default Home;
