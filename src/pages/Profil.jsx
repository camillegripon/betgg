import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import "../styles/profil.css";
import { useNavigate } from "react-router-dom";

function Profil() {
    const { user, setUser } = useContext(AuthContext);
    const [bets, setBets] = useState([]);
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "default.png");
    const [showAvatarSelection, setShowAvatarSelection] = useState(false);

    useEffect(() => {
        if (user?.avatar) {
            setSelectedAvatar(user.avatar);
        }
    }, [user?.avatar]);

const getUserBets = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/getBets`, {
        method: "GET",
        credentials: "include", // ✅ Nécessaire pour envoyer les cookies
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            setBets(data.bets); // Met à jour l'état avec les paris
        } else {
            console.error("Erreur :", data.error);
        }
    })
    .catch((error) => console.error("Erreur réseau :", error));
};


    const getAvatars = () => {
        const avatarList = ["default.png", "aatrox.png", "ahri.png","akshan.png", "alistar.png", "ambessa.png", "amumu.png", "anivia.png", "annie.png", "aphelios.png", "ashe.png", "aurelionSol.png", "aurora.png", "azir.png", "bard.png", "belveth.png", "blitzcrank.png", "brand.png", "braum.png", "briar.png", "caitlyn.png", "camille.png", "cassiopeia.png", "choGath.png", "corki.png", "darius.png", "diana.png", "draven.png", "drMundo.png", "ekko.png", "elise.png", "evelynn.png", "ezreal.png", "fiddlesticks.png", "fiora.png", "fizz.png", "galio.png", "gangplank.png", "garen.png", "gnar.png", "gragas.png", "graves.png", "gwen.png", "hecarim.png", "heimerdinger.png", "hwei.png", "illaoi.png", "irelia.png", "ivern.png", "janna.png", "jarvanIV.png", "jax.png", "jayce.png", "jhin.png", "jinx.png", "kaisa.png", "kalista.png", "karma.png", "karthus.png", "kassadin.png", "katarina.png", "kayle.png", "kayn.png", "kennen.png", "khaZix.png", "kindred.png", "kled.png", "kogMaw.png", "kSante.png", "leblanc.png", "leeSin.png", "leona.png", "lillia.png", "lissandra.png", "lucian.png", "lulu.png", "lux.png", "maitreYi.png", "malphite.png", "malzahar.png", "maokai.png", "milio.png", "missFortune.png", "mordekaiser.png", "morgana.png", "naafiri.png", "nami.png", "nasus.png", "nautilus.png", "neeko.png", "nidalee.png", "nilah.png", "nocturne.png", "nunu.png", "olaf.png", "orianna.png", "ornn.png", "pantheon.png", "poppy.png", "pyke.png", "qiyana.png", "quinn.png", "rakan.png", "rammus.png", "rekSai.png", "rell.png", "renataGlasc.png", "renekton.png", "rengar.png", "riven.png", "rumble.png", "ryze.png", "samira.png", "sejuani.png", "senna.png", "seraphine.png", "sett.png", "shaco.png", "shen.png", "shyvana.png", "singed.png", "sion.png", "sivir.png", "skarner.png", "smolder.png", "sona.png", "soraka.png", "swain.png", "sylas.png", "syndra.png", "tahmKench.png", "taliyah.png", "talon.png", "taric.png", "teemo.png", "thresh.png", "tristana.png", "trundle.png", "tryndamere.png", "twistedFate.png", "twitch.png", "udyr.png", "urgot.png", "varus.png", "vayne.png", "veigar.png", "velKoz.png", "vex.png", "vi.png", "viego.png", "viktor.png", "vladimir.png", "volibear.png", "warwick.png", "wukong.png", "xayah.png", "xerath.png", "xinZhao.png", "yasuo.png", "yone.png", "yorick.png", "yuumi.png", "zac.png", "zed.png", "zeri.png", "ziggs.png", "zilean.png", "zoe.png", "zyra.png"]; 
        setAvatars(avatarList);
    };


    useEffect(() => {
        getUserBets();
        getAvatars();
    }, []);

    const handleAvatarChange = (avatar) => {
        setSelectedAvatar(avatar);
    };

    const handleSaveAvatar = () => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/update-avatar`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ avatar: selectedAvatar })
        })
        .then((response) => response.json())
        .then((data) => {
            setUser({ ...user, avatar: selectedAvatar });
            setShowAvatarSelection(false);
            useNavigate("/profil");
        })
        .catch((error) => console.error("Erreur :", error));
    };

     return (
        <>
            <Header />
            <div className="userProfil">
                <div className="userAvatar">
                    <img
                        src={`/assets/image/${selectedAvatar}`}
                        alt="Avatar actuel"
                        onError={(e) => {
                            e.target.src = "/assets/image/default.png";
                        }}
                    />
                </div>
                <div className="userUsername">{user?.username}</div>
                <button
                    onClick={() => setShowAvatarSelection(!showAvatarSelection)}
                    className="toggleAvatarButton"
                >
                    {showAvatarSelection ? "Masquer les avatars" : "Changer d'avatar"}
                </button>
            </div>

            {showAvatarSelection && (
                <div className="avatarSelection">
                    <h2>Choisir un nouvel avatar</h2>
                    <div className="avatarList">
                        {avatars.map((avatar, index) => (
                            <div
                                key={index}
                                className={`avatarOption ${selectedAvatar === avatar ? "selected" : ""}`}
                                onClick={() => handleAvatarChange(avatar)}
                            >
                                <img
                                    src={`/assets/image/${avatar}`}
                                    alt={`Avatar ${avatar}`}
                                    onError={(e) => {
                                        e.target.src = "/assets/image/default.png";
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSaveAvatar} className="saveAvatarButton">
                        Enregistrer l'avatar
                    </button>
                </div>
            )}

<div className="userBets">
    <h2>Mes paris</h2>
    {bets.length > 0 ? (
        <ul className="betsList">
            {bets.map((bet) => (
                <li key={bet.id_bet} className={`betItem ${bet.status}`}>
                    <div className="betInfo">
                        <span className="betTeam">{bet.team_name}</span>
                        <span className={`betStatus ${bet.status}`}>
                            {bet.status === "pending" ? "En cours" : bet.status === "won" ? "Gagné" : "Perdu"}
                        </span>
                    </div>
                    <div className="betDetails">
                        <span className="betAmount">Montant : {bet.amount} 🪙</span>
                        <span className="betOdds">Cote : {bet.odds}</span>
                        <span className="betResult">
                            {bet.status === "pending"
                                ? `Gain potentiel : ${(bet.amount * bet.odds).toFixed(2)} 🪙`
                                : bet.status === "won"
                                    ? `Gain : ${bet.payout || (bet.amount * bet.odds).toFixed(2)} 🪙`
                                    : `Perte : ${bet.amount} 🪙`}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    ) : (
        <p>Aucun pari en cours.</p>
    )}
</div>

        </>
    );
}


export default Profil;
