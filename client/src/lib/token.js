const TOKEN_KEY = 'gift-of-change:token';

// localStorage can throw (private mode, blocked storage), so every access is guarded
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // The session will simply not survive a reload
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nothing to clear
  }
}
