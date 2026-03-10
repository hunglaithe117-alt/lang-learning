import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notebook {
    id: string;
    title: string;
    description?: string;
    language: 'ENGLISH' | 'CHINESE';
    icon: string;
    sourcesCount: number;
    createdAt: string;
}

interface NotebooksState {
    items: Notebook[];
    isLoading: boolean;
    activeFilter: 'all' | 'english' | 'chinese';
}

const initialState: NotebooksState = {
    items: [
        { id: '1', title: 'English Business Writing', description: 'Professional email and report writing', language: 'ENGLISH', icon: '📝', sourcesCount: 5, createdAt: '2026-03-10' },
        { id: '2', title: '中文日常会话', description: 'Daily Chinese conversation practice', language: 'CHINESE', icon: '🀄', sourcesCount: 3, createdAt: '2026-03-08' },
        { id: '3', title: 'IELTS Reading Practice', description: 'Academic reading passages and exercises', language: 'ENGLISH', icon: '📖', sourcesCount: 12, createdAt: '2026-03-05' },
        { id: '4', title: 'HSK4 Vocabulary', description: 'HSK Level 4 vocabulary and grammar', language: 'CHINESE', icon: '🏮', sourcesCount: 8, createdAt: '2026-03-01' },
    ],
    isLoading: false,
    activeFilter: 'all',
};

const notebooksSlice = createSlice({
    name: 'notebooks',
    initialState,
    reducers: {
        setFilter(state, action: PayloadAction<NotebooksState['activeFilter']>) {
            state.activeFilter = action.payload;
        },
        addNotebook(state, action: PayloadAction<Notebook>) {
            state.items.unshift(action.payload);
        },
        removeNotebook(state, action: PayloadAction<string>) {
            state.items = state.items.filter((n) => n.id !== action.payload);
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
    },
});

export const { setFilter, addNotebook, removeNotebook, setLoading } = notebooksSlice.actions;
export default notebooksSlice.reducer;
