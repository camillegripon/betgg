import PropTypes from "prop-types";
import "../styles/match.css";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useState } from "react";


function Match({ name1, name2, victoire, date, odds1, odds2, id, score }) {
    const { user } = useContext(AuthContext);

    //const newDate = new Date(date).toLocaleDateString("fr-FR");
    const { isLogged } = useContext(AuthContext);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [betAmount, setBetAmount] = useState("");


    const logos = {
        "Fnatic": "/assets/logo/Fnatic_logo.png",
        "G2 Esports": "/assets/logo/G2_Esports_logo.png",
        "GIANTX": "/assets/logo/GiantX_logo.png",
        "Karmine Corp": "/assets/logo/Karmine_Corp_logo.png",
        "Movistar KOI": "/assets/logo/Movistar_KOI_logo.png",
        "Rogue": "/assets/logo/Rogue_logo.png",
        "SK Gaming": "/assets/logo/SK_Gaming_logo.png",
        "Team BDS": "/assets/logo/Team_BDS_logo.png",
        "Team Heretics": "/assets/logo/Team_Heretics_logo.png",
        "Team Vitality": "/assets/logo/Team_Vitality_Logo.png",
        "CTBC Flying Oyster": "/assets/logo/CTBC_Flying_Oyster_logo.png",
        "Hanwha Life Esports": "/assets/logo/Hanwha_Life_Esports_logo.png",
        "Team Liquid": "/assets/logo/Team_Liquid_logo.png",
        "TOP Esports": "/assets/logo/TES_logo.png",
        "Bilibili Gaming": "/assets/logo/Bilibili_Gaming.png",
        "BNK FEARX": "/assets/logo/BNK_FEARX.png",
        "Team Secret Whales": "/assets/logo/Team_Secret_Whales_logo.png"
    };

    const handleTeamSelect = (team, odds) => {  // ✅ Remplace ton handleBet actuel
        setSelectedTeam({ name: team, odds });
    };

    const handleBet = async () => {
        const amount = parseFloat(betAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Montant invalide");
            return;
        }

        const betData = {
            id_user: user.id_user,
            id_game: id,
            name_team: selectedTeam.name,
            amount: amount
        };

        try {
            console.log("Données envoyées :", betData); // Log 1
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(betData)
            });

            const data = await response.json();
            console.log("Réponse complète :", data); // Log 2 : Vérifie la structure exacte

            if (response.ok) {
                // ✅ Vérifie que data.payout existe et est valide
                const payout = data.payout ? parseFloat(data.payout) : 0;
                console.log("Payout calculé :", payout); // Log 3

                alert(`Pari validé ! Gain potentiel: ${payout.toFixed(2)}`);
                console.log("Avant setSelectedTeam :", selectedTeam); // Log 4
                setSelectedTeam(null);
                console.log("Après setSelectedTeam :", selectedTeam); // Log 5
            } else {
                alert(`Erreur: ${data.error || "Erreur inconnue"}`);
            }
        } catch (error) {
            console.error("Erreur complète :", error);
            alert("Erreur réseau. Vérifie la console.");
        }
    };




    return (
        <div className="matchBet">
            <div className="matchDetails">
                <div className="equipe1"><img src={logos[name1]} />{name1}</div>
                {score && <div className="matchScore">{score}</div>}
                <div className="equipe2">{name2}<img src={logos[name2]} alt="Logo de l'équipe 2" /></div>
                <div className="date">{date.toLocaleString("fr-FR")}</div>
            </div>
            {isLogged && new Date(date) >= new Date() && (
                <div className="bet">
                    <div className="betButtons">
                        <button
                            onClick={() => handleTeamSelect(name1, odds1)}
                            className={selectedTeam?.name === name1 ? "selected" : ""}
                        >
                            {name1} {odds1 ? `(${odds1})` : "(N/A)"}
                        </button>
                        <button
                            onClick={() => handleTeamSelect(name2, odds2)}
                            className={selectedTeam?.name === name2 ? "selected" : ""}
                        >
                            {name2} {odds2 ? `(${odds2})` : "(N/A)"}
                        </button>
                    </div>
                    {selectedTeam && (
                        <div className="betAmountForm">
                            <input
                                type="number"
                                placeholder="Montant (ex: 10)"
                                value={betAmount}
                                onChange={(e) => setBetAmount(e.target.value)}
                                min="1"
                                step="0.5"
                            />
                            {betAmount > 0 && (
                                <p className="potentialGain">
                                    Gain potentiel: {(betAmount * selectedTeam.odds).toFixed(2)} €
                                </p>
                            )}
                            <button onClick={handleBet}>Valider</button>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

// ✅ Validation des props
Match.propTypes = {
    name1: PropTypes.string.isRequired,
    name2: PropTypes.string.isRequired,
    victoire: PropTypes.string,
    date: PropTypes.isRequired,
    odds1: PropTypes.number,
    odds2: PropTypes.number,
    score: PropTypes.string,
};

export default Match;
