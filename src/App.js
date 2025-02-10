import React from "react";
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import { Button, Container } from "@mui/material";
import './App.css';
import StartForm from './components/StartForm';
import TestForm from "./components/TestForm";
import ResultPage from "./components/ResultPage";

/**
 * Galvenais React components, kas nodrošina navigāciju pa skatiem
 */
function App() {
  return (
    <Router>
      <Container>
        <Button component={Link} to="/" variant="contained" color="primary">
          Uz sākumu
        </Button>

        <Routes>
          <Route path="/" element={<StartForm />} />
          <Route path="/test" element={<TestForm />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;