import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Container,
    FormControlLabel,
    MenuItem,
    Paper,
    Skeleton,
    Snackbar,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts, imageUrl } from "../services/productService";
import { addItem } from "../store/reducer/cart";
import type { Category, Product } from "../type/product";

const CATEGORIES: Category[] = ["chicken", "side", "vegetarian", "menu", "dessert", "drink"];

const LABELS: Record<Category, string> = {
    chicken: "Poulet",
    side: "Accompagnements",
    vegetarian: "Végétarien",
    menu: "Menus",
    dessert: "Desserts",
    drink: "Boissons",
};

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
    const [added, setAdded] = useState(false);

    useEffect(() => {
        let active = true;
        const timer = setTimeout(() => {
            fetchProducts({
                restaurant_id: RESTAURANT_ID,
                q: q || undefined,
                category: category || undefined,
                is_available: onlyAvailable ? true : undefined,
            })
                .then((result) => {
                    if (active) setProducts(result);
                })
                .catch(() => {
                    if (active) setError("Impossible de charger la carte.");
                })
                .finally(() => {
                    if (active) setLoading(false);
                });
        }, 300);
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [q, category, onlyAvailable]);

    const handleAdd = (p: Product) => {
        dispatch(addItem(p));
        setAdded(true);
    };

    const handleFilterChange = (update: () => void) => {
        setLoading(true);
        setError("");
        update();
    };

    return (
        <Container component="main" maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
            <Stack spacing={0.75} sx={{ mb: 3 }}>
                <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 800 }}>
                    Fraîchement préparé
                </Typography>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 900 }}>
                    La carte
                </Typography>
                <Typography color="text.secondary">
                    Les favoris du restaurant, préparés à la commande.
                </Typography>
            </Stack>

            <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, borderColor: "divider" }}>
                <Stack spacing={1.5} sx={{ flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" } }}>
                <TextField
                    sx={{ flex: 1, minWidth: 220 }}
                    label="Rechercher un produit"
                    value={q}
                    onChange={(e) => handleFilterChange(() => setQ(e.target.value))}
                />
                <TextField
                    select
                    label="Catégorie"
                    value={category}
                    onChange={(e) => handleFilterChange(() => setCategory(e.target.value as Category | ""))}
                    sx={{ minWidth: { xs: "100%", md: 210 } }}
                >
                    <MenuItem value="">Toutes</MenuItem>
                    {CATEGORIES.map((c) => (
                        <MenuItem key={c} value={c}>{LABELS[c]}</MenuItem>
                    ))}
                </TextField>
                <FormControlLabel
                    control={<Switch checked={onlyAvailable} onChange={(e) => handleFilterChange(() => setOnlyAvailable(e.target.checked))} />}
                    label="Disponibles"
                    sx={{ whiteSpace: "nowrap", mx: 0 }}
                />
                <Button component={Link} to="/panier" variant="outlined">Voir le panier</Button>
                </Stack>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 2.5 }}>
                    {[1, 2, 3, 4].map((n) => (
                        <Skeleton key={n} variant="rounded" height={360} />
                    ))}
                </Box>
            ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 2.5 }}>
                    {products.map((p) => (
                        <Card key={p.id} variant="outlined" sx={{ overflow: "hidden", display: "flex", flexDirection: "column", borderColor: "divider", transition: "transform 160ms ease, box-shadow 160ms ease", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 12px 28px rgba(48, 40, 34, 0.1)" } }}>
                            {p.image && <CardMedia component="img" image={imageUrl(p.image)} alt={p.name} sx={{ aspectRatio: "4 / 3", objectFit: "cover" }} />}
                            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, flexGrow: 1, p: 2.25 }}>
                                <Chip label={LABELS[p.category]} size="small" color="secondary" variant="outlined" />
                                <Typography component={Link} to={`/produit/${p.id}`} variant="h6" sx={{ color: "text.primary", textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                                    {p.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                                    {p.ingredients.join(", ")}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ p: 2.25, pt: 0, display: "flex", justifyContent: "space-between", gap: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{p.price.toFixed(2)} €</Typography>
                                <Button
                                    variant="contained"
                                    disabled={!p.is_available}
                                    onClick={() => handleAdd(p)}
                                >
                                    {p.is_available ? "Ajouter" : "Indisponible"}
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                    {!products.length && !error && <Alert severity="info">Aucun produit trouvé.</Alert>}
                </Box>
            )}

            <Snackbar
                open={added}
                autoHideDuration={2000}
                onClose={() => setAdded(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                message="Ajouté au panier"
            />
        </Container>
    );
}