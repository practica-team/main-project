import { postApi, type IPost } from "@entities/post";
import { useAuth } from "@features/auth";
import { useCallback, useEffect, useReducer, useRef } from "react";

type State = {
    posts: IPost[];
    isLoading: boolean;
    error: string | null;
};

type Action = 
    | { type: 'FETCH_START'; }
    | { type: 'FETCH_SUCCESS'; payload: IPost[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'RESET'; }
    | { type: 'ADD_POST'; payload: IPost }
    | { type: 'REMOVE_POST'; payload: string };


const postsReducer = (state: State, action: Action): State => {
    switch(action.type){
        case 'FETCH_START':
            return {...state, isLoading: true, error: null};
        case 'FETCH_SUCCESS':
            return {...state, isLoading: false, posts: action.payload};
        case 'FETCH_ERROR':
            return {...state, isLoading: false, error: action.payload};
        case 'RESET':
            return {posts: [], isLoading: false, error: null};
        case 'ADD_POST':
            return {...state, posts: [action.payload, ...state.posts]};
        case 'REMOVE_POST':
            return {...state, posts: state.posts.filter((p) => p.id !== action.payload)};
        default:
            return state;
    }
};



export const usePosts = () => {
    const { user } = useAuth();
    const [ state, dispatch ] = useReducer(postsReducer, {
        posts: [],
        isLoading: true,
        error: null,
    });

    const isCancellRef = useRef(false);

    const fetchPosts = useCallback(async () => {
        isCancellRef.current = false;

        dispatch({ type: 'FETCH_START' });

        try{
            const response = await postApi.getPosts();
            if(!isCancellRef.current){
                dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
            }
        } catch (err) {
            if(!isCancellRef.current){
                const message = err instanceof Error ? err.message: 'Неизвестная ошибка!';
                dispatch({ type: 'FETCH_ERROR', payload: `Не удалось загрузить посты: ${message}` });
            }
        } finally {
            if(isCancellRef) {
                dispatch({ type: 'FETCH_ERROR', payload: 'Запрос о постах отменён!' });
            }
        }
    }, []);


    useEffect(() => {
        return () => {
            isCancellRef.current = true;
        };
    }, []);


    useEffect(() => {
        if(user) {
            fetchPosts();
        } else {
            dispatch({ type: 'RESET' });
        }
    }, [user, fetchPosts]);


    const addPost = useCallback((newPost: IPost) => {
        dispatch({ type: 'ADD_POST', payload: newPost });
    }, []);

    const removePost = useCallback((postId: string) => {
        dispatch({ type: 'REMOVE_POST', payload: postId });
    }, []);


    return {
        posts: state.posts,
        isLoading: state.isLoading,
        error: state.error,
        refetch: fetchPosts,
        addPost,
        removePost,
    };
};
    