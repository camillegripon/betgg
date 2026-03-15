import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext';
import '../styles/header.css';

function Header() {
    const { isLogged, user, setIsLogged, setUser, role, setRole } = useContext(AuthContext);
    const navigate = useNavigate(); 

    function handleLogout() {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/logout`, {
            method: "POST",
            credentials: "include"
        })
        .then(() => {
            setIsLogged(false);
            setUser(null);
            navigate("/Home");
        })
        .catch(error => console.error("Erreur lors de la déconnexion :", error));
    }

    const goToHome= ()=> {
        navigate('/');
}

    const goToMatchFormData = ()=> {
        navigate("/matchFormData");
}

    return (
        <header className="header">
            <div className="title">
                <button onClick={goToHome} className="home-button">
                    Bet<span className="text-yellow-300">GG</span>
                </button>
            </div>
            <div className="options">
                {isLogged ? (
                    <>
                        <div className="profil">
                            <p><span className="font-semibold">{user?.username}</span></p>
                        </div>
                        <div className="monnaie">
                            {user.neekos} 🪙
                        </div>
                        {role == "admin" && (
                        <div className='adminHeader'>
                            <button onClick={goToMatchFormData}>Admin</button>
                        </div>
                            )}
                        <button onClick={handleLogout}>Déconnexion</button>
                    </>
                ) : (
                    <Link to="/login" className="inscription">
                        <p>Se Connecter</p>
                    </Link>
                )}
                <div className="league">Championnat</div>
            </div>
        </header>
    );
}

export default Header;
