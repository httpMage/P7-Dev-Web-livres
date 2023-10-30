const API_URL = "https://api.codebyadrien.fr:1024";
export const API_ROUTES = {
  SIGN_UP: `${API_URL}/grimoire/auth/signup`,
  SIGN_IN: `${API_URL}/grimoire/auth/login`,
  BOOKS: `${API_URL}/grimoire/books`,
  BEST_RATED: `${API_URL}/grimoire/books/bestrating`,
};

export const APP_ROUTES = {
  SIGN_UP: "/Inscription",
  SIGN_IN: "/Connexion",
  ADD_BOOK: "/Ajouter",
  BOOK: "/livre/:id",
  UPDATE_BOOK: "livre/modifier/:id",
};
