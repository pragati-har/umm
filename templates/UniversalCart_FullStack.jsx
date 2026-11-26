
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const API = "http://localhost:5000/api/records";
const CATEGORY = "Product";

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET PRODUCTS
  const loadProducts = async () => {
    try {
      setError("");

      const response = await fetch(
        `${API}?category=${CATEGORY}`
      );

      if (!response.ok) {
        throw new Error("Could not load products");
      }

      const records = await response.json();

      setProducts(
        records.map(record => ({
          id: record._id,
          name: record.name,
          price: Number(record.details?.price || 0),
          stock: Number(record.details?.stock || 0)
        }))
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // POST PRODUCT
  const addProduct = async (product) => {
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: product.name,
          category: CATEGORY,
          details: {
            price: Number(product.price),
            stock: Number(product.stock)
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add product");
      }

      await loadProducts();
      return true;

    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // ADD TO CART
  const add = (product) => {
    const quantity =
      cart.find(item => item.id === product.id)?.quantity || 0;

    if (quantity >= product.stock) {
      alert("Stock limit reached");
      return;
    }

    setCart(prev => {
      const found = prev.find(item => item.id === product.id);

      if (found) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // CHANGE QUANTITY
  const change = (id, amount) => {
    const product = products.find(p => p.id === id);
    const quantity =
      cart.find(item => item.id === id)?.quantity || 0;

    if (amount > 0 && quantity >= (product?.stock || 0)) {
      alert("Stock limit reached");
      return;
    }

    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const remove = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = useMemo(
    () => cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        products,
        cart,
        loading,
        error,
        addProduct,
        add,
        change,
        remove,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  return useContext(CartContext);
}

// ADD PRODUCT FORM
function AddProduct() {
  const { addProduct } = useCart();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: ""
  });

  const [saving, setSaving] = useState(false);

  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      form.price === "" ||
      form.stock === "" ||
      Number(form.price) < 0 ||
      Number(form.stock) < 0
    ) {
      alert("Enter valid product details");
      return;
    }

    setSaving(true);

    const success = await addProduct(form);

    setSaving(false);

    if (success) {
      setForm({ name: "", price: "", stock: "" });
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white p-5 rounded-xl shadow mb-8 grid sm:grid-cols-3 gap-3"
    >

      <h2 className="font-bold text-xl sm:col-span-3">
        Add Product to Database
      </h2>

      <input
        className="border p-3 rounded"
        name="name"
        placeholder="Product name"
        value={form.name}
        onChange={update}
        required
      />

      <input
        className="border p-3 rounded"
        name="price"
        type="number"
        min="0"
        placeholder="Price"
        value={form.price}
        onChange={update}
        required
      />

      <input
        className="border p-3 rounded"
        name="stock"
        type="number"
        min="0"
        placeholder="Stock"
        value={form.stock}
        onChange={update}
        required
      />

      <button
        disabled={saving}
        className="sm:col-span-3 bg-indigo-600 text-white p-3 rounded"
      >
        {saving ? "Saving..." : "Add Product"}
      </button>

    </form>
  );
}

// PRODUCT LIST
function ProductList() {
  const { products, loading, error, add } = useCart();

  if (loading) return <p>Loading products...</p>;

  return (
    <section>

      <h2 className="text-xl font-bold mb-3">
        Products from MongoDB
      </h2>

      {error && (
        <p className="text-red-600 mb-3">{error}</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {products.map(product => (
          <article
            key={product.id}
            className="bg-white p-4 rounded-xl shadow"
          >

            <h3 className="font-bold">{product.name}</h3>

            <p className="my-2">₹{product.price}</p>

            <p className="text-sm text-gray-500">
              Stock: {product.stock}
            </p>

            <button
              onClick={() => add(product)}
              className="mt-3 w-full bg-indigo-600 text-white p-2 rounded"
            >
              Add to Cart
            </button>

          </article>
        ))}

      </div>

      {products.length === 0 && (
        <p>No products yet. Add one above.</p>
      )}

    </section>
  );
}

// CART
function Cart() {
  const { cart, change, remove, subtotal } = useCart();

  return (
    <section className="bg-white p-5 rounded-xl shadow mt-8">

      <h2 className="text-xl font-bold mb-3">
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map(item => (
          <div
            key={item.id}
            className="border-b py-3 flex justify-between gap-3"
          >

            <div>
              {item.name} — ₹{item.price} × {item.quantity}
            </div>

            <div className="flex gap-2">
              <button onClick={() => change(item.id, -1)}>-</button>
              <button onClick={() => change(item.id, 1)}>+</button>

              <button
                onClick={() => remove(item.id)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>

          </div>
        ))
      )}

      <p className="font-bold text-right mt-4">
        Total: ₹{subtotal.toFixed(2)}
      </p>

    </section>
  );
}

export default function App() {
  return (
    <CartProvider>
      <main className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          Campus Cafe — Full Stack
        </h1>

        <AddProduct />
        <ProductList />
        <Cart />

      </main>
    </CartProvider>
  );
}
