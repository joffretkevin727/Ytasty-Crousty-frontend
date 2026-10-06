// Confirme la création d'une commande et propose un accès direct à son suivi.
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";

export default function OrderConfirmation() {
    const { order_number } = useParams();

    return (
        <div className="page narrow center">
            <h1>Commande validée !</h1>
            <p>Ton numéro de commande :</p>
            <div className="big-number">{order_number}</div>
            <p>Garde-le précieusement pour suivre ta commande.</p>
            <Button component={Link} to={`/suivi/${order_number}`} variant="contained" size="large">
                Suivre ma commande
            </Button>
        </div>
    );
}