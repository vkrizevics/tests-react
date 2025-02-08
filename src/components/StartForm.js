import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, FormHelperText, Box } from '@mui/material';
import banner from '../testa-uzdevums.jpg';
import './StartForm.css';

const StartForm = () => {
  const [name, setName] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [error, setError] = useState(' ');

  useEffect(() => {
    document.body.style.backgroundColor = '#3d1a6d';
  }, []);

  const handleSubmit = () => {
    if (!name || !selectedTest) {
      setError('Both fields are required');
      return;
    }
    setError(' ');
    alert(`Proceeding with the test: ${selectedTest}`);
    document.getElementById('name').value = name;
    document.getElementById('test').value = selectedTest;
    document.getElementById('submit-form').submit();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        padding: 2,
        backgroundColor: '#3d1a6d', // Apply background color to the component
        borderRadius: '8px',
        boxShadow: 'none', // Remove border/shadow
        color: '#fff', // White text for contrast
        minHeight: '100vh',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src={banner}
          alt="Testa uzdevums"
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
        />
      </Box>

      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        error={!!error.trim() && !name}
        InputProps={{
          style: { backgroundColor: '#fff', borderRadius: '4px' },
          disableUnderline: true
        }}
        InputLabelProps={{
          sx: {
            color: '#fff',
            backgroundColor: '#3d1a6d',
            paddingX: 1,
            borderRadius: '4px',
            '&.Mui-focused': {
              color: '#fff',
              backgroundColor: '#3d1a6d'
            }
          }
        }}
        sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '&:focus': { outline: 'none' } }}
      />

      <FormControl fullWidth required error={!!error.trim() && !selectedTest} sx={{ borderRadius: '4px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
        <InputLabel
          sx={{
            color: '#fff',
            backgroundColor: '#3d1a6d',
            paddingX: 1,
            borderRadius: '4px',
            '&.Mui-focused': {
              color: '#fff',
              backgroundColor: '#3d1a6d'
            }
          }}
        >
          Test
        </InputLabel>
        <Select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          label="Test"
          sx={{ backgroundColor: '#fff', color: '#000', borderRadius: '4px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        >
          <MenuItem value="Test1" sx={{ color: '#000' }}>Test 1</MenuItem>
          <MenuItem value="Test2" sx={{ color: '#000' }}>Test 2</MenuItem>
          <MenuItem value="Test3" sx={{ color: '#000' }}>Test 3</MenuItem>
        </Select>
        <FormHelperText sx={{ color: '#fff' }}>{error}</FormHelperText>
      </FormControl>

      <Button variant="contained" onClick={handleSubmit} fullWidth>
        Proceed with Test
      </Button>
      <form id="submit-form" class="hidden" action="/starttest.php" method="post">
        <input id="name" type="hidden" name="name" value="noname" />
        <input id="test" type="hidden" name="test" value="impossible" />
      </form>
    </Box>
  );
};

export default StartForm;
