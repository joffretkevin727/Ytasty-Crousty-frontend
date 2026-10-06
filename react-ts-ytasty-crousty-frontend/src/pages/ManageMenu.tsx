import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Skeleton, Snackbar, Switch, TextField } from "@mui/material";
import { createProduct, deleteProduct, fetchProducts, updateAvailability, updateProduct } from "../services/productService";
import type { Category, Product, ProductPayload } from "../type/product";

const CATEGORIES: Category[] = ["chicken", "side", "vegetarian", "menu", "dessert", "drink"];

const LABELS: Record<Category, string> = {
    chicken: "Poulet",
    side: "Accompagnements",
    vegetarian: "Végétarien",
    menu: "Menus",
    dessert: "Desserts",
    drink: "Boissons",
};

// TODO Module D : remplacer cette ligne par
// const user = useSelector((state: RootState) => state.auth.user);
// (à mettre dans le composant, et adapter les noms au slice d'authentification du groupe)
const user = { role: "admin" as "staff" | "admin" | "direction", restaurant_id: 1 };

const emptyForm = {
    name: "",
    description: "",
    category: "chicken" as Category,
    price: "",
    ingredients: "",
    image: "",
    restaurant_id: "",
};

export default function ManageMenu() {
    const isAdmin = user.role === "admin";
    const allowed = user.role === "admin" || user.role === "staff";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form, setForm] = useState(emptyForm);

    const load = () => {
        setLoading(true);
        // le staff ne voit que les produits de son restaurant, l'admin voit tout
        fetchProducts({ restaurant_id: isAdmin ? undefined : user.restaurant_id })
            .then(setProducts)
            .catch(() => setError("Impossible de charger les produits."))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    // exécute une action API et affiche le résultat
    const run = async (action: () => Promise<unknown>, success: string) => {
        setError("");
        try {
            await action();
            setMessage(success);
            return true;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.log("Réponse de l'API :", JSON.stringify(e.response?.data, null, 2));
            }
            setError("Action impossible (droits insuffisants ou données invalides).");
            return false;
        }
    };

    const toggle = async (p: Product) => {
        const ok = await run(() => updateAvailability(p.id, !p.is_available), "Disponibilité mise à jour");
        if (ok) {
            setProducts(products.map((x) => (x.id === p.id ? { ...x, is_available: !p.is_available } : x)));
        }
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ ...emptyForm, restaurant_id: isAdmin ? "" : String(user.restaurant_id) });
        setDialogOpen(true);
    };

    const openEdit = (p: Product) => {
        setEditing(p);
        setForm({
            name: p.name,
            description: p.description,
            category: p.category,
            price: String(p.price),
            ingredients: p.ingredients.join(", "),
            image: p.image ?? "",
            restaurant_id: String(p.restaurant_id),
        });
        setDialogOpen(true);
    };

    const formOk =
        form.name.trim() !== "" &&
        Number(form.price) > 0 &&
        form.restaurant_id !== "" &&
        form.ingredients.trim() !== "";

    const save = async () => {
        const payload: ProductPayload = {
            name: form.name.trim(),
            description: form.description.trim(),
            category: form.category,
            price: Number(form.price),
            ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
            image: form.image.trim() || undefined,
            restaurant_id: Number(form.restaurant_id),
        };
        const ok = editing
            ? await run(() => updateProduct(editing.id, payload), "Produit modifié")
            : await run(() => createProduct({ ...payload, is_available: true }), "Produit créé");
        if (ok) {
            setDialogOpen(false);
            load();
        }
    };

    const remove = async (p: Product) => {
        if (!window.confirm(`Supprimer "${p.name}" ?`)) return;
        const ok = await run(() => deleteProduct(p.id), "Produit supprimé");
        if (ok) setProducts(products.filter((x) => x.id !== p.id));
    };

    if (!allowed) {
        return <div className="page"><Alert severity="error">Accès réservé au staff et aux administrateurs.</Alert></div>;
    }

    return (
        <div className="page">
            <div className="manage-header">
                <h1>Gestion de la carte</h1>
                {isAdmin && <Button variant="contained" onClick={openCreate}>Nouveau produit</Button>}
            </div>

            {error && <Alert severity="error">{error}</Alert>}

            {loading ? (
                <Skeleton variant="rounded" height={300} />
            ) : (
                <div>
                    {products.map((p) => (
                        <div key={p.id} className="manage-line">
                            <div>
                                <strong>{p.name}</strong>
                                <p>{p.price.toFixed(2)} € · {LABELS[p.category]} · restaurant {p.restaurant_id}</p>
                            </div>
                            <div className="manage-actions">
                                <Switch checked={p.is_available} onChange={() => toggle(p)} />
                                <span>{p.is_available ? "Disponible" : "Rupture"}</span>
                                {isAdmin && (
                                    <>
                                        <Button onClick={() => openEdit(p)}>Modifier</Button>
                                        <Button color="error" onClick={() => remove(p)}>Supprimer</Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    {!products.length && <p>Aucun produit.</p>}
                </div>
            )}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editing ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
                <DialogContent>
                    <div className="form dialog-form">
                        <TextField label="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        <TextField select label="Catégorie" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                            {CATEGORIES.map((c) => (
                                <MenuItem key={c} value={c}>{LABELS[c]}</MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Prix (€)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                        <TextField label="Ingrédients (séparés par des virgules)" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
                        <TextField label="Lien de l'image (optionnel)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                        <TextField
                            label="Restaurant (id)"
                            type="number"
                            value={form.restaurant_id}
                            disabled={!isAdmin}
                            onChange={(e) => setForm({ ...form, restaurant_id: e.target.value })}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
                    <Button variant="contained" disabled={!formOk} onClick={save}>Enregistrer</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={message !== ""} autoHideDuration={2500} onClose={() => setMessage("")} message={message} />
        </div>
    );
}