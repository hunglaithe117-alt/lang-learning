import { useNavigate } from 'react-router';
import { LayoutGrid, List, Plus, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { useAppSelector, useAppDispatch } from '@/store';
import { setFilter } from '@/store/notebooksSlice';
import { setViewMode } from '@/store/uiSlice';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const FILTERS = [
    { key: 'all' as const, label: 'All' },
    { key: 'english' as const, label: '🇬🇧 English' },
    { key: 'chinese' as const, label: '🇨🇳 Chinese' },
];

export function HomePage(): React.ReactElement {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const notebooks = useAppSelector((s) => s.notebooks.items);
    const activeFilter = useAppSelector((s) => s.notebooks.activeFilter);
    const viewMode = useAppSelector((s) => s.ui.viewMode);

    const filtered = notebooks.filter((nb) => {
        if (activeFilter === 'all') return true;
        return nb.language.toLowerCase() === activeFilter;
    });

    return (
        <div className="max-w-[1100px] mx-auto px-6 py-8 w-full">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-8">
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => dispatch(setFilter(f.key))}
                        className={cn(
                            'px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer',
                            activeFilter === f.key
                                ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary-light)] border-[var(--color-primary)]'
                                : 'bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:bg-white/5 hover:text-[var(--color-foreground)]',
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">My notebooks</h2>
                <div className="flex items-center gap-3">
                    <div className="flex border border-[var(--color-border)] rounded-lg overflow-hidden">
                        <button
                            onClick={() => dispatch(setViewMode('grid'))}
                            className={cn(
                                'p-2 transition-all cursor-pointer',
                                viewMode === 'grid'
                                    ? 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)]'
                                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => dispatch(setViewMode('list'))}
                            className={cn(
                                'p-2 transition-all cursor-pointer',
                                viewMode === 'list'
                                    ? 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)]'
                                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <select className="px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-muted)] cursor-pointer">
                        <option>Most recent</option>
                        <option>Alphabetical</option>
                    </select>
                </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-[var(--color-muted-foreground)] opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No notebooks yet</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)] mb-6">
                        Upload your learning documents and start studying
                    </p>
                    <Button><Plus className="w-4 h-4" /> Create notebook</Button>
                </div>
            ) : viewMode === 'list' ? (
                /* List View */
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {['Title', 'Sources', 'Language', 'Created', 'Role'].map((h) => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider border-b border-[var(--color-border)]">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((nb) => (
                            <tr
                                key={nb.id}
                                onClick={() => navigate(`/notebook/${nb.id}`)}
                                className="cursor-pointer transition-colors hover:bg-white/3 border-b border-[var(--color-border)]"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="w-9 h-9 rounded-md bg-[var(--color-surface-elevated)] flex items-center justify-center text-lg flex-shrink-0">
                                            {nb.icon}
                                        </span>
                                        <span className="text-sm font-medium">{nb.title}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-[var(--color-muted)]">{nb.sourcesCount} Sources</td>
                                <td className="px-4 py-3 text-sm text-[var(--color-muted)]">{nb.language}</td>
                                <td className="px-4 py-3 text-sm text-[var(--color-muted)]">{format(new Date(nb.createdAt), 'MMM d, yyyy')}</td>
                                <td className="px-4 py-3">
                                    <span className="text-xs px-2 py-1 rounded bg-[var(--color-surface-elevated)] text-[var(--color-muted)]">Owner</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                    {filtered.map((nb) => (
                        <Card
                            key={nb.id}
                            className="cursor-pointer transition-all hover:border-[var(--color-border-hover)] hover:-translate-y-0.5 hover:shadow-lg"
                            onClick={() => navigate(`/notebook/${nb.id}`)}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <span className="w-11 h-11 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center text-xl">
                                        {nb.icon}
                                    </span>
                                    <CardTitle>{nb.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-4">{nb.description}</CardDescription>
                                <div className="flex items-center justify-between text-xs text-[var(--color-muted-foreground)]">
                                    <span>📄 {nb.sourcesCount} sources</span>
                                    <span>{format(new Date(nb.createdAt), 'MMM d, yyyy')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
