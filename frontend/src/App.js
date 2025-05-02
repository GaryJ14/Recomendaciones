import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignInSide from "./pages/SignInSide";
import SignUp from "./pages/SignUp";
import Index from "./pages/index";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInSide></SignInSide>} />
        <Route path="/SignUp" element={<SignUp></SignUp>} />
        <Route path="/index" element={<Index></Index>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
