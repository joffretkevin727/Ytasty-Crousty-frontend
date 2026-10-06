import { useEffect, useState } from "react";
import { Alert, Button, Chip, Skeleton } from "@mui/material";
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

    if (loading) return <div className="page"><Skeleton variant="rounded" height={400} /></div>;
    if (error || !product) return <div className="page"><Alert severity="error">{error}</Alert></div>;

    return (
        <div className="page">
            <Link to="/carte">← Retour à la carte</Link>
            {product.image_url && <img className="detail-image" src={product.image_url} alt={product.name} />}
            <div className="detail-info">
                <Chip label={product.category} />
                <h1>{product.name}</h1>
                <p>Ingrédients : {product.ingredients.join(", ")}</p>
                <h2>{product.price.toFixed(2)} €</h2>
                <Chip
                    label={product.is_available ? "Disponible" : "Indisponible"}
                    color={product.is_available ? "success" : "error"}
                />
                <Button
                    variant="contained"
                    size="large"
                    disabled={!product.is_available}
                    onClick={() => dispatch(addItem(product))}
                >
                    {product.is_available ? "Ajouter au panier" : "Indisponible"}
                </Button>
            </div>
        </div>
    );
}