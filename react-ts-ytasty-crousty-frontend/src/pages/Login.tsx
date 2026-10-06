import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Container,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { login } from "../services/authService";
import { loginSuccess } from "../store/reducers/authSlice";

import type { AppDispatch } from "../store/store";
import type { JwtPayload } from "../types/auth";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!/^[A-Za-z0-9]{8,12}$/.test(username)) {
      setError("Le nom d'utilisateur doit contenir 8 à 12 caractères alphanumériques.");
      return;
    }

    if (password.length < 12 || password.length > 64) {
      setError("Le mot de passe doit contenir entre 12 et 64 caractères.");
      return;
    }

    try {
      setLoading(true);

      // Appel POST /auth/login
      const response = await login({
        username,
        password,
      });

      // Décodage du JWT
      const decoded = jwtDecode<JwtPayload>(response.access_token);
      if (
        !decoded.sub ||
        !["staff", "admin"].includes(decoded.role)
      ) {
        setError("Le serveur a renvoyé un jeton utilisateur invalide. Veuillez contacter l'administrateur.");
        return;
      }

      // Création de l'utilisateur Redux
      const user = {
        username: decoded.sub,
        role: decoded.role,
      };

      // Sauvegarde dans Redux + localStorage
      dispatch(
        loginSuccess({
          accessToken: response.access_token,
          user,
        })
      );

      // Redirection
      navigate(decoded.role === "admin" ? "/admin/users" : "/dashboard");

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError("API inaccessible. Vérifiez que le serveur fonctionne sur le port 8080.");
        } else if (error.response.status === 401) {
          setError("Nom d'utilisateur ou mot de passe incorrect.");
        } else {
          const detail = error.response.data?.detail;
          setError(typeof detail === "string" ? detail : "La connexion a échoué. Réessayez.");
        }
      } else {
        setError("La connexion a échoué. Réessayez.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            padding: { xs: 3, sm: 5 },
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, textAlign: "center" }}
            gutterBottom
          >
            Ytasty Crousty
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            Espace professionnel
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Nom d'utilisateur"
              autoComplete="username"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              fullWidth
              required
              slotProps={{ htmlInput: { minLength: 8, maxLength: 12 } }}
            />

            <TextField
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              fullWidth
              required
              slotProps={{ htmlInput: { minLength: 12, maxLength: 64 } }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                borderRadius: 3,
                mt: 1,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Se connecter"}
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
              Démonstration : admin123 / Admin@123456
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}