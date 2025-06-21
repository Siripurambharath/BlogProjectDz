import React, { useEffect, useState } from 'react';
import {
  Box, Typography,  TextField, Button, Grid,Paper,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import Navbar2 from './Navbar2';

const PIE_COLORS = ['#0088FE', '#FF8042'];

const Dashboard = () => {
  const [blogStats, setBlogStats] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [catSubStats, setCatSubStats] = useState({ categoryCount: 0, subcategoryCount: 0 });
  const [startDate, setStartDate] = useState('');

  const fetchData = async () => {
    const params = {};
    if (startDate) {
      params.startDate = startDate;
    }

    try {
      const [statsRes, categoriesRes, subcategoriesRes, catSubStatsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/blog-stats', { params }),
        axios.get('http://localhost:5000/categories'),
        axios.get('http://localhost:5000/subcategories'),
      ]);

      setBlogStats(statsRes.data);
      setCategoryList(categoriesRes.data);
      setSubcategoryList(subcategoriesRes.data);
      setCatSubStats(catSubStatsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData(); // Initial load
  }, []);

  const handleFilter = () => {
    if (startDate) {
      fetchData();
    } else {
      alert("Please select a start date");
    }
  };

  return (
    <>
      <Navbar2 />
      <Box p={3}>

            <Typography variant="h5" sx={{ textShadow: 1, color: '#2196f3', fontWeight: 'bold', mb: 3 }}>
     Dashboard Table
        </Typography>
        {/* Date Filter Section */}
        <Grid container spacing={2} sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
          <Grid item xs={12} md={3}>
            <TextField
            size='small'
              label="Start Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleFilter}
              sx={{ height: '100%' }}
            >
              Filter
            </Button>
          </Grid>
        </Grid>

       

        {/* Bar Chart Section */}
        <Typography variant="h5" sx={{ textShadow: 1, color: '#2196f3', fontWeight: 'bold', mb: 3 }}>
          Blog Posts 
        </Typography>
<Paper sx={{boxShadow:3,height:420}}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={blogStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="likes" fill="#4caf50" name="Likes" />
            <Bar dataKey="unlikes" fill="#f44336" name="Unlikes" />
            <Bar dataKey="comments" fill="#2196f3" name="Comments" />
            <Bar dataKey="replies" fill="#ff9800" name="Replies" />
          </BarChart>
        </ResponsiveContainer>
</Paper>
        {/* Pie Chart Section */}
        <Typography variant="h5" sx={{ textShadow: 1, color: '#9c27b0', fontWeight: 'bold', mt: 5, mb: 3 }}>
          Categories vs Subcategories (Pie Chart)
        </Typography>
<Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}} >
<Paper sx={{width:450, height:330, display:'flex',justifyContent:'center'}}>
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Categories', value: categoryList.length },
                { name: 'Subcategories', value: subcategoryList.length }
              ]}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {[{ name: 'Categories', value: categoryList.length }, { name: 'Subcategories', value: subcategoryList.length }].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
