import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // ✅ Validate form before submission
  const handleSubmit = async () => {
    const { fullName, phoneNumber, email, password } = form;

    if (!fullName || !phoneNumber || !email || !password) {
      alert('Please fill in all the fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/register', form);
      alert(res.data.message || 'Registration successful!');
      navigate('/home');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper sx={{ width: 500, height: 520, margin: 'auto', mt: 5, p: 3 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mt: 3 }}>
          Join Us Today
        </Typography>

        <Box sx={{ mt: 2 }}>
          <TextField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            margin="normal"
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '25px', fontSize: 'small' },
            }}
          />

          <TextField
            label="Phone Number"
            name="phoneNumber"
            type="number"
            value={form.phoneNumber}
            onChange={handleChange}
            margin="normal"
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '25px', fontSize: 'small' },
            }}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '25px', fontSize: 'small' },
            }}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            margin="normal"
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '25px', fontSize: 'small' },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Submit Button */}
        <Box
          onClick={handleSubmit}
          sx={{
            width: 500,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#673ab7',
            borderRadius: 10,
            color: 'white',
            mt: 3,
            textAlign: 'center',
            cursor: 'pointer',
            transition: '0.3s',
            '&:hover': {
              backgroundColor: '#5e35b1',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            },
          }}
        >
          JOIN
        </Box>

        {/* Link to Login */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body2">If you have an Account</Typography>
          <Typography
            variant="body2"
            component={Link}
            to="/login"
            sx={{
              ml: 1,
              color: '#673ab7',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': {
                color: '#5e35b1',
                fontWeight: 'bold',
              },
            }}
          >
            Login
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
