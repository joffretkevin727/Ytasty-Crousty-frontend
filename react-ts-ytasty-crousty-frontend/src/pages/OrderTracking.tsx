import { useEffect, useState } from "react";
import { Alert, Button, Skeleton, Step, StepLabel, Stepper, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOrder } from "../services/orderService";
import { fetchProduct } from "../services/productService";
import type { Order, OrderStatus } from "../type/order";

const STEPS: { status: OrderStatus; label: string }[] = [
    { status: "pending", label: "En attente" },
    { status: "validated", label: "Validée" },
    { status: "preparing", label: "En préparation" },
    { status: "ready", label: "Prête" },
    { status: "collected", label: "Récupérée" },
];

export default function OrderTracking() {
    const { order_number } = useParams();
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const [names, setNames] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!order_number) {
            setOrder(null);
            return;
        }
        setLoading(true);
        setError("");
        fetchOrder(order_number)
            .then(async (o) => {
                setOrder(o);
                // l'API ne renvoie pas les noms des produits, on les récupère
                const found: Record<number, string> = {};
                await Promise.all(
                    o.items.map(async (it) => {
                        try {
                            const p = await fetchProduct(it.product_id);
                            found[it.product_id] = p.name;
                        } catch {
                            // on garde le nom par défaut
                        }
                    })
                );
                setNames(found);
            })
            .catch(() => {
                setOrder(null);
                setError("Commande introuvable. Vérifie le numéro.");
            })
            .finally(() => setLoading(false));
    }, [order_number]);

    const search = () => {
        if (input.trim()) navigate(`/suivi/${input.trim()}`);
    };

    const activeStep = order ? STEPS.findIndex((s) => s.status === order.status) : 0;

    return (
        <div className="page narrow">
            <h1>Suivi de commande</h1>

            <div className="search-order">
                <TextField
                    label="Numéro de commande"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") search(); }}
                    fullWidth
                />
                <Button variant="contained" onClick={search}>Rechercher</Button>
            </div>

            {loading && <Skeleton variant="rounded" height={200} />}
            {error && <Alert severity="error">{error}</Alert>}

            {order && !loading && (
                <div>
                    <h2>Commande {order.order_number}</h2>

                    {order.status === "cancelled" ? (
                        <Alert severity="warning">Cette commande a été annulée.</Alert>
                    ) : (
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {STEPS.map((s) => (
                                <Step key={s.status}>
                                    <StepLabel>{s.label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    )}

                    <div className="summary">
                        <h3>Récapitulatif</h3>
                        {order.items.map((it) => (
                            <p key={it.product_id}>
                                {it.quantity} x {names[it.product_id] ?? `Produit ${it.product_id}`} : {(it.unit_price * it.quantity).toFixed(2)} €
                            </p>
                        ))}
                        <p>Retrait : {order.pickup_mode === "onsite" ? "Sur place" : "À emporter"}</p>
                        <p><strong>Montant payé : {order.total_price.toFixed(2)} €</strong></p>
                    </div>
                </div>
            )}
        </div>
    );
}