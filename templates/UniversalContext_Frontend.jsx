
import React, {
  createContext,
  useContext,
  useState
} from "react";

// CREATE CONTEXT
const AppContext = createContext(null);

// CONTEXT PROVIDER
function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [count, setCount] = useState(0);
  const [user, setUser] = useState("Student");

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        count,
        setCount,
        user,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// CONSUMER COMPONENT
function Dashboard() {
  const {
    theme,
    setTheme,
    count,
    setCount,
    user,
    setUser
  } = useContext(AppContext);

  const dark = theme === "dark";

  return (
    <main className={`min-h-screen p-8 ${
      dark
        ? "bg-slate-900 text-white"
        : "bg-slate-100 text-slate-900"
    }`}>

      <h1 className="text-3xl font-bold mb-4">
        Context API Demo
      </h1>

      <p className="mb-5">
        Welcome, {user}!
      </p>

      <div className="flex flex-wrap gap-3 mb-6">

        <button
          onClick={() => setTheme(dark ? "light" : "dark")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Toggle Theme
        </button>

        <button
          onClick={() => setCount(count + 1)}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Increase Counter
        </button>

        <button
          onClick={() =>
            setUser(user === "Student" ? "Admin" : "Student")
          }
          className="bg-amber-500 text-white px-4 py-2 rounded"
        >
          Change User
        </button>

      </div>

      <section className={`rounded-xl p-5 ${
        dark ? "bg-slate-800" : "bg-white"
      }`}>

        <p>
          Shared counter: <b>{count}</b>
        </p>

        <p>
          Current theme: <b>{theme}</b>
        </p>

        <p>
          Current user: <b>{user}</b>
        </p>

      </section>

    </main>
  );
}

// MAIN APP
export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
