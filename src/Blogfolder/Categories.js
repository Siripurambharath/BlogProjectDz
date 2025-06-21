import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Paper, IconButton, TextField, Button
} from '@mui/material';
import Navbar2 from './Navbar2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subCounts, setSubCounts] = useState({});
  const [newCategory, setNewCategory] = useState('');
  const [editCatId, setEditCatId] = useState(null);
  const [editCatValue, setEditCatValue] = useState('');
  const [newSub, setNewSub] = useState({ name: '', category_id: '' });
  const [editSubId, setEditSubId] = useState(null);
  const [editSubValue, setEditSubValue] = useState('');

  const fetchAll = async () => {
    const catRes = await axios.get('http://localhost:5000/categories');
    const cats = catRes.data.reverse();
    setCategories(cats);

    const subRes = await axios.get('http://localhost:5000/subcategories');
    setSubcategories(subRes.data.reverse());

    const counts = {};
    for (const cat of cats) {
      try {
        const response = await axios.get(`http://localhost:5000/subcategories/by-category/${cat.id}`);
        counts[cat.id] = response.data.length;
      } catch (err) {
        counts[cat.id] = 0;
      }
    }
    setSubCounts(counts);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert('Enter a category');

    const duplicate = categories.find(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase());
    if (duplicate) return alert('This category already exists!');

    await axios.post('http://localhost:5000/categories', { name: newCategory });
    setNewCategory('');
    alert('Category added successfully!');
    fetchAll();
  };

  const handleEditCategory = (cat) => {
    setEditCatId(cat.id);
    setEditCatValue(cat.name);
  };

  const handleSaveCategory = async (id) => {
    await axios.put(`http://localhost:5000/categories/${id}`, { name: editCatValue });
    setEditCatId(null);
    alert('Category updated successfully!');
    fetchAll();
  };

  const handleDeleteCategory = async (id) => {
    await axios.delete(`http://localhost:5000/categories/${id}`);
    alert('Category deleted successfully!');
    fetchAll();
  };

  const handleAddSub = async () => {
    if (!newSub.name.trim() || !newSub.category_id) return alert('Fill all subcategory fields');
    await axios.post('http://localhost:5000/subcategories', newSub);
    setNewSub({ name: '', category_id: '' });
    alert('Subcategory added successfully!');
    fetchAll();
  };

  const handleEditSub = (sub) => {
    setEditSubId(sub.id);
    setEditSubValue(sub.name);
  };

  const handleSaveSub = async (id) => {
    await axios.put(`http://localhost:5000/subcategories/${id}`, { name: editSubValue });
    setEditSubId(null);
    alert('Subcategory updated successfully!');
    fetchAll();
  };

  const handleDeleteSub = async (id) => {
    await axios.delete(`http://localhost:5000/subcategories/${id}`);
    alert('Subcategory deleted successfully!');
    fetchAll();
  };

  return (
    <>
      <Navbar2 />
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom> Categories </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          {/* === Category Section === */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2, justifyContent: 'center', alignItems: 'center' }}>
              <TextField
                sx={{ width: 200 }}
                fullWidth label="New Category"
                size='small'
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddCategory} startIcon={<AddIcon />} sx={{ backgroundColor: '#a5d6a7' }}>
                Add
              </Button>
            </Box>

            <Paper>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table >
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#a5d6a7' }}>
                      <TableCell sx={{textAlign:'center',color:'#fff', fontWeight:'bold',fontSize:'1.0rem'}}>S.No</TableCell>
                      <TableCell sx={{textAlign:'center',color:'#fff', fontWeight:'bold',fontSize:'1.0rem'}}>Category Name</TableCell>
                      <TableCell sx={{textAlign:'center',color:'#fff', fontWeight:'bold',fontSize:'1.0rem'}}>Subcategory Count</TableCell>
                      <TableCell sx={{textAlign:'center',color:'#fff', fontWeight:'bold',fontSize:'1.0rem'}}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((cat, i) => (
                      <TableRow key={cat.id}>
                        <TableCell align="center">{i + 1}</TableCell>
                        <TableCell align="center">
                          {editCatId === cat.id ? (
                            <TextField value={editCatValue} onChange={(e) => setEditCatValue(e.target.value)} />
                          ) : cat.name}
                        </TableCell>
                        <TableCell align="center">{subCounts[cat.id] ?? 0}</TableCell>
                        <TableCell align="center">
                          {editCatId === cat.id ? (
                            <IconButton onClick={() => handleSaveCategory(cat.id)} color="success"><SaveIcon /></IconButton>
                          ) : (
                            <IconButton onClick={() => handleEditCategory(cat)} color="primary"><EditIcon /></IconButton>
                          )}
                          <IconButton onClick={() => handleDeleteCategory(cat.id)} color="error"><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Box>

          {/* === Subcategory Section === */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2, justifyContent: 'center', alignItems: 'center' }}>
              <TextField
                size='small'
                fullWidth label="New Subcategory"
                value={newSub.name}
                onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
              />
              <TextField
                size='small'
                select
                SelectProps={{ native: true }}
                value={newSub.category_id}
                onChange={(e) => setNewSub({ ...newSub, category_id: e.target.value })}
                fullWidth
              >
                <option value="">Select</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </TextField>
              <Button variant="contained" onClick={handleAddSub} startIcon={<AddIcon />} sx={{ backgroundColor: '#90caf9' }}>
                Add
              </Button>
            </Box>

            <Paper>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table >
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#90caf9' }}>
                                           <TableCell sx={{textAlign:'center',color:'#fff', fontWeight:'bold',fontSize:'1.0rem'}}>S.No</TableCell>
                      <TableCell sx={{textAlign:'center',color:'#fff', fontWeight:'bold',fontSize:'1.0rem'}}>Subcategory Name</TableCell>
                      <TableCell sx={{textAlign:'center',color:'#fff', fontWeight:'bold',fontSize:'1.0rem'}}>Category </TableCell>
                      <TableCell sx={{textAlign:'center',color:'#fff', fontWeight:'bold',fontSize:'1.0rem'}}>Actions</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subcategories.map((sub, i) => (
                      <TableRow key={sub.id}>
                        <TableCell align="center">{i + 1}</TableCell>
                        <TableCell align="center">
                          {editSubId === sub.id ? (
                            <TextField value={editSubValue} onChange={(e) => setEditSubValue(e.target.value)} />
                          ) : sub.name}
                        </TableCell>
                        <TableCell align="center">{sub.categoryName}</TableCell>
                        <TableCell align="center">
                          {editSubId === sub.id ? (
                            <IconButton onClick={() => handleSaveSub(sub.id)} color="success"><SaveIcon /></IconButton>
                          ) : (
                            <IconButton onClick={() => handleEditSub(sub)} color="primary"><EditIcon /></IconButton>
                          )}
                          <IconButton onClick={() => handleDeleteSub(sub.id)} color="error"><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Categories;
