import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, FormHelperText, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import banner from '../testa-uzdevums.jpg';

/**
 * Testa izvēles skats
 */
const StartForm = () => {
  const navigate = useNavigate();

  /**
   * Masīvs ar ielādētiem testiem no servera
   */
  const [tests, setTests] = useState([]);

  /**
   * Interfeisa elementi
   */
  const [name, setName] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [error, setError] = useState(' ');

  /**
   * Debesszīlas pogas labi izskatas uz violeta fona
   */
  useEffect(() => {
    document.body.style.backgroundColor = '#3d1a6d';
  }, []);

  /**
   * Ieladē no servera testu sarakstu izvēlnei
   */
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch("/api/gettests.php"); // Update with your actual API endpoint
        if (!response.ok) {
          throw new Error("Nav izdevies ielādēt testus");
        }
        const data = await response.json();
        setTests(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTests();
  }, []);

  /**
   * Ja abi lauki ir aizpildīti, automātiski izveido lietotāju, ja šāda vārda vēl nav datubāzē un uzsāk testu,
   * pārējot uz testa skatu
   * 
   * Error ir atstarpe, lai FormasHelperis saglabātu pastāvīgu augstumu, kad kļūdu nav
   */
  const handleSubmit = () => {
    if (!name || !selectedTest) {
      setError('Ir jāaizpilda abi lauki');
      return;
    }
    setError(' ');

    fetch('/api/starttest.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, test: selectedTest })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Nevar uzsākt testu');
        }
        return response.json();
    })
    .then(data => {
      navigate("/test");
    })
    .catch(error => console.error('Error:', error));
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
        label="Ievadi savu vārdu"
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
          Izvēlies testu
        </InputLabel>
        
        <Select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          label="Test"
          sx={{ backgroundColor: '#fff', color: '#000', borderRadius: '4px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        >
          {tests.map((test, index) => (
            <MenuItem key={index} value={test.id} sx={{ color: '#000' }}>
              {test.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText sx={{ color: '#fff' }}>{error}</FormHelperText>
      </FormControl>

      <Button variant="contained" onClick={handleSubmit} fullWidth>
        Sākt testu
      </Button>
    </Box>
  );
};

export default StartForm;
