// Valide les coordonnées client et transforme le panier en payload POST /orders.
import { useState } from "react";
import axios from "axios";
import { Alert, Button, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { clearCart } from "../store/reducer/cart";
import type { RootState } from "../store/store";
import type { PickupMode } from "../type/order";

export default function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector((state: RootState) => state.cart.items);
    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mode, setMode] = useState<PickupMode | "">("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    if (!items.length) {
        return (
            <div className="page">
                <h2>Ton panier est vide.</h2>
                <Button component={Link} to="/carte" variant="contained">Voir la carte</Button>
            </div>
        );
    }

    const emailOk = /^\S+@\S+\.\S+$/.test(email);
    const formOk = name.trim() !== "" && emailOk && mode !== "";

    const handleSubmit = async () => {
        if (mode === "" || !formOk) return;
        setSending(true);
        setError("");
        try {
            // Le restaurant est déduit du premier produit; l'API vérifie qu'il lui appartient.
            const order = await createOrder({
                restaurant_id: items[0].product.restaurant_id,
                items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
                pickup_mode: mode,
                customer: {
                    name: name.trim(),
                    email: email.trim(),
                },
            });
            dispatch(clearCart());
            navigate(`/confirmation/${order.order_number}`);
        } catch (e) {
            // affiche dans la console ce que l'API reproche (champs manquants ou mal nommés)
            if (axios.isAxiosError(e)) {
                console.log("Réponse de l'API :", JSON.stringify(e.response?.data, null, 2));
            }
            setError("Impossible d'envoyer la commande. Réessaie dans un instant.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="page narrow">
            <h1>Valider ma commande</h1>

            <div className="summary">
                {items.map(({ product, quantity }) => (
                    <p key={product.id}>{quantity} x {product.name} : {(product.price * quantity).toFixed(2)} €</p>
                ))}
                <h3>Total : {total.toFixed(2)} €</h3>
            </div>

            <div className="form">
                <TextField label="Nom" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={email !== "" && !emailOk}
                    helperText={email !== "" && !emailOk ? "Email invalide" : ""}
                />

                <h3>Mode de retrait</h3>
                <RadioGroup value={mode} onChange={(e) => setMode(e.target.value as PickupMode)}>
                    <FormControlLabel value="onsite" control={<Radio />} label="Sur place" />
                    <FormControlLabel value="takeaway" control={<Radio />} label="À emporter" />
                </RadioGroup>

                {error && <Alert severity="error">{error}</Alert>}

                <Button variant="contained" size="large" disabled={!formOk || sending} onClick={handleSubmit}>
                    {sending ? "Envoi..." : "Commander"}
                </Button>
            </div>
        </div>
    );
}