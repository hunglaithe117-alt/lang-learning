import { Link } from 'react-router';
import { Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header(): React.ReactElement {
    return (
        <header className="flex items-center justify-between h-16 px-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-50">
            <Link to="/" className="flex items-center gap-2 text-[var(--color-foreground)] no-underline hover:no-underline">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-lg">
                    📚
                </span>
                <span className="text-xl font-bold tracking-tight">LangLearn</span>
            </Link>

            <div className="flex items-center gap-3">
                <Button size="default">
                    <Plus className="w-4 h-4" />
                    Create notebook
                </Button>
                <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                </Button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
                    H
                </div>
            </div>
        </header>
    );
}
