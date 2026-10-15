import { createContext } from 'react';

// Sem um Provider acima, useContext(UsuarioContext) retorna null.
export const UsuarioContext = createContext(null);
