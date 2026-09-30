import { useEffect, useState } from "react";
import {
    Alert, Box, Button, Card, CardContent, CardMedia, Chip, FormControlLabel, MenuItem, Skeleton, Stack, Switch, TextField, Typography } from "@mui/material";
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
        <Box sx={{ p: 3 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
                <TextField
                    label="Rechercher un produit"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    fullWidth
                />
                <TextField
                    select
                    label="Catégorie"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category | "")}
                    sx={{ minWidth: 200 }}
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
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 2 }}>                    {[1, 2, 3, 4].map((n) => (
                        <Skeleton key={n} variant="rounded" width={280} height={340} />
                    ))}
                </Stack>
            ) : (
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 2 }}>                    {products.map((p) => (
                        <Card key={p.id} sx={{ width: 280, opacity: p.is_available ? 1 : 0.5 }}>
                            {p.image_url && <CardMedia component="img" height="160" image={p.image_url} alt={p.name} />}
                            <CardContent>
                                <Chip label={p.category} size="small" sx={{ mb: 1 }} />
                                <Typography variant="h6" component={Link} to={`/produit/${p.id}`}
                                            sx={{ display: "block", textDecoration: "none", color: "inherit" }}>
                                    {p.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {p.ingredients.join(", ")}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ my: 1 }}>
                                    {p.price.toFixed(2)} €
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={!p.is_available}
                                    onClick={() => dispatch(addItem(p))}
                                >
                                    {p.is_available ? "Ajouter" : "Indisponible"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {!products.length && !error && <Typography>Aucun produit trouvé.</Typography>}
                </Stack>
            )}
        </Box>
    );
}