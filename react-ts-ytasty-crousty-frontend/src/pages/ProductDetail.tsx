import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Skeleton, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchProduct } from "../services/productService";
import { addItem } from "../store/reducer/cart";
import type { Product } from "../type/product";

export default function ProductDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        fetchProduct(Number(id))
            .then(setProduct)
            .catch(() => setError("Produit introuvable."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Skeleton variant="rounded" height={400} sx={{ m: 3 }} />;
    if (error || !product) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
            <Button component={Link} to="/carte" sx={{ mb: 2 }}>← Retour à la carte</Button>
            {product.image_url && (
                <Box component="img" src={product.image_url} alt={product.name}
                     sx={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 3 }} />
            )}
            <Stack spacing={2} sx={{ mt: 2 }}>
                <Chip label={product.category} sx={{ width: "fit-content" }} />
                <Typography variant="h4">{product.name}</Typography>
                <Typography color="text.secondary">
                    Ingrédients : {product.ingredients.join(", ")}
                </Typography>
                <Typography variant="h5">{product.price.toFixed(2)} €</Typography>
                <Chip
                    label={product.is_available ? "Disponible" : "Indisponible"}
                    color={product.is_available ? "success" : "error"}
                    sx={{ width: "fit-content" }}
                />
                <Button
                    variant="contained"
                    size="large"
                    disabled={!product.is_available}
                    onClick={() => dispatch(addItem(product))}
                >
                    {product.is_available ? "Ajouter au panier" : "Indisponible"}
                </Button>
            </Stack>
        </Box>
    );
}