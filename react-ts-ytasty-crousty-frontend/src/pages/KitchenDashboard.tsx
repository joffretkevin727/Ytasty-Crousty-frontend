import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import Refresh from "@mui/icons-material/Refresh";
import { useSelector } from "react-redux";

import {
  cancelOrder,
  getRestaurant,
  getRestaurantOrders,
  getRestaurantProducts,
  getRestaurants,
  updateOrderStatus,
} from "../services/orderService";
import type { RootState } from "../store/store";
import type {
  KitchenOrder,
  OrderStatus,
  ProductSummary,
  RestaurantSummary,
} from "../types/orders";

type StatusFilter = "all" | "pending" | "preparing" | "ready";

const columns: { id: Exclude<StatusFilter, "all">; title: string }[] = [
  { id: "pending", title: "À traiter" },
  { id: "preparing", title: "En préparation" },
  { id: "ready", title: "Prêtes" },
];

const staleAfterMinutes = 15;
const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ detail?: string }>(error)) {
    return error.response?.data?.detail ?? "Impossible de communiquer avec l'API.";
  }
  return "Une erreur inattendue est survenue.";
}

function getOrderAge(order: KitchenOrder, now: number): number {
  const createdAt = Date.parse(order.created_at);
  return Number.isNaN(createdAt)
    ? 0
    : Math.max(0, Math.floor((now - createdAt) / 60_000));
}

function getColumn(order: KitchenOrder): StatusFilter {
  if (order.status === "pending" || order.status === "validated") return "pending";
  if (order.status === "preparing" || order.status === "ready") return order.status;
  return "pending";
}

function getNextStatus(status: OrderStatus): OrderStatus {
  if (status === "pending" || status === "validated") return "preparing";
  if (status === "preparing") return "ready";
  return "collected";
}

function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: "En attente",
    validated: "Validée",
    preparing: "En préparation",
    ready: "Prête",
    collected: "Récupérée",
    cancelled: "Annulée",
  };
  return labels[status];
}

export default function KitchenDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | "">("");
  const [linkedRestaurantName, setLinkedRestaurantName] = useState("");
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loadingRestaurants, setLoadingRestaurants] = useState(user?.role === "admin");
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [busyOrder, setBusyOrder] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ severity: "success" | "error"; message: string } | null>(null);
  const [now, setNow] = useState(0);

  const isAdmin = user?.role === "admin";
  const restaurantId = isAdmin
    ? selectedRestaurantId
    : user?.restaurantId ?? "";
  const restaurantName = isAdmin
    ? restaurants.find((restaurant) => restaurant.id === restaurantId)?.name ?? ""
    : linkedRestaurantName;

  useEffect(() => {
    let active = true;

    if (isAdmin) {
      getRestaurants()
        .then((result) => {
          if (!active) return;
          setRestaurants(result);
          setSelectedRestaurantId((current) => current || result[0]?.id || "");
        })
        .catch((requestError: unknown) => {
          if (active) setError(getErrorMessage(requestError));
        })
        .finally(() => {
          if (active) setLoadingRestaurants(false);
        });
    } else if (typeof user?.restaurantId === "number") {
      getRestaurant(user.restaurantId)
        .then((restaurant) => {
          if (active) setLinkedRestaurantName(`${restaurant.name} · ${restaurant.city}`);
        })
        .catch((requestError: unknown) => {
          if (active) setError(getErrorMessage(requestError));
        });
    }

    return () => {
      active = false;
    };
  }, [isAdmin, user?.restaurantId]);

  useEffect(() => {
    if (typeof restaurantId !== "number") {
      return;
    }

    let active = true;
    const load = async (initialLoad: boolean) => {
      if (initialLoad) setLoadingOrders(true);
      else setRefreshing(true);

      try {
        const [nextOrders, nextProducts] = await Promise.all([
          getRestaurantOrders(restaurantId),
          getRestaurantProducts(restaurantId),
        ]);
        if (active) {
          setOrders(nextOrders);
          setProducts(nextProducts);
          setNow(Date.now());
          setError("");
        }
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError));
      } finally {
        if (active) {
          setLoadingOrders(false);
          setRefreshing(false);
        }
      }
    };

    void load(true);
    const interval = window.setInterval(() => {
      setNow(Date.now());
      void load(false);
    }, 30_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [restaurantId]);

  const activeOrders = orders
    .filter((order) => ["pending", "validated", "preparing", "ready"].includes(order.status))
    .sort((left, right) => Date.parse(left.created_at) - Date.parse(right.created_at));
  const overdueCount = activeOrders.filter((order) =>
    (order.status === "pending" || order.status === "validated") &&
    getOrderAge(order, now) >= staleAfterMinutes
  ).length;
  const visibleColumns = statusFilter === "all"
    ? columns
    : columns.filter((column) => column.id === statusFilter);

  const handleAdvance = async (order: KitchenOrder) => {
    setBusyOrder(order.order_number);
    try {
      const updated = await updateOrderStatus(order.order_number, getNextStatus(order.status));
      setOrders((current) => current.map((item) =>
        item.order_number === updated.order_number ? updated : item
      ));
      setToast({ severity: "success", message: `Commande ${order.order_number} : ${getStatusLabel(updated.status).toLowerCase()}.` });
    } catch (requestError) {
      setToast({ severity: "error", message: getErrorMessage(requestError) });
    } finally {
      setBusyOrder(null);
    }
  };

  const handleCancel = async (order: KitchenOrder) => {
    if (!window.confirm(`Annuler la commande ${order.order_number} ?`)) return;
    setBusyOrder(order.order_number);
    try {
      await cancelOrder(order.order_number);
      setOrders((current) => current.filter((item) => item.order_number !== order.order_number));
      setToast({ severity: "success", message: `Commande ${order.order_number} annulée.` });
    } catch (requestError) {
      setToast({ severity: "error", message: getErrorMessage(requestError) });
    } finally {
      setBusyOrder(null);
    }
  };

  const handleRefresh = async () => {
    if (typeof restaurantId !== "number") return;
    setRefreshing(true);
    setNow(Date.now());
    try {
      const [nextOrders, nextProducts] = await Promise.all([
        getRestaurantOrders(restaurantId),
        getRestaurantProducts(restaurantId),
      ]);
      setOrders(nextOrders);
      setProducts(nextProducts);
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setRefreshing(false);
    }
  };

  const hasRestaurant = typeof restaurantId === "number";

  return (
    <Box component="main" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, maxWidth: 1600, mx: "auto" }}>
      <Stack spacing={2} sx={{ mb: 3, flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}>
        <Box>
          <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 800, letterSpacing: 1.2 }}>
            Opérations restaurant
          </Typography>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
            Cuisine
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {restaurantName || (isAdmin ? "Sélectionnez un restaurant" : "Restaurant de rattachement")}
          </Typography>
        </Box>
        <Stack spacing={1.5} sx={{ flexDirection: "row", alignItems: "center" }}>
          {isAdmin && (
            <FormControl size="small" sx={{ minWidth: { xs: 180, sm: 240 } }}>
              <InputLabel id="restaurant-select-label">Restaurant</InputLabel>
              <Select
                labelId="restaurant-select-label"
                value={selectedRestaurantId}
                label="Restaurant"
                onChange={(event) => setSelectedRestaurantId(Number(event.target.value))}
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
          <Tooltip title="Actualiser les commandes">
            <span>
              <IconButton aria-label="Actualiser les commandes" onClick={() => void handleRefresh()} disabled={!hasRestaurant || refreshing}>
                {refreshing ? <CircularProgress size={20} /> : <Refresh />}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {overdueCount > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {overdueCount} commande{overdueCount > 1 ? "s" : ""} en attente depuis plus de {staleAfterMinutes} minutes.
        </Alert>
      )}
      {user?.role === "staff" && !hasRestaurant && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Aucun restaurant n’est associé à ce compte. Demandez à un administrateur de vérifier son rattachement, puis reconnectez-vous.
        </Alert>
      )}
      {isAdmin && !loadingRestaurants && restaurants.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>Aucun restaurant disponible.</Alert>
      )}

      <Stack spacing={1.5} sx={{ mb: 2, flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}>
        <Typography variant="subtitle2" color="text.secondary">
          {activeOrders.length} commande{activeOrders.length === 1 ? "" : "s"} active{activeOrders.length === 1 ? "" : "s"}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 190 }}>
          <InputLabel id="status-filter-label">Filtrer par statut</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Filtrer par statut"
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            <MenuItem value="all">Tous les statuts</MenuItem>
            <MenuItem value="pending">À traiter</MenuItem>
            <MenuItem value="preparing">En préparation</MenuItem>
            <MenuItem value="ready">Prêtes</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {loadingOrders && (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(270px, 1fr))", gap: 2, overflow: "hidden" }}>
          {columns.map((column) => (
            <Box key={column.id}>
              <Skeleton variant="rounded" height={32} sx={{ mb: 1.5 }} />
              <Skeleton variant="rounded" height={220} sx={{ mb: 1.5 }} />
              <Skeleton variant="rounded" height={180} />
            </Box>
          ))}
        </Box>
      )}

      {!loadingOrders && hasRestaurant && (
        <Box sx={{ overflowX: "auto", pb: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(280px, 1fr))`, gap: 2, minWidth: visibleColumns.length === 3 ? 880 : 280 }}>
            {visibleColumns.map((column) => {
              const columnOrders = activeOrders.filter((order) => getColumn(order) === column.id);
              return (
                <Box component="section" key={column.id} aria-label={column.title}>
                  <Stack spacing={1} sx={{ mb: 1.5, flexDirection: "row", alignItems: "center" }}>
                    <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>{column.title}</Typography>
                    <Chip size="small" label={columnOrders.length} color={column.id === "pending" && columnOrders.length > 0 ? "warning" : "default"} />
                  </Stack>
                  <Stack spacing={1.5}>
                    {columnOrders.length === 0 ? (
                      <Paper variant="outlined" sx={{ p: 2.5, textAlign: "center", color: "text.secondary" }}>
                        <Typography variant="body2">Aucune commande</Typography>
                      </Paper>
                    ) : columnOrders.map((order) => {
                      const age = getOrderAge(order, now);
                      const overdue = column.id === "pending" && age >= staleAfterMinutes;
                      const nextStatus = getNextStatus(order.status);
                      const isBusy = busyOrder === order.order_number;

                      return (
                        <Paper
                          key={order.order_number}
                          component="article"
                          variant="outlined"
                          sx={{ p: 2, borderLeft: overdue ? 4 : 1, borderLeftColor: overdue ? "warning.main" : "divider" }}
                        >
                          <Stack spacing={1} sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>#{order.order_number}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Reçue à {new Date(order.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                              </Typography>
                            </Box>
                            <Chip size="small" label={`${age} min`} color={overdue ? "warning" : "default"} />
                          </Stack>

                          {overdue && <Typography variant="caption" color="warning.dark" sx={{ display: "block", mt: 0.5, fontWeight: 700 }}>En attente depuis trop longtemps</Typography>}
                          <Stack direction="row" spacing={0.75} sx={{ mt: 1.25, mb: 1.5 }}>
                            <Chip size="small" variant="outlined" label={getStatusLabel(order.status)} />
                            <Chip size="small" variant="outlined" label={order.pickup_mode === "onsite" ? "Sur place" : "À emporter"} />
                          </Stack>

                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.customer.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{order.customer.email}</Typography>
                          <Box component="ul" sx={{ pl: 2.25, my: 1.5 }}>
                            {order.items.map((item) => {
                              const product = products.find((entry) => entry.id === item.product_id);
                              return (
                                <Typography component="li" variant="body2" key={item.product_id}>
                                  {item.quantity} × {product?.name ?? `Article ${item.product_id}`}
                                </Typography>
                              );
                            })}
                          </Box>
                          <Stack spacing={1} sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{euro.format(order.total_price)}</Typography>
                            <Stack spacing={0.5} sx={{ flexDirection: "row", alignItems: "center" }}>
                              <Tooltip title="Annuler la commande">
                                <span>
                                  <IconButton aria-label={`Annuler ${order.order_number}`} color="error" size="small" disabled={isBusy} onClick={() => void handleCancel(order)}>
                                    <CancelOutlined fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Button size="small" variant="contained" startIcon={isBusy ? <CircularProgress size={14} color="inherit" /> : undefined} disabled={isBusy} onClick={() => void handleAdvance(order)}>
                                {nextStatus === "preparing" ? "Préparer" : nextStatus === "ready" ? "Marquer prête" : "Récupérée"}
                              </Button>
                            </Stack>
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {typeof restaurantId !== "number" && !loadingRestaurants && user?.role === "admin" && restaurants.length > 0 && (
        <Alert severity="info">Choisissez un restaurant pour afficher ses commandes.</Alert>
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}