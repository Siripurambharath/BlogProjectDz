import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Button
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Loginform = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validEmail = 'blog@gmail.com';
    const validPhone = '6301402298';
    const validPassword = 'blog@98';

    const isEmailOrPhoneValid = form.emailOrPhone === validEmail || form.emailOrPhone === validPhone;
    const isPasswordValid = form.password === validPassword;

    if (!isEmailOrPhoneValid && !isPasswordValid) {
      alert('Invalid email/phone and password');
    } else if (!isEmailOrPhoneValid) {
      alert('Invalid email or phone number');
    } else if (!isPasswordValid) {
      alert('Invalid password');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Box sx={{
  height: '100vh', 
  backgroundColor: '#ffcdd2',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 2
}}>
  <Box sx={{
    width: 1000,
    height: 500, // fixed height
    display: 'flex',
    boxShadow: 6,
    borderRadius: 4,
    overflow: 'hidden',
   
  }}>
    {/* Left Side - Quotation */}
    <Box sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8bbd0',
      padding: 3
    }}>
      <Typography variant="h5" sx={{
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#4a148c',
        textAlign: 'center'
      }}>
        “The journey of a thousand miles<br />begins with a single login.”
      </Typography>
    </Box>

    {/* Right Side - Login Form */}
    <Box sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
          p:3
    }}>
      <Paper sx={{
        width: 420,
        height:300,
        padding: 3,
        boxShadow: 4,
        borderRadius: 3,
    
      }}>
        <Typography variant='h4' sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
          WELCOME BACK
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Phone or Email"
            name="emailOrPhone"
            value={form.emailOrPhone}
            onChange={handleChange}
            margin='normal'
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                fontSize: 'small'
              }
            }}
          />

          <TextField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            margin='normal'
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                fontSize: 'small'
              }
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
              )
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: '#673ab7',
              borderRadius: '25px',
              height: '40px',
              '&:hover': {
                backgroundColor: '#5e35b1',
              }
            }}
          >
            LOGIN
          </Button>
        </Box>
      </Paper>
    </Box>
  </Box>
</Box>

  );
};

export default Loginform;
