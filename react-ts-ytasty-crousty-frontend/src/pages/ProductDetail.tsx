// Charge un produit par son identifiant et permet de l'ajouter au panier.
import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Container, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchProduct, imageUrl } from "../services/productService";
import { addItem } from "../store/reducer/cart";
import type { Category, Product } from "../type/product";

const CATEGORY_LABELS: Record<Category, string> = {
    chicken: "Poulet",
    side: "Accompagnements",
    vegetarian: "Végétarien",
    menu: "Menus",
    dessert: "Desserts",
    drink: "Boissons",
};

export default function ProductDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProduct(Number(id))
            .then(setProduct)
            .catch(() => setError("Produit introuvable."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Container component="main" maxWidth="lg" sx={{ py: 5 }}><Skeleton variant="rounded" height={440} /></Container>;
    if (error || !product) return <Container component="main" maxWidth="lg" sx={{ py: 5 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
            <Button component={Link} to="/carte" color="inherit" sx={{ mb: 2 }}>← Retour à la carte</Button>
            <Paper variant="outlined" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" }, overflow: "hidden", borderColor: "divider" }}>
                {product.image ? (
                    <Box component="img" src={imageUrl(product.image)} alt={product.name} sx={{ width: "100%", height: { xs: 260, md: "100%" }, minHeight: { md: 440 }, objectFit: "cover" }} />
                ) : (
                    <Box sx={{ minHeight: 260, bgcolor: "action.hover" }} />
                )}
                <Stack spacing={2} sx={{ p: { xs: 2.5, md: 4 }, alignItems: "flex-start" }}>
                <Chip label={CATEGORY_LABELS[product.category]} color="secondary" variant="outlined" />
                <Typography component="h1" variant="h4">{product.name}</Typography>
                <Typography color="text.secondary">{product.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                    Ingrédients : {product.ingredients.join(", ")}
                </Typography>
                <Typography variant="h5" color="primary.dark">{product.price.toFixed(2)} €</Typography>
                <Chip
                    label={product.is_available ? "Disponible" : "Indisponible"}
                    color={product.is_available ? "success" : "error"}
                />
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!product.is_available}
                    onClick={() => dispatch(addItem(product))}
                >
                    {product.is_available ? "Ajouter au panier" : "Indisponible"}
                </Button>
                </Stack>
            </Paper>
        </Container>
    );
}