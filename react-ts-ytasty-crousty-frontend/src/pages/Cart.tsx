import { Alert, Button, Container, Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearCart, decrementItem, incrementItem, removeItem } from "../store/reducer/cart";
import type { RootState } from "../store/store";

export default function Cart() {
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => state.cart.items);
    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    if (!items.length) {
        return (
            <Container component="main" maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
                <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", borderColor: "divider" }}>
                    <Typography component="h1" variant="h4" sx={{ mb: 1 }}>Votre panier</Typography>
                    <Alert severity="info" sx={{ justifyContent: "center", mb: 2 }}>Votre panier est vide.</Alert>
                    <Button component={Link} to="/carte" variant="contained">Découvrir la carte</Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
            <Typography component="h1" variant="h4" sx={{ mb: 3 }}>Votre panier</Typography>
            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack divider={<Divider flexItem />}>
                    {items.map(({ product, quantity }) => (
                        <Stack key={product.id} spacing={2} sx={{ py: 2, flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between" }}>
                            <Stack spacing={0.5}>
                                <Typography sx={{ fontWeight: 700 }}>{product.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{product.price.toFixed(2)} € / unité</Typography>
                            </Stack>
                            <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center" }}>
                                <IconButton aria-label={`Retirer une unité de ${product.name}`} onClick={() => dispatch(decrementItem(product.id))}><RemoveIcon /></IconButton>
                                <Typography>{quantity}</Typography>
                                <IconButton aria-label={`Ajouter une unité de ${product.name}`} onClick={() => dispatch(incrementItem(product.id))}><AddIcon /></IconButton>
                                <Typography sx={{ minWidth: 84, textAlign: "right", fontWeight: 700 }}>{(product.price * quantity).toFixed(2)} €</Typography>
                                <IconButton aria-label={`Supprimer ${product.name}`} color="error" onClick={() => dispatch(removeItem(product.id))}><DeleteIcon /></IconButton>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2} sx={{ flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}>
                    <Button color="error" onClick={() => dispatch(clearCart())}>Vider le panier</Button>
                    <Stack spacing={2} sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="h6">Total : {total.toFixed(2)} €</Typography>
                        <Button component={Link} to="/commande" variant="contained">Commander</Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}