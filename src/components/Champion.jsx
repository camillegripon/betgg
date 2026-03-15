import { useEffect, useState } from "react";

function AfficherChampion () {
    const [allChampions, setAllChampions] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/champions`)
            .then((response)=> response.json())
            .then((data)=> {
                console.log(data);
                setAllChampions(data)})
            .catch((error)=> console.error("Erreur dans le chargement des champions", error));

    }, []);


    return(
        <div className="divAllChampions">
            {allChampions.map((champion, index)=>(
                <div className="oneChampion" key={index}>
                    <img src={`assets/image/${champion.image}`} alt="" />
                    <p>{champion.name_champion}</p>
                </div>
            ))}
        </div>
    )

}

export default AfficherChampion;