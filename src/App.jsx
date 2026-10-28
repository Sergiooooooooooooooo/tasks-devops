import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where,
} from "firebase/firestore";
import { auth, db, APP_ENV } from "./firebase";
import { cleanTitle, countPending, sortTasks, MAX_TITLE } from "./lib/tasks";

export default function App() {
  const [uid, setUid] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // Sesión anónima: cada visitante ve solo sus tareas.
  useEffect(() => {
    const stop = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else signInAnonymously(auth).catch(() => setError("No se pudo iniciar la sesión. Revisa la configuración de Firebase."));
    });
    return stop;
  }, []);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "tasks"), where("userId", "==", uid));
    return onSnapshot(
      q,
      (snap) => setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => setError("No se pudieron leer las tareas. Revisa las reglas de Firestore."),
    );
  }, [uid]);

  async function add(e) {
    e.preventDefault();
    const title = cleanTitle(text);
    if (!title) {
      setError(`Escribe una tarea de máximo ${MAX_TITLE} caracteres.`);
      return;
    }
    setError("");
    await addDoc(collection(db, "tasks"), { title, done: false, userId: uid, createdAt: Date.now() });
    setText("");
  }

  const toggle = (t) => updateDoc(doc(db, "tasks", t.id), { done: !t.done });
  const remove = (t) => deleteDoc(doc(db, "tasks", t.id));
  const pending = countPending(tasks);

  return (
    <div className="page" data-env={APP_ENV}>
      <div className="envband" role="status">
        Ambiente {APP_ENV}
      </div>
      <main>
        <h1>Tareas</h1>
        <p className="count">
          {tasks.length === 0
            ? "Aún no tienes tareas."
            : pending === 0
              ? "Todo listo, no queda nada pendiente."
              : `${pending} ${pending === 1 ? "pendiente" : "pendientes"} de ${tasks.length}`}
        </p>

        <form onSubmit={add}>
          <label htmlFor="nueva">Nueva tarea</label>
          <div className="row">
            <input
              id="nueva"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ej.: Preparar la demo de QA"
              autoComplete="off"
            />
            <button type="submit" disabled={!uid}>Agregar tarea</button>
          </div>
        </form>
        {error && <p className="error" role="alert">{error}</p>}

        <ul>
          {sortTasks(tasks).map((t) => (
            <li key={t.id} className={t.done ? "done" : ""}>
              <label>
                <input type="checkbox" checked={t.done} onChange={() => toggle(t)} />
                <span>{t.title}</span>
              </label>
              <button className="link" onClick={() => remove(t)} aria-label={`Eliminar ${t.title}`}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
