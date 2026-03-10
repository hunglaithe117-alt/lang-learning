import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import notebooksReducer from './notebooksSlice';
import chatReducer from './chatSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
    reducer: {
        notebooks: notebooksReducer,
        chat: chatReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
