import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FormData from "./pages/FormData";
import LoginPage from './pages/LoginPage';
import { AuthProvider } from "./context/AuthProvider";
import Profil from "./pages/Profil";


function App() {
  return (
<AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/modo" element={<FormData/>}/>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/matchFormData" element={<FormData/>}></Route>
        <Route path="/profil" element={<Profil/>}></Route>
      </Routes>
    </Router>
</AuthProvider>
  );
}

export default App;
