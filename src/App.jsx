import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FormData from "./pages/FormData";
import AfficherChampion from "./components/Champion";
import LoginPage from './pages/LoginPage';
import { AuthProvider } from "./context/AuthProvider";


function App() {
  return (
<AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/champion" element={<AfficherChampion/>}/>
        <Route path="/modo" element={<FormData/>}/>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/matchFormData" element={<FormData/>}></Route>
      </Routes>
    </Router>
</AuthProvider>
  );
}

export default App;
