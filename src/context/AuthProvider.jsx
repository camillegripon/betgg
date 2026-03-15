import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext"; // On importe maintenant le contexte

export function AuthProvider({ children }) {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [neekos, setNeekos] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/check_auth`, {
            method: "GET",
            credentials: "include"
        })
        .then(response => response.ok ? response.json() : Promise.reject("Non authentifié"))
        .then(data => {
            setIsLogged(true);
            setUser(data.user);
            setNeekos(data.user.neekos);
            setRole(data.user.role);
            console.log("refresh");
        })
        .catch(() => {
            setIsLogged(false);
            setUser(null);
            setNeekos(null);
            setRole(null);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ isLogged, setIsLogged, user, setUser, neekos, setNeekos, role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
