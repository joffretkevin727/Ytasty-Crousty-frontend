import React from "react";

// 1. On définit la forme de l'utilisateur
interface User {
  name: string;
  role: string;
  avatar: string;
}

// 2. On définit ce que le Header va recevoir comme "props"
interface HeaderProps {
  activeRestaurant: string;
  setActiveRestaurant: (restaurant: string) => void;
  cartCount: number;
  user: User | null;
  setUser: (user: User | null) => void;
}

// 3. On applique ces types à notre fonction
export default function Header({
  activeRestaurant,
  setActiveRestaurant,
  cartCount,
  user,
  setUser,
}: HeaderProps) {
  return (
    <header style={styles.header}>
      <div style={styles.section}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#ff4757" }}>
          🍔 Ytasty Crousty
        </h1>
        <select
          value={activeRestaurant}
          onChange={(e) => setActiveRestaurant(e.target.value)}
          style={styles.select}
        >
          <option value="Aix-en-Provence">Aix-en-Provence</option>
          <option value="Lyon">Lyon</option>
          <option value="Paris">Paris</option>
        </select>
      </div>

      <div style={styles.section}>
        <span style={styles.cartBadge}>🛒 Panier ({cartCount})</span>
      </div>

      <div style={styles.section}>
        {user ? (
          <div style={styles.userZone}>
            <img src={user.avatar} alt="Avatar" style={styles.avatar} />
            <span>
              {user.name} <span style={styles.badge}>{user.role}</span>
            </span>
            <button onClick={() => setUser(null)} style={styles.btnOutline}>
              Déconnexion
            </button>
          </div>
        ) : (
          <button
            onClick={() =>
              setUser({
                name: "Admin_Tom",
                role: "admin",
                avatar: "https://i.pravatar.cc/150?img=11",
              })
            }
            style={styles.btnPrimary}
          >
            Connexion
          </button>
        )}
      </div>
    </header>
  );
}

// Les styles restent identiques
const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#f1f2f6",
    borderBottom: "2px solid #dfe4ea",
  },
  section: { display: "flex", alignItems: "center", gap: "1rem" },
  select: { padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" },
  cartBadge: {
    backgroundColor: "#ff4757",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontWeight: "bold",
  },
  userZone: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: { width: "35px", height: "35px", borderRadius: "50%" },
  badge: {
    backgroundColor: "#ffa502",
    color: "white",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "0.8rem",
    marginLeft: "5px",
  },
  btnPrimary: {
    backgroundColor: "#2ed573",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
  },
  btnOutline: {
    backgroundColor: "transparent",
    border: "1px solid #ff4757",
    color: "#ff4757",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
