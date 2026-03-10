import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface Source {
    id: string;
    name: string;
    icon: string;
    isSelected: boolean;
}

interface ChatState {
    messages: ChatMessage[];
    sources: Source[];
    isStreaming: boolean;
    activeDocumentId: string | null;
}

const initialState: ChatState = {
    messages: [],
    sources: [
        { id: '1', name: 'Business_Email_Writing.pdf', icon: '📄', isSelected: true },
        { id: '2', name: 'Meeting_Vocabulary.docx', icon: '📝', isSelected: true },
        { id: '3', name: 'Presentation_Phrases.txt', icon: '📃', isSelected: true },
    ],
    isStreaming: false,
    activeDocumentId: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage(state, action: PayloadAction<ChatMessage>) {
            state.messages.push(action.payload);
        },
        clearMessages(state) {
            state.messages = [];
        },
        toggleSource(state, action: PayloadAction<string>) {
            const source = state.sources.find((s) => s.id === action.payload);
            if (source) source.isSelected = !source.isSelected;
        },
        toggleAllSources(state) {
            const allSelected = state.sources.every((s) => s.isSelected);
            state.sources.forEach((s) => (s.isSelected = !allSelected));
        },
        setStreaming(state, action: PayloadAction<boolean>) {
            state.isStreaming = action.payload;
        },
        setActiveDocument(state, action: PayloadAction<string | null>) {
            state.activeDocumentId = action.payload;
        },
        addSource(state, action: PayloadAction<Source>) {
            state.sources.push(action.payload);
        },
    },
});

export const {
    addMessage, clearMessages, toggleSource,
    toggleAllSources, setStreaming, setActiveDocument, addSource,
} = chatSlice.actions;
export default chatSlice.reducer;
