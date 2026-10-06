import { useEffect, useState } from "react";
import { Alert, Button, Card, Chip, FormControlLabel, MenuItem, Skeleton, Switch, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../services/productService";
import { addItem } from "../store/reducer/cart";
import type { Category, Product } from "../type/product";

const CATEGORIES: Category[] = ["burgers", "menus", "accompagnements", "boissons", "desserts"];

//remplacer par le resto selectionné
const RESTAURANT_ID = 1;

export default function ProductList() {
    const dispatch = useDispatch();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [q, setQ] = useState("");
    const [category, setCategory] = useState<Category | "">("");
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError("");
        // petit délai pour ne pas appeler l'API à chaque lettre tapée
        const timer = setTimeout(() => {
            fetchProducts({
                restaurant_id: RESTAURANT_ID,
                q: q || undefined,
                category: category || undefined,
                is_available: onlyAvailable ? true : undefined,
            })
                .then(setProducts)
                .catch(() => setError("Impossible de charger la carte."))
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(timer);
    }, [q, category, onlyAvailable]);

    return (
        <div className="page">
            <div className="filters">
                <TextField
                    className="search"
                    label="Rechercher un produit"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <TextField
                    select
                    label="Catégorie"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category | "")}
                    style={{ minWidth: 200 }}
                >
                    <MenuItem value="">Toutes</MenuItem>
                    {CATEGORIES.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                </TextField>
                <FormControlLabel
                    control={<Switch checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />}
                    label="Disponibles"
                />
            </div>

            {error && <Alert severity="error">{error}</Alert>}

            {loading ? (
                <div className="grid">
                    {[1, 2, 3, 4].map((n) => (
                        <Skeleton key={n} variant="rounded" width={280} height={340} />
                    ))}
                </div>
            ) : (
                <div className="grid">
                    {products.map((p) => (
                        <Card key={p.id} className={`product-card ${p.is_available ? "" : "unavailable"}`}>
                            {p.image_url && <img src={p.image_url} alt={p.name} />}
                            <div className="content">
                                <Chip label={p.category} size="small" />
                                <h3>
                                    <Link to={`/produit/${p.id}`}>{p.name}</Link>
                                </h3>
                                <p>{p.ingredients.join(", ")}</p>
                                <p><strong>{p.price.toFixed(2)} €</strong></p>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={!p.is_available}
                                    onClick={() => dispatch(addItem(p))}
                                >
                                    {p.is_available ? "Ajouter" : "Indisponible"}
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {!products.length && !error && <p>Aucun produit trouvé.</p>}
                </div>
            )}
        </div>
    );
}