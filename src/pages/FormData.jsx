import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import "../styles/FormData.css"; // Importe le CSS

function MatchForm() {
    // Dans ton state, ajoute :
    const [searchTerm1, setSearchTerm1] = useState("");
    const [searchTerm2, setSearchTerm2] = useState("");
    const [filteredTeams1, setFilteredTeams1] = useState([]);
    const [filteredTeams2, setFilteredTeams2] = useState([]);
    const [teamName, setTeamName] = useState([]);




    const [formData, setFormData] = useState({
        team1: "",
        team2: "",
        league: "",
        championship: "",
        bo: 1,
        date_match: ""
    });
    const { isLogged, user, setIsLogged, setUser } = useContext(AuthContext);



    // Filtre les équipes en fonction de la saisie
    useEffect(() => {
        const results = teamName.filter(team =>
            team.name_team.toLowerCase().includes(searchTerm1.toLowerCase())
        );
        setFilteredTeams1(results);
    }, [searchTerm1, teamName]);

    useEffect(() => {
        const results = teamName.filter(team =>
            team.name_team.toLowerCase().includes(searchTerm2.toLowerCase())
        );
        setFilteredTeams2(results);
    }, [searchTerm2, teamName]);




    const handleTeamSelect = (team, field) => {
        if (field === "team1") {
            setFormData({ ...formData, team1: team.name_team });
            setSearchTerm1(team.name_team);
            setFilteredTeams1([]);
        } else {
            setFormData({ ...formData, team2: team.name_team });
            setSearchTerm2(team.name_team);
            setFilteredTeams2([]);
        }
    };
    if (!isLogged || user?.role !== "admin") {
        return <p>Vous n’avez pas l’autorisation d’accéder à cette page.</p>;
    }

    useEffect(() => {
        const fetchTeamName = async () => {
            const response = await fetch("http://localhost:5000/api/admin/");
            const data = await response.json();
            setTeamName(data);
        }
        fetchTeamName();
    }, []);

    useEffect(() => {
        console.log("Teams mis à jour :", teamName);
    }, [teamName]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Données envoyées au backend:", formData);  // ✅ Log 8
    try {
        const response = await fetch("http://localhost:5000/api/matches/addBO", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("Réponse du serveur:", data);  // ✅ Log 9
            throw new Error(data.error || "Erreur lors de l’envoi");
        }
        console.log("Succès:", data);  // ✅ Log 10
    } catch (error) {
        console.error("Erreur frontend:", error);  // ✅ Log 11
    }
};


    return (
        <><Header isLogged={isLogged} user={user} setIsLogged={setIsLogged} setUser={setUser} />
            <div className="formDataFront">

                <h2>Ajouter un match</h2> {/* Titre optionnel */}
                <form onSubmit={handleSubmit}>
    {/* Champ pour team1 */}
    <div style={{ position: "relative" }}>
        <input
            type="text"
            name="team1"
            placeholder="Première équipe (ex: Fna)"
            value={searchTerm1}
            onChange={(e) => {
                setSearchTerm1(e.target.value);
                setFormData({ ...formData, team1: e.target.value });
            }}
            required
        />
        {searchTerm1.length > 0 && filteredTeams1.length > 0 && (
            <ul style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                maxHeight: "200px",
                overflowY: "auto",
                background: "white",
                border: "1px solid #ddd",
                listStyle: "none",
                padding: 0,
                margin: 0,
                zIndex: 1000
            }}>
                {filteredTeams1.map(team => (
                    <li
                        key={team.id_team}
                        onClick={() => handleTeamSelect(team, "team1")}
                        style={{ padding: "8px 10px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                    >
                        {team.name_team}
                    </li>
                ))}
            </ul>
        )}
    </div>

    {/* Champ pour team2 */}
    <div style={{ position: "relative" }}>
        <input
            type="text"
            name="team2"
            placeholder="Deuxième équipe (ex: G2)"
            value={searchTerm2}
            onChange={(e) => {
                setSearchTerm2(e.target.value);
                setFormData({ ...formData, team2: e.target.value });
            }}
            required
        />
        {searchTerm2.length > 0 && filteredTeams2.length > 0 && (
            <ul style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                maxHeight: "200px",
                overflowY: "auto",
                background: "white",
                border: "1px solid #ddd",
                listStyle: "none",
                padding: 0,
                margin: 0,
                zIndex: 1000
            }}>
                {filteredTeams2.map(team => (
                    <li
                        key={team.id_team}
                        onClick={() => handleTeamSelect(team, "team2")}
                        style={{ padding: "8px 10px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                    >
                        {team.name_team}
                    </li>
                ))}
            </ul>
        )}
    </div>

    {/* Autres champs (inchangés) */}
    <input type="text" name="league" placeholder="League (ex: LEC)" value={formData.league} onChange={handleChange} required />
    <input type="text" name="championship" placeholder="Championnat" value={formData.championship} onChange={handleChange} required />
    <select name="bo" value={formData.bo} onChange={handleChange} required>
        <option value="1">BO1</option>
        <option value="3">BO3</option>
        <option value="5">BO5</option>
    </select>
    <input type="datetime-local" name="date_match" value={formData.date_match} onChange={handleChange} required />
    <button type="submit">Ajouter le match</button>
</form>

            </div>
        </>
    );
}

export default MatchForm;
