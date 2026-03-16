import Match from "../components/Match";
import '../styles/match.css';
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";

function Home() {
    const [matches, setMatches] = useState({ matchsAVenir: [], matchsPasses: [] });
    const [bets, setBets] = useState([]);
    const {isLogged, user} = useContext(AuthContext)
    // Récupère les matchs
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/matches`)
            .then((response) => response.json())
            .then((data) => {
                const sortedMatches = data.map(match => ({
                    ...match,
                    match_date: new Date(match.match_date)
                })).sort((a, b) => b.match_date - a.match_date);
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);

                const matchsAVenir = sortedMatches.filter(match => match.match_date >= today);
                const matchsPasses = sortedMatches.filter(match => match.match_date < today);

                setMatches({ matchsAVenir, matchsPasses });
            })
            .catch((error) => console.error("Erreur chargement matchs", error));
    }, []);

 // Récupère les paris en cours
    useEffect(() => {
        // ✅ Vérifie que user ET user.id_user existent
        if (!isLogged || !user?.id_user) return;

        const fetchBets = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bets/current?id_user=${user.id_user}`, {
                    credentials: 'include'
                });

                const data = await response.json();
                console.log("Réponse API paris:", data);
                if (response.ok) {
                    setBets(data);
                } else {
                    console.error("Erreur API:", data.error);
                }
            } catch (error) {
                console.error("Erreur réseau:", error);
            }
        };
        fetchBets();
    }, [isLogged, user?.id_user]); // ✅ Déclenche le useEffect quand user.id_user change

    return (
<>
            <Header />
        <div className="homeContainer">
            {/* ✅ Panneau latéral pour les paris en cours */}
            {bets.length > 0 && (
                <div className="betsSidebar">
                    <h3>Mes paris en cours</h3>
                    <ul>
                        {bets.map((bet, index) => (
                            <li key={index} className="betItem">
                                <span>{bet.name_team} ({bet.odds})</span>
                                <span>{bet.amount} €</span>
                                <span>Gain: {(bet.amount * bet.odds).toFixed(2)} €</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="matchesContainer">
                <div className="matchAVenir">
                    <h2>Matchs à venir</h2>
                    {matches.matchsAVenir.length > 0 ? (
                        matches.matchsAVenir.map((match, index) => (
                            <Match
                                key={index}
                                bo={match.bo}
                                id={match.id_game}
                                name1={match.team1_name}
                                name2={match.team2_name}
                                victoire={match.winner_team_name}
                                date={match.match_date}
                                odds1={match.team1_odds}
                                odds2={match.team2_odds}
                            />
                        ))
                    ) : (
                        <p>Aucun match à venir</p>
                    )}
                </div>

                <div className="matchPasse">
                    <h2>Matchs passés</h2>
                    {matches.matchsPasses.length > 0 ? (
                        matches.matchsPasses.map((match, index) => (
                            <Match
                                key={index}
                                id={match.id_game}
                                name1={match.team1_name}
                                name2={match.team2_name}
                                victoire={match.winner_team_name}
                                date={match.match_date}
                            />
                        ))
                    ) : (
                        <p>Aucun match passé</p>
                    )}
                </div>
        </div>
        <div className="emptyColonne"></div>
        </div>

</>
    );
}

export default Home;
