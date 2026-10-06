import React, { useEffect, useState } from "react";

// 1. On définit la forme (le type) d'un Restaurant tel qu'il vient de ton API Python
interface Restaurant {
  id: number;
  name: string;
  city: string;
  address: string;
  is_open: boolean;
  opening_hours: string;
  contact: string;
}

export default function RestaurantList() {
  // 2. On précise à useState que c'est un tableau de "Restaurant" (Restaurant[])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/restaurants/")
      .then((response) => response.json())
      .then((data: Restaurant[]) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de connexion à l'API:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Chargement des établissements...</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Choisissez votre établissement</h2>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {restaurants.map((rest) => (
          <div key={rest.id} style={styles.card}>
            <h3>{rest.name}</h3>
            <p>📍 {rest.address}</p>
            <p>📞 {rest.contact}</p>
            <p>🕒 {rest.opening_hours}</p>

            <p
              style={{
                fontWeight: "bold",
                color: rest.is_open ? "#2ed573" : "#ff4757",
              }}
            >
              {rest.is_open ? "🟢 Ouvert" : "🔴 Fermé actuellement"}
            </p>

            {rest.is_open ? (
              <button style={styles.btnOrder}>Commander ici</button>
            ) : (
              <button disabled style={styles.btnDisabled}>
                Prise de commande désactivée
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. On type également les styles pour rassurer TypeScript
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: "1px solid #dfe4ea",
    borderRadius: "10px",
    padding: "1.5rem",
    width: "300px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    backgroundColor: "white",
  },
  btnOrder: {
    width: "100%",
    padding: "0.8rem",
    backgroundColor: "#1e90ff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnDisabled: {
    width: "100%",
    padding: "0.8rem",
    backgroundColor: "#a4b0be",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "not-allowed",
  },
};
