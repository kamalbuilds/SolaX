import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext(null);

const initialState = {
    loading: true,
    token: '',
};

function reducer(state, action) {
    switch (action.type) {
        case 'login': {
            return { ...state, token: action.token }
        }
        case 'logout': {
            return { ...state, token: '' };
        }
        case 'currentState': {
            return state;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function AuthProvider({ children }) {
    return (
        <AuthContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}