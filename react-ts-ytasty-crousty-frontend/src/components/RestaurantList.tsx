// Charge les restaurants depuis l'API et dirige le client vers leur catalogue.
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import { getRestaurants } from "../services/orderService";
import type { RestaurantSummary } from "../types/orders";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getRestaurants()
      .then((data) => {
        if (active) setRestaurants(data);
      })
      .catch(() => {
        if (active) setError("Impossible de charger les restaurants.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 800 }}>
          Nos restaurants
        </Typography>
        <Typography component="h1" variant="h4">
          Choisissez votre établissement
        </Typography>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={170} />
          <Skeleton variant="rounded" height={170} />
        </Stack>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 2 }}>
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} variant="outlined">
              <CardContent>
                <Typography variant="h6">{restaurant.name}</Typography>
                <Typography color="text.secondary">{restaurant.city}</Typography>
                {restaurant.address && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{restaurant.address}</Typography>}
                {restaurant.opening_hours && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{restaurant.opening_hours}</Typography>}
                {typeof restaurant.is_open === "boolean" && (
                  <Chip
                    size="small"
                    sx={{ mt: 2 }}
                    label={restaurant.is_open ? "Ouvert" : "Fermé"}
                    color={restaurant.is_open ? "success" : "default"}
                  />
                )}
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  component={Link}
                  to={`/carte?restaurant_id=${restaurant.id}`}
                  variant="contained"
                  fullWidth
                  disabled={restaurant.is_open === false}
                >
                  {restaurant.is_open === false ? "Fermé" : "Commander ici"}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}
