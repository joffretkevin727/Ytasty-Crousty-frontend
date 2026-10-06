import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Badge,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";

import { logout } from "../store/reducers/authSlice";
import type { AppDispatch, RootState } from "../store/store";

interface HeaderProps {
  activeRestaurant: string;
  setActiveRestaurant: (restaurant: string) => void;
  cartCount: number;
}

export default function Header({
  activeRestaurant,
  setActiveRestaurant,
  cartCount,
}: HeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar
        sx={{
          maxWidth: 1440,
          width: "100%",
          mx: "auto",
          px: { xs: 1.5, sm: 3 },
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{
            flex: "1 1 145px",
            color: "primary.main",
            fontWeight: 900,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Ytasty Crousty
        </Typography>
        <Button component={Link} to="/carte" color="inherit" sx={{ display: { xs: "none", md: "inline-flex" } }}>
          La carte
        </Button>
        <FormControl size="small" sx={{ flex: "0 1 190px", minWidth: 130 }}>
          <InputLabel id="header-restaurant-label">Restaurant</InputLabel>
          <Select
            labelId="header-restaurant-label"
            value={activeRestaurant}
            label="Restaurant"
            onChange={(event) => setActiveRestaurant(event.target.value)}
          >
            <MenuItem value="Aix-en-Provence">Aix-en-Provence</MenuItem>
            <MenuItem value="Lyon">Lyon</MenuItem>
            <MenuItem value="Paris">Paris</MenuItem>
            <MenuItem value="Marseille">Marseille</MenuItem>
            <MenuItem value="Toulouse">Toulouse</MenuItem>
            <MenuItem value="Bordeaux">Bordeaux</MenuItem>
            <MenuItem value="Lille">Lille</MenuItem>
            <MenuItem value="Nice">Nice</MenuItem>
            <MenuItem value="Nantes">Nantes</MenuItem>
            <MenuItem value="Montpellier">Montpellier</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Ouvrir le panier">
          <IconButton component={Link} to="/panier" color="primary" aria-label={`Panier, ${cartCount} article${cartCount === 1 ? "" : "s"}`}>
            <Badge badgeContent={cartCount} color="secondary" max={99}>
              <ShoppingBagOutlined />
            </Badge>
          </IconButton>
        </Tooltip>
        {user ? (
          <Stack spacing={1} sx={{ flexDirection: "row", alignItems: "center" }}>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, fontWeight: 700 }}>
              {user.username}
            </Typography>
            <Chip size="small" label={user.role} color={user.role === "admin" ? "primary" : "secondary"} />
            <Button color="inherit" size="small" onClick={() => dispatch(logout())}>
              Déconnexion
            </Button>
          </Stack>
        ) : (
          <Button component={Link} to="/login" variant="contained" size="small">
            Connexion
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
