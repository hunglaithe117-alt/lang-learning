import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ViewMode = 'list' | 'grid';

interface UiState {
    viewMode: ViewMode;
    isSourcesPanelOpen: boolean;
    isStudioPanelOpen: boolean;
}

const initialState: UiState = {
    viewMode: 'list',
    isSourcesPanelOpen: true,
    isStudioPanelOpen: true,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setViewMode(state, action: PayloadAction<ViewMode>) {
            state.viewMode = action.payload;
        },
        toggleSourcesPanel(state) {
            state.isSourcesPanelOpen = !state.isSourcesPanelOpen;
        },
        toggleStudioPanel(state) {
            state.isStudioPanelOpen = !state.isStudioPanelOpen;
        },
    },
});

export const { setViewMode, toggleSourcesPanel, toggleStudioPanel } = uiSlice.actions;
export default uiSlice.reducer;
