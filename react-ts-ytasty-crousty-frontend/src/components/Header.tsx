import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/reducers/authSlice";
import type { AppDispatch, RootState } from "../store/store";

interface HeaderProps {
  activeRestaurant: string;
  setActiveRestaurant: (restaurant: string) => void;
  cartCount: number;
}

export default function Header({
  activeRestaurant,
  setActiveRestaurant,
  cartCount,
}: HeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

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
          <option value="Marseille">Marseille</option>
          <option value="Toulouse">Toulouse</option>
          <option value="Bordeaux">Bordeaux</option>
          <option value="Lille">Lille</option>
          <option value="Nice">Nice</option>
          <option value="Nantes">Nantes</option>
          <option value="Montpellier">Montpellier</option>
        </select>
      </div>

      <div style={styles.section}>
        <span style={styles.cartBadge}>🛒 Panier ({cartCount})</span>
      </div>

      <div style={styles.section}>
        {user ? (
          <div style={styles.userZone}>
            <span>
              {user.username} <span style={styles.badge}>{user.role}</span>
            </span>
            <button onClick={() => dispatch(logout())} style={styles.btnOutline}>
              Déconnexion
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ ...styles.btnPrimary, textDecoration: "none" }}>
            Connexion
          </Link>
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
