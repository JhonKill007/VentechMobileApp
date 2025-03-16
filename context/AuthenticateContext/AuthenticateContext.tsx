

import React, { createContext, useReducer } from 'react';
import { AuthenticateReducer } from './AuthenticateReducer';

interface typeAuthenticateContext {
    Authenticate: boolean;
    setAuthenticate: (state: boolean) => void;
};

export const AuthenticateContext = createContext<typeAuthenticateContext | undefined>(undefined);

export const AuthenticateProvider = ({ children }: any) => {
    const [Authenticate, setAuthenticateDispatch] = useReducer(AuthenticateReducer, false)

    const setAuthenticate = (state: boolean) => {
        state ? setAuthenticateDispatch({ type: 'set_true' }) : setAuthenticateDispatch({ type: 'set_false' })   
    }

    return (
        <AuthenticateContext.Provider value={{ Authenticate, setAuthenticate }}>
            {children}
        </AuthenticateContext.Provider>
    );
};