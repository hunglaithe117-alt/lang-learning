import { Link } from 'react-router';
import { BookOpen, Brain, GraduationCap, Target, TrendingUp, Clock, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const STATS = [
    { label: 'Notebooks', value: '4', icon: BookOpen, color: 'text-blue-400' },
    { label: 'Flashcards Due', value: '12', icon: Brain, color: 'text-amber-400' },
    { label: 'Exercises Done', value: '48', icon: Target, color: 'text-emerald-400' },
    { label: 'Study Streak', value: '5 days', icon: Zap, color: 'text-orange-400' },
];

const RECENT_ACTIVITY = [
    { id: '1', action: 'Reviewed 15 flashcards', notebook: 'English Business Writing', time: '2 hours ago', icon: '🃏' },
    { id: '2', action: 'Completed quiz (90%)', notebook: 'HSK4 Vocabulary', time: '5 hours ago', icon: '✏️' },
    { id: '3', action: 'Uploaded document', notebook: 'IELTS Reading Practice', time: '1 day ago', icon: '📄' },
    { id: '4', action: 'Extracted 24 vocab words', notebook: 'English Business Writing', time: '1 day ago', icon: '🔤' },
];

const QUICK_ACTIONS = [
    { label: 'Review Flashcards', desc: '12 cards due today', path: '/flashcards', icon: Brain, color: 'from-blue-600 to-indigo-600' },
    { label: 'Practice Quiz', desc: '5 new exercises', path: '/exercises', icon: GraduationCap, color: 'from-emerald-600 to-teal-600' },
];

export function DashboardPage(): React.ReactElement {
    return (
        <div className="max-w-[1100px] mx-auto px-6 py-8 w-full">
            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Welcome back! 👋</h1>
                <p className="text-[var(--color-muted)]">Continue your learning journey</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {STATS.map((stat) => (
                    <Card key={stat.label} className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-[var(--color-muted-foreground)] mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <stat.icon className={cn('w-8 h-8 opacity-60', stat.color)} />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions + Activity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="md:col-span-1 space-y-4">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                    {QUICK_ACTIONS.map((action) => (
                        <Link key={action.path} to={action.path} className="block no-underline">
                            <div className={cn(
                                'p-5 rounded-xl bg-gradient-to-br text-white transition-all hover:scale-[1.02] hover:shadow-lg',
                                action.color,
                            )}>
                                <action.icon className="w-8 h-8 mb-3 opacity-80" />
                                <h3 className="font-semibold mb-1">{action.label}</h3>
                                <p className="text-sm opacity-80">{action.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Recent Activity */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[var(--color-muted)]" />
                                Recent Activity
                            </CardTitle>
                            <Link to="/" className="text-xs text-[var(--color-primary-light)]">View all</Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {RECENT_ACTIVITY.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/3 transition-colors">
                                    <span className="text-lg">{item.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">{item.action}</p>
                                        <p className="text-xs text-[var(--color-muted-foreground)]">{item.notebook}</p>
                                    </div>
                                    <span className="text-xs text-[var(--color-muted-foreground)] whitespace-nowrap">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Progress */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[var(--color-muted)]" />
                        This Week
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-2 h-32">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                            const heights = [60, 80, 45, 90, 70, 30, 0];
                            const isToday = i === 4;
                            return (
                                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="w-full flex items-end justify-center h-24">
                                        <div
                                            className={cn(
                                                'w-full max-w-8 rounded-t-md transition-all',
                                                isToday ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-elevated)]',
                                                heights[i] === 0 && 'bg-[var(--color-border)]',
                                            )}
                                            style={{ height: `${Math.max(heights[i], 4)}%` }}
                                        />
                                    </div>
                                    <span className={cn('text-xs', isToday ? 'text-[var(--color-primary-light)] font-semibold' : 'text-[var(--color-muted-foreground)]')}>
                                        {day}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
