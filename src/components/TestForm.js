import React, { useState, useEffect } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import './style.css';

const TestForm = () => {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);

  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(0);
  const [error, setError] = useState(' ');

  useEffect(() => {
    document.body.style.backgroundColor = '#3d1a6d';
  }, []);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch("/api/getcurrentquestion.php");
        if (!response.ok) {
          throw new Error("Nevar ielādēt jautājumu");
        }

        const data = await response.json();

        if (data.question) {
          setQuestion(data.question);
        } else {
          setError('Nevar ielādēt jautājumu');
        }

        if (data.questionTotalCount && data.questionCurrentNumber) {
          setProgress(Math.round(data.questionCurrentNumber / data.questionTotalCount * 100))
        }

        if (data.answers && data.answers.length >= 2) {
          setAnswers(data.answers);
        } else {
          setError('Nevar ielādēt atbildes');
        }
      } catch (err) {
        console.log(err);
        setError(err.message);
      }
    };

    fetchTests();
  }, []);

  const handleChoice = (answerId) => {
    setSelectedAnswer(answerId);
    setError(' ');
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      setError('Obligāti jāizvēlas 1 atbilde');
    } else {
      setError(' ');
      navigate('/');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center" // Centers horizontally
      alignItems="flex-start" // Aligns content to the top
      minHeight="100vh"
    >
      <Box maxWidth={600} width="100%" p={3} textAlign="center">
        <Typography variant="h4" align="center" sx={{ color: "white", mb: 2 }}>
          {question}
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }} // Column on small screens, row on larger screens
          flexWrap="wrap" // Allows items to wrap to the next line
          justifyContent="center"
          sx={{
            mt: { xs: 1, sm: 3 },  
            gap: 2,
            columnGap: 6,
          }}
        >
          {answers.map((answer, index) => (
            <Button
              variant="contained"
              key={index}
              value={answer.id}
              onClick={() => handleChoice(answer.id)}
              sx={{
                width: { xs: "100%", sm: "45%" }, // Full width on mobile, 45% on larger screens
                backgroundColor: selectedAnswer === answer.id ? 'goldenrod' : '#1976d2',
                  "&:hover": {
                    backgroundColor: selectedAnswer === answer.id ? 'darkgoldenrod' : '#1565c0', // Darker shades on hover
                  },
                  "&:active": {
                    backgroundColor: selectedAnswer === answer.id ? 'yellow' : '#42a5f5', // Lighter shades on focus
                  },
              }}
            >
              {answer.text}
            </Button>
          ))}
        </Box>

        <Typography color="error" align="center" sx={{ 
          color: "#d32f2f",
          mt: { xs: 1, sm: 3 }, 
          fontSize: '12px',
          minHeight: '20px',
        }}>
          {error}
        </Typography>

        <Box sx={{ mt: { xs: 3, sm: 7 } }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 10, borderRadius: 5 }} />
        </Box>

        <Button
          variant="contained"
          sx={{
            mt: 2, // Adds margin-top for spacing between the progress bar and button
            backgroundColor: '#1976d2', // You can customize the button's color here
              '&:hover': {
                backgroundColor: '#1565c0', // Darker shade on hover
              },
          }}
          onClick={handleNext}
        >
          Nākamais
        </Button>
      </Box>
    </Box>
  );
};

export default TestForm;
