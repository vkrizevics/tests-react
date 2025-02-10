import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Vienkārša gala rezultāta lapa - neko nemaina datos lai ļautu to nejauši pārlādēt
 */
const ResultPage = () => {
  const navigate = useNavigate();

  /**
   * Interfeisa elementi
   */
  const [heading, setHeading] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState(' ');

  /**
   * Violēts fons pat pārladējot lapu
   */
  useEffect(() => {
    document.body.style.backgroundColor = '#3d1a6d';
  }, []);

  /**
   * Vispirms ielādējam rezultātus no servera
   */
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/finishtest.php");
        if (!response.ok) {
          throw new Error("Nav izdevies ielādēt rezultātus");
        }

        const data = await response.json();
        
        /**
         * Ja kļūdas nav, izvādam tik sīku informāciju, cik vien varam, ja servera kods klibo
         */
        if (data) {
          if (data.errorMsg) {
            setError(data.errorMsg);
          } else {
            if (data.userName) {
              setHeading(`Paldies, ${data.userName}!`);
            } else {
              setHeading(`Paldies!`);
            }

            if (data.answersRight >= 0) {
              if (data.questionTotalCount >= 0) {
                setResult(`Tu atbildēji pareizi uz ${data.answersRight} no ${data.questionTotalCount} jautājumiem.`);
              } else {
                setResult(`Tu atbildēji pareizi uz ${data.answersRight} jautājumiem.`);
              }
            } else {
              if (data.questionTotalCount >= 0) {
                setResult(`Tu atbildēji kopumā uz ${data.questionTotalCount} jautājumiem.`);
              } else {
                setResult(`Tu pabeidzi testu.`);
              }
            }
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchResults();
  }, []);

  /**
   * Poga "Vēl vienu!" atgriež uz testa izvēles skatu
   */
  const handleHome = () => {
    navigate('/');
  };

  return (
    <Box
      display="flex"
      justifyContent="center" // Centrēts pa horizontāli
      alignItems="flex-start" // Augšā pa vertikali
      minHeight="100vh"
    >
      <Box maxWidth={600} width="100%" p={3} textAlign="center">
        <Typography variant="h4" align="center" sx={{ color: "white", mb: 2 }}>
          {heading}
        </Typography>

        <Typography variant="h6" align="center" sx={{ color: "white", mb: 2 }}>
          {result}
        </Typography>

        <Typography color="error" align="center" sx={{ 
          color: "#d32f2f",
          mt: { xs: 1, sm: 3 }, 
          fontSize: '12px',
          minHeight: '20px',
        }}>
          {error}
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 2, // Pogas attālums līdz citiem elementiem un krāsas - tas pašas, ka testa jautājumu skatā
            backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
          }}
          onClick={handleHome}
        >
          Vēl vienu!
        </Button>
      </Box>
    </Box>
  );
};

export default ResultPage;
