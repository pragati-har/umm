
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const API = "http://localhost:5000/api/records";
const CATEGORY = "AppPreference";

const AppContext = createContext(null);

// CONTEXT PROVIDER
function AppProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [count, setCount] = useState(0);
  const [user, setUser] = useState("Student");

  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // LOAD PREFERENCES
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch(
          `${API}?category=${CATEGORY}`
        );

        if (!response.ok) {
          throw new Error("Could not load preferences");
        }

        const records = await response.json();

        if (records.length > 0) {
          const record = records[0];

          setRecordId(record._id);

          setTheme(record.details?.theme || "light");

          setCount(
            Number(record.details?.count || 0)
          );

          setUser(
            record.details?.user || "Student"
          );
        }

      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // SAVE PREFERENCES
  const savePreferences = async () => {
    const payload = {
      name: "Shared App Preferences",
      category: CATEGORY,
      details: {
        theme,
        count,
        user
      }
    };

    try {
      const response = await fetch(
        recordId ? `${API}/${recordId}` : API,
        {
          method: recordId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save");
      }

      setRecordId(data._id);

      setMessage("Preferences saved in MongoDB!");

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        count,
        setCount,
        user,
        setUser,
        savePreferences,
        loading,
        message
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// DASHBOARD
function Dashboard() {
  const {
    theme,
    setTheme,
    count,
    setCount,
    user,
    setUser,
    savePreferences,
    loading,
    message
  } = useContext(AppContext);

  const dark = theme === "dark";

  return (
    <main className={`min-h-screen p-8 ${
      dark
        ? "bg-slate-900 text-white"
        : "bg-slate-100 text-slate-900"
    }`}>

      <h1 className="text-3xl font-bold mb-4">
        Context API — Full Stack
      </h1>

      {loading ? (
        <p>Loading saved preferences...</p>
      ) : (

        <>

          <p className="mb-5">
            Welcome, {user}!
          </p>

          <div className="flex flex-wrap gap-3 mb-6">

            <button
              onClick={() =>
                setTheme(dark ? "light" : "dark")
              }
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

            <button
              onClick={savePreferences}
              className="bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save to MongoDB
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

          {message && (
            <p className="mt-4">{message}</p>
          )}

        </>
      )}

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
