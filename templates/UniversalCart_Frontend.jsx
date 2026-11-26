
import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

const initialProducts = [
  { id: 1, name: "Veg Sandwich", price: 80, stock: 5 },
  { id: 2, name: "Masala Dosa", price: 100, stock: 4 },
  { id: 3, name: "Cold Coffee", price: 90, stock: 6 },
  { id: 4, name: "Brownie", price: 60, stock: 8 }
];

function CartProvider({ children }) {
  const [products] = useState(initialProducts);
  const [cart, setCart] = useState([]);

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

  const change = (id, amount) => {
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
      value={{ products, cart, add, change, remove, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  return useContext(CartContext);
}

function ProductList() {
  const { products, add } = useCart();

  return (
    <section>
      <h2 className="text-xl font-bold mb-3">Menu</h2>

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
    </section>
  );
}

function Cart() {
  const { cart, change, remove, subtotal } = useCart();

  return (
    <section className="bg-white p-5 rounded-xl shadow mt-8">

      <h2 className="text-xl font-bold mb-3">Your Cart</h2>

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
          Campus Cafe
        </h1>

        <ProductList />
        <Cart />

      </main>
    </CartProvider>
  );
}
