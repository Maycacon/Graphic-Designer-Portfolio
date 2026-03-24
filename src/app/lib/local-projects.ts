const STORAGE_KEY = 'admin_projects_v1';

export function loadLocalProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    return [];
  }
}

export function saveLocalProjects(projects: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    // ignore
  }
}

export function clearLocalProjects() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

export default { loadLocalProjects, saveLocalProjects, clearLocalProjects };
