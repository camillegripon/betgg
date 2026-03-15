import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import "../styles/LoginPage.css";

function LoginPage() {
    const [formData, setFormData] = useState({ pseudo: "", email: "", password: "" });
    const [loginData, setLoginData] = useState({ pseudo: "", password: "" });
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("login"); 
    const { isLogged, user, setIsLogged, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Gestion du formulaire d'inscription
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'inscription");
            }

            const data = await response.json();
            setIsLogged(true);
            setUser({ username: formData.pseudo, role: "user" }); 
            setFormData({ pseudo: "", email: "", password: "" });
            navigate("/");
        } catch (error) {
            setError(error.message);
        }
    };

    // Gestion du formulaire de connexion
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/connexion`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "pseudo ou mot de passe incorrect");
            }

            const data = await response.json();
            setIsLogged(true);
            setUser(data.user);
            setLoginData({ pseudo: "", password: "" });
            navigate("/");
            console.log("connexion faite");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <Header isLogged={isLogged} user={user} setIsLogged={setIsLogged} setUser={setUser} />
            <div className="login-page-container">
                <div className="formDataInscription">
                    <div className="tabs">
                        <button
                            className={activeTab === "login" ? "active" : ""}
                            onClick={() => setActiveTab("login")}
                        >
                            Connexion
                        </button>
                        <button
                            className={activeTab === "register" ? "active" : ""}
                            onClick={() => setActiveTab("register")}
                        >
                            Inscription
                        </button>
                    </div>

                    {error && <p className="error">{error}</p>}

                    {activeTab === "login" ? (
                        <form onSubmit={handleLoginSubmit}>
                            <input
                                type="text"
                                name="pseudo"
                                placeholder="Pseudo"
                                value={loginData.pseudo}
                                onChange={handleLoginChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                            />
                            <button type="submit">Se connecter</button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit}>
                            <input
                                type="text"
                                name="pseudo"
                                placeholder="Pseudo"
                                value={formData.pseudo}
                                onChange={handleRegisterChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleRegisterChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={handleRegisterChange}
                                required
                            />
                            <button type="submit">S'inscrire</button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}

export default LoginPage;
