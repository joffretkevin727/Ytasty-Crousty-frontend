// Formulaire admin: valide les identifiants puis rattache chaque staff à un restaurant.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
} from '@mui/material';
import { createUserRequest, type CreateUserRequest } from '../services/authService';
import { getRestaurants } from '../services/orderService';
import type { RestaurantSummary } from '../types/orders';

// Fournit le formulaire de création d'utilisateurs pour les administrateurs
export const CreateUserPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<CreateUserRequest['role']>('staff');
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | ''>('');
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    getRestaurants()
      .then((result) => {
        if (active) {
          setRestaurants(result);
          setRestaurantId(result[0]?.id ?? '');
        }
      })
      .catch(() => {
        if (active) {
          setFeedback({ type: 'error', message: 'Impossible de charger les restaurants.' });
        }
      })
      .finally(() => {
        if (active) setLoadingRestaurants(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Soumet les informations du nouvel utilisateur au backend
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ces contraintes doivent rester identiques aux schémas Pydantic de l'API.
    if (!/^[A-Za-z0-9]{8,12}$/.test(username)) {
      setFeedback({ type: 'error', message: "L'identifiant doit contenir 8 à 12 caractères alphanumériques." });
      return;
    }
    if (password.length < 12 || password.length > 64 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setFeedback({ type: 'error', message: 'Le mot de passe doit contenir 12 à 64 caractères, une majuscule, un chiffre et un caractère spécial.' });
      return;
    }
    if (role === 'staff' && restaurantId === '') {
      setFeedback({ type: 'error', message: 'Sélectionnez le restaurant de rattachement du staff.' });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);
      await createUserRequest({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username,
        password,
        role,
        restaurant_id: role === 'staff' && typeof restaurantId === 'number' ? restaurantId : null,
      });
      setFeedback({ type: 'success', message: `Utilisateur ${username} créé avec succès.` });
      setFirstName('');
      setLastName('');
      setUsername('');
      setPassword('');
      setRole('staff');
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.detail || err.response?.data?.message || "Erreur lors de la création de l'utilisateur."
        : "Erreur lors de la création de l'utilisateur.";
      setFeedback({
        type: 'error',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Créer un utilisateur (Admin)
        </Typography>

        {feedback && (
          <Alert severity={feedback.type} sx={{ mb: 2 }}>
            {feedback.message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleCreate}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{ htmlInput: { minLength: 8, maxLength: 12 } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{ htmlInput: { minLength: 12, maxLength: 64 } }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Rôle</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Rôle"
              onChange={(e) => setRole(e.target.value as CreateUserRequest['role'])}
            >
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          {role === 'staff' && (
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="restaurant-label">Restaurant de rattachement</InputLabel>
              <Select
                labelId="restaurant-label"
                value={restaurantId}
                label="Restaurant de rattachement"
                onChange={(e) => setRestaurantId(Number(e.target.value))}
                disabled={loadingRestaurants || restaurants.length === 0}
              >
                {restaurants.map((restaurant) => (
                  <MenuItem key={restaurant.id} value={restaurant.id}>
                    {restaurant.name} · {restaurant.city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 3, py: 1.2 }}>
            {loading ? 'Création...' : "Créer l'utilisateur"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};