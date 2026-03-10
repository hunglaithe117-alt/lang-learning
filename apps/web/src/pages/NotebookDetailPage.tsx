import { useState, useCallback } from 'react';
import { Link } from 'react-router';
import {
    PanelLeftClose, PanelRightClose, PanelLeft, PanelRight,
    Send, ArrowLeft, Plus, Copy, ThumbsUp, ThumbsDown, Sparkles,
    FileText,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addMessage, toggleSource, toggleAllSources } from '@/store/chatSlice';
import { toggleSourcesPanel, toggleStudioPanel } from '@/store/uiSlice';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
    'Extract vocabulary from document',
    'Create flashcards',
    'Generate practice exercises',
    'Explain the grammar patterns',
    'Summarize in Vietnamese',
];

const STUDIO_ITEMS = [
    { id: '1', title: 'Vocabulary List', type: 'Vocab', icon: '🔤', meta: '24 words' },
    { id: '2', title: 'Flashcard Set', type: 'Flashcards', icon: '🃏', meta: '15 cards' },
    { id: '3', title: 'Practice Quiz', type: 'Exercise', icon: '✏️', meta: '10 questions' },
];

export function NotebookDetailPage(): React.ReactElement {
    const dispatch = useAppDispatch();
    const messages = useAppSelector((s) => s.chat.messages);
    const sources = useAppSelector((s) => s.chat.sources);
    const isSourcesOpen = useAppSelector((s) => s.ui.isSourcesPanelOpen);
    const isStudioOpen = useAppSelector((s) => s.ui.isStudioPanelOpen);

    const [input, setInput] = useState('');
    const selectedCount = sources.filter((s) => s.isSelected).length;
    const allSelected = sources.every((s) => s.isSelected);

    const handleSend = useCallback(() => {
        if (!input.trim()) return;

        dispatch(addMessage({
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
        }));
        setInput('');

        // Mock response
        setTimeout(() => {
            dispatch(addMessage({
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I'll help you with "${input}". Let me search through your ${selectedCount} source(s)...`,
                timestamp: Date.now(),
            }));
        }, 800);
    }, [input, selectedCount, dispatch]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend],
    );

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* ---- Sources Panel ---- */}
            <div className={cn(
                'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl m-1 flex flex-col transition-all duration-300 overflow-hidden',
                isSourcesOpen ? 'w-72 min-w-72' : 'w-0 min-w-0 p-0 border-0 m-0 opacity-0',
            )}>
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] shrink-0">
                    <span className="text-sm font-semibold">Sources</span>
                    <button
                        onClick={() => dispatch(toggleSourcesPanel())}
                        className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] p-1 rounded cursor-pointer transition-colors"
                    >
                        <PanelLeftClose className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                    <label className="flex items-center gap-2 py-2 px-1 text-sm text-[var(--color-muted)] border-b border-[var(--color-border)] mb-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() => dispatch(toggleAllSources())}
                            className="accent-[var(--color-primary)]"
                        />
                        Select all sources
                    </label>

                    {sources.map((source) => (
                        <div
                            key={source.id}
                            onClick={() => dispatch(toggleSource(source.id))}
                            className="flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors hover:bg-white/5"
                        >
                            <FileText className="w-4 h-4 text-[var(--color-muted)] shrink-0" />
                            <span className="text-sm truncate flex-1">{source.name}</span>
                            <input
                                type="checkbox"
                                checked={source.isSelected}
                                onChange={() => dispatch(toggleSource(source.id))}
                                className="accent-[var(--color-primary)]"
                            />
                        </div>
                    ))}

                    <button className="flex items-center justify-center gap-2 w-full p-3 mt-3 border-2 border-dashed border-[var(--color-border)] rounded-lg text-sm text-[var(--color-muted-foreground)] cursor-pointer transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary-light)] hover:bg-[var(--color-primary-subtle)]">
                        <Plus className="w-4 h-4" /> Add source
                    </button>
                </div>
            </div>

            {/* Collapsed Sources Toggle */}
            {!isSourcesOpen && (
                <button
                    onClick={() => dispatch(toggleSourcesPanel())}
                    className="self-start m-2 p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] cursor-pointer transition-colors"
                >
                    <PanelLeft className="w-4 h-4" />
                </button>
            )}

            {/* ---- Chat Panel ---- */}
            <div className="flex-1 min-w-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl m-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] shrink-0">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <span className="text-sm font-semibold">Chat</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-16 px-6">
                            <div className="text-5xl mb-4">📚</div>
                            <h2 className="text-2xl font-bold mb-2">Welcome to your notebook</h2>
                            <p className="text-sm text-[var(--color-muted-foreground)] max-w-md mx-auto mb-6 leading-relaxed">
                                Ask questions about your documents, extract vocabulary,
                                create flashcards, or generate exercises for practice.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setInput(s)}
                                        className="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-full text-sm text-[var(--color-muted)] cursor-pointer transition-all hover:bg-[var(--color-primary-subtle)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-light)]"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    'max-w-[80%] animate-in fade-in slide-in-from-bottom-2',
                                    msg.role === 'user' ? 'self-end' : 'self-start',
                                )}
                            >
                                <div className={cn(
                                    'px-4 py-3 rounded-2xl text-sm leading-relaxed',
                                    msg.role === 'user'
                                        ? 'bg-[var(--color-primary)] text-white rounded-br-sm'
                                        : 'bg-[var(--color-surface-elevated)] rounded-bl-sm',
                                )}>
                                    {msg.content}
                                </div>
                                {msg.role === 'assistant' && (
                                    <div className="flex gap-2 mt-1 px-2">
                                        <button className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] p-1 cursor-pointer"><Copy className="w-3 h-3" /></button>
                                        <button className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] p-1 cursor-pointer"><ThumbsUp className="w-3 h-3" /></button>
                                        <button className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] p-1 cursor-pointer"><ThumbsDown className="w-3 h-3" /></button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t border-[var(--color-border)] shrink-0">
                    <div className="flex items-center gap-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl px-3 py-2 focus-within:border-[var(--color-primary)] transition-colors">
                        <input
                            className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] font-[var(--font-sans)]"
                            placeholder="Start typing..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <span className="text-xs text-[var(--color-muted-foreground)] whitespace-nowrap">
                            {selectedCount} sources
                        </span>
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="w-8 h-8 rounded-full"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Collapsed Studio Toggle */}
            {!isStudioOpen && (
                <button
                    onClick={() => dispatch(toggleStudioPanel())}
                    className="self-start m-2 p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] cursor-pointer transition-colors"
                >
                    <PanelRight className="w-4 h-4" />
                </button>
            )}

            {/* ---- Studio Panel ---- */}
            <div className={cn(
                'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl m-1 flex flex-col transition-all duration-300 overflow-hidden',
                isStudioOpen ? 'w-[300px] min-w-[300px]' : 'w-0 min-w-0 p-0 border-0 m-0 opacity-0',
            )}>
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] shrink-0">
                    <span className="text-sm font-semibold">Studio</span>
                    <button
                        onClick={() => dispatch(toggleStudioPanel())}
                        className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] p-1 rounded cursor-pointer transition-colors"
                    >
                        <PanelRightClose className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                    <div className="bg-gradient-to-br from-[var(--color-primary-subtle)] to-purple-900/10 rounded-lg p-3 mb-3 text-xs text-[var(--color-primary-light)] leading-relaxed">
                        🎓 Generate learning materials from your uploaded documents — vocabulary, flashcards, exercises, and more!
                    </div>

                    {STUDIO_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
                        >
                            <span className="w-9 h-9 rounded-md bg-[var(--color-surface-elevated)] flex items-center justify-center text-base shrink-0">
                                {item.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{item.title}</div>
                                <div className="text-xs text-[var(--color-muted-foreground)]">{item.type} · {item.meta}</div>
                            </div>
                        </div>
                    ))}

                    <Button variant="outline" className="w-full mt-2 rounded-lg">
                        <Sparkles className="w-4 h-4" /> Generate new material
                    </Button>
                </div>
            </div>
        </div>
    );
}
