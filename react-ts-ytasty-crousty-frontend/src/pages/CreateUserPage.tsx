import React, { useState } from 'react';
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
import { createUserRequest, type CreateUserRequest } from '../services/authService.ts';

// Fournit le formulaire de création d'utilisateurs pour les administrateurs
export const CreateUserPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<CreateUserRequest['role']>('staff');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Soumet les informations du nouvel utilisateur au backend
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFeedback(null);
      await createUserRequest({ username, password, role });
      setFeedback({ type: 'success', message: `Utilisateur ${username} créé avec succès.` });
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
            label="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Rôle</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Rôle"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 3, py: 1.2 }}>
            {loading ? 'Création...' : "Créer l'utilisateur"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};