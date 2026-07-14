import { useEffect, useReducer } from "react";
import { storage } from '@shared';
import { userApi, type IUser } from "@entities/user";

type State = {
    isAuthenticated: boolean;
    user: IUser | null;
    isLoading: boolean;
};

type Action =
    | {type: 'SET_LOADING'; payload: boolean;}
    | {type: 'SET_USER'; payload: IUser | null;}
    | {type: 'SET_AUTH'; payload: boolean;}
    | {type: 'RESET'};

const initialState: State = {
    isAuthenticated: false,
    user: null,
    isLoading: true,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_LOADING':
            return {...state, isLoading: action.payload};
        case 'SET_USER':
            return {...state, user: action.payload};
        case 'SET_AUTH':
            return {...state, isAuthenticated: action.payload};
        case 'RESET':
            return {...state, isAuthenticated: false, user: null, isLoading: false};
        default:
            return state;
    }
}

export const useCheckAuth = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const token = storage.getToken();
        if(!token){
            dispatch({type: 'SET_LOADING', payload: false});
            return;
        }

        (async () => {
            try {
                const response = await userApi.getMe();
                dispatch({type: 'SET_USER', payload: response.data});
                dispatch({type: 'SET_AUTH', payload: true});
            } catch (error) {
                console.log('auth check fail  ',error);
                storage.removeToken();
                dispatch({type: 'SET_USER', payload: null});
                dispatch({type: 'SET_AUTH', payload: false});
            } finally {
                dispatch({type: 'SET_LOADING', payload: false});
            }
        })();
    }, [dispatch]);


    useEffect(() => {
        const handleGlobalLogout = () => {
            dispatch({type: 'RESET'});
        };

        window.addEventListener('auth:logout', handleGlobalLogout);

        return () => {
            window.removeEventListener('auth:logout', handleGlobalLogout);
        };
    }, [dispatch]);


    const login = async (token: string) => {
        storage.setToken(token);
        dispatch({type: 'SET_LOADING', payload: true});
        try{
            const response = await userApi.getMe();
            dispatch({type: 'SET_USER', payload: response.data});
            dispatch({type: 'SET_AUTH', payload: true});
        } catch (error) {
            console.log('login failed  ', error);
            storage.removeToken();
            dispatch({type: 'SET_USER', payload: null});
            dispatch({type: 'SET_AUTH', payload: false});
        } finally {
            dispatch({type: 'SET_LOADING', payload: false});
        }
    };

    const logout = () => {
        storage.removeToken();
        dispatch({type: 'RESET'});
        window.dispatchEvent(new Event('auth:logout'));
    };

    

    return { 
        isAuthenticated: state.isAuthenticated, 
        isLoading: state.isLoading,
        user: state.user,
        login, 
        logout };
};