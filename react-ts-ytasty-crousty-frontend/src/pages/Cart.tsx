import { Button, IconButton } from "@mui/material";
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
            <div className="page">
                <h2>Ton panier est vide.</h2>
                <Button component={Link} to="/carte" variant="contained">Voir la carte</Button>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Mon panier</h1>
            {items.map(({ product, quantity }) => (
                <div key={product.id} className="cart-line">
                    <div>
                        <strong>{product.name}</strong>
                        <p>{product.price.toFixed(2)} € / unité</p>
                    </div>
                    <div className="cart-controls">
                        <IconButton onClick={() => dispatch(decrementItem(product.id))}><RemoveIcon /></IconButton>
                        <span>{quantity}</span>
                        <IconButton onClick={() => dispatch(incrementItem(product.id))}><AddIcon /></IconButton>
                        <span>{(product.price * quantity).toFixed(2)} €</span>
                        <IconButton color="error" onClick={() => dispatch(removeItem(product.id))}><DeleteIcon /></IconButton>
                    </div>
                </div>
            ))}
            <h2>Total : {total.toFixed(2)} €</h2>
            <div className="cart-actions">
                <Button color="error" onClick={() => dispatch(clearCart())}>Vider le panier</Button>
                {/* branché au Module C plus tard */}
                <Button variant="contained" disabled>Commander</Button>
            </div>
        </div>
    );
}