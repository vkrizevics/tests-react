import React, { useState, useEffect } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Testa jautājumu skats
 */
const TestForm = () => {
  const navigate = useNavigate();

  /**
   * Progressbara stāvoklis veselos %
   */
  const [progress, setProgress] = useState(0);

  /**
   * Interfeisa elementi
   */
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(0);
  const [error, setError] = useState(' ');

  /**
   * Violets fons pat ja lietotājs nejauši ir pārladējis lapu 
   */
  useEffect(() => {
    document.body.style.backgroundColor = '#3d1a6d';
  }, []);

  /**
   * Ielādēt kārtējo jautājumu un atbilžu variantus. Jautājumu secība nemainas, atbilžu varianti jautājumiem
   * iet nejaušā secībā
   */
  const fetchQuestion = async () => {
    try {
      const response = await fetch("/api/getcurrentquestion.php");
      if (!response.ok) {
        throw new Error("Nevar ielādēt jautājumu");
      }

      const data = await response.json();

      // Ja atbildēts pēdējais jautājums, virzāmies uz rezultātu skatu
      if (data.questionCurrentNumber) {
        if (data.questionTotalCount) {
          if (data.questionCurrentNumber > data.questionTotalCount) {
            navigate('/result')
          }
        }
      }

      // Ja mums ir jāpāriet uz nākamo jautājumu
      if (data.question) {
        setQuestion(data.question);

        if (data.answers && data.answers.length >= 2) {
          setAnswers(data.answers);
        } else {
          setSelectedAnswer(0); // Nodzēst iepriekšējo atbildi, atgriezt parastu fonu attiecīgajai pogai
          setAnswers([]); // Nodzēst arī visas pogas
  
          setError('Nevar ielādēt atbildes');
        }
      } else {
        setQuestion(' '); // Maketa saglabāšanai, ja nu kas
        setSelectedAnswer(0); // Nodzēst iepriekšējo atbildi, atgriezt parastu fonu attiecīgajai pogai
        setAnswers([]); // Nodzēst arī visas pogas
        setError('Nevar ielādēt jautājumu');
      }

      // Ieladējuši jaunu jautājumu, attiecīgi pavirzam uz priekšu progresa indikatoru 
      if (data.questionTotalCount && data.questionCurrentNumber) {
        setProgress(Math.round(data.questionCurrentNumber / data.questionTotalCount * 100))
      }
    } catch (err) {
      console.log(err);

      // Nodzēst visu, izņemot kļūdu, ja servera kodā ir nopietna problēma
      setQuestion(' ');
      setSelectedAnswer(0);
      setAnswers([]);

      setError(err.message);
    }
  };

  /**
   * 
   */
  useEffect(() => {
    fetchQuestion();
  }, []);

  /**
   * Vizuāli izdalīt izvēlēto atbildes variantu
   * @param {*} answerId 
   */
  const handleChoice = (answerId) => {
    setSelectedAnswer(answerId);
    setError(' ');
  };

  /**
   * Pāriet uz nākamo jautājumu, ja ir izvēlēta kāda atbilde
   */
  const handleNext = () => {
    if (!selectedAnswer) {
      setError('Obligāti jāizvēlas 1 atbilde');
    } else {
      setError(' ');

      // Partin jautājumu sarakstu uz priekšu
      fetch('/api/submitanswer.php', {
        method: 'POST',
        headers: {
        },
        body: JSON.stringify({ answer: selectedAnswer })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Nevar saglabāt atbildi');
          }
          return response.json();
      })
      .then(data => {
        // Un ielāde nākamo jautājumu
        fetchQuestion();
      })
      .catch(error => console.error('Error:', error));
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center" // Centre horizontāli
      alignItems="flex-start" // Izvieto augšā pa vertikāli
      minHeight="100vh"
    >
      <Box maxWidth={600} width="100%" p={3} textAlign="center">
        <Typography variant="h4" align="center" sx={{ color: "white", mb: 2 }}>
          {question}
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }} // Pogas saiet vienā kolonna mazajos ekrānos, 2 kolonnās - lielākajos
          flexWrap="wrap"
          justifyContent={answers.length % 2 === 1 ? 'flex-start' : 'center'} // Pēdējo nepāra pogu radam pa kreisi, nevis centrā
          sx={{
            mt: 3,  
            gap: 2,
            columnGap: 6,
          }}
        >
          {answers.map((answer, index) => {
            const isLastButtonOdd = answers.length % 2 === 1 && index === answers.length - 1;
            
            return (
              <Button
                variant="contained"
                key={index}
                value={answer.id}
                onClick={() => handleChoice(answer.id)}
                sx={{
                  width: { xs: "100%", sm: "45%" }, // Lielājos ekranos poga aizņem tikai pusi interfeisa, pat ja ir pa kreisi
                  backgroundColor: selectedAnswer === answer.id ? 'goldenrod' : '#1976d2',
                  "&:hover": {
                    backgroundColor: selectedAnswer === answer.id ? 'darkgoldenrod' : '#1565c0', // Uzbraucot tumšāka
                  },
                  "&:active": {
                    backgroundColor: selectedAnswer === answer.id ? 'yellow' : '#42a5f5', // Fokusam gaišāka
                  },
                  // Pēdēja nepara poga lielajos ekrānos - pa kreisi
                  ...(isLastButtonOdd && { alignSelf: 'flex-start', width: { xs: '100%', sm: '45%' } }),
                }}
              >
                {answer.text}
              </Button>
            );
          })}

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
            mt: 2, // Atstarpe starp progresa indikatoru un pogu "Nākamais"
            backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0', // Krāsas tas pašas, ka atbilžu pogām
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
