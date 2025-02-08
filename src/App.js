import React from "react";
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import { Button, Container } from "@mui/material";
import './App.css';
import StartForm from './components/StartForm';
import TestForm from "./components/TestForm";

function App() {
  return (
    <Router>
      <Container>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>

        <Routes>
          <Route path="/" element={<StartForm />} />
          <Route path="/test" element={<TestForm />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;