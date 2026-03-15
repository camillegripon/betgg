import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Connexion() {
    const [formData, setFormData] = useState({ pseudo: "", email: "", password:""});
    const navigate = useNavigate();
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/connexion`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                             },
                    credentials: "include",
                    body: JSON.stringify(formData),
            });
                if(!response.ok){
                    throw new Error("Erreur lors de l'envoi du formulaire d'inscription");
                }
                const data = await response.json();
                console.log("Réponse du serveur", data);
                setFormData({pseudo:"", email:"", password:""});
                navigate("/");            
            } catch (error) {
                console.error("Erreur:", error.message);
                }

    }


    return(
            <div className="formDataInscription">
                <form onSubmit={handleSubmit}>
                    <input  type="text" 
                            name="pseudo" 
                            placeholder="Pseudo" 
                            value={formData.pseudo} 
                            onChange={handleChange} 
                            required />
                    <input  type="text" 
                            name="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required />
                    <input  type="password" 
                            name="password" 
                            placeholder="Mot de Passe" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required />¨
                    <button type="submit">Valider</button>
                </form>
            </div>


    )


}

export default Connexion;