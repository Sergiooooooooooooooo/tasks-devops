export const MAX_TITLE = 120;

// Limpia el título: quita espacios sobrantes. Devuelve null si no es válido.
export function cleanTitle(raw) {
  if (typeof raw !== "string") return null;
  const title = raw.trim().replace(/\s+/g, " ");
  if (title.length === 0 || title.length > MAX_TITLE) return null;
  return title;
}

// Pendientes primero; dentro de cada grupo, la más reciente arriba.
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (b.createdAt ?? 0) - (a.createdAt ?? 0);
  });
}

export function countPending(tasks) {
  return tasks.filter((t) => !t.done).length;
}
