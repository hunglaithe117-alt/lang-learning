import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Flashcard {
    id: string;
    front: string;
    back: string;
    easeFactor: number;
    interval: number;
    repetitions: number;
}

// Mock data — will be replaced with GraphQL
const MOCK_CARDS: Flashcard[] = [
    { id: '1', front: 'Negotiate', back: 'Đàm phán / 谈判 (tán pàn)\n\nExample: We need to negotiate the contract terms.', easeFactor: 2.5, interval: 0, repetitions: 0 },
    { id: '2', front: 'Deadline', back: 'Hạn chót / 截止日期 (jié zhǐ rì qī)\n\nExample: The deadline for this project is next Friday.', easeFactor: 2.5, interval: 0, repetitions: 0 },
    { id: '3', front: 'Revenue', back: 'Doanh thu / 收入 (shōu rù)\n\nExample: The company reported record revenue this quarter.', easeFactor: 2.5, interval: 0, repetitions: 0 },
    { id: '4', front: '会议 (huì yì)', back: 'Meeting / Cuộc họp\n\nExample: 明天有一个重要的会议。', easeFactor: 2.5, interval: 0, repetitions: 0 },
    { id: '5', front: 'Collaborate', back: 'Hợp tác / 合作 (hé zuò)\n\nExample: Let\'s collaborate on this presentation.', easeFactor: 2.5, interval: 0, repetitions: 0 },
];

const QUALITY_LABELS = [
    { value: 0, label: 'Again', color: 'bg-red-500/80', desc: 'Forgot completely' },
    { value: 1, label: 'Hard', color: 'bg-orange-500/80', desc: 'Barely remembered' },
    { value: 3, label: 'Good', color: 'bg-blue-500/80', desc: 'Recalled with effort' },
    { value: 5, label: 'Easy', color: 'bg-emerald-500/80', desc: 'Effortless recall' },
];

export function FlashcardsPage(): React.ReactElement {
    const [cards] = useState(MOCK_CARDS);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [reviewed, setReviewed] = useState<Set<string>>(new Set());

    const currentCard = cards[currentIndex];
    const progress = useMemo(() => ({
        total: cards.length,
        done: reviewed.size,
        remaining: cards.length - reviewed.size,
    }), [cards.length, reviewed.size]);

    const handleFlip = useCallback(() => setIsFlipped((f) => !f), []);

    const handleRate = useCallback((quality: number) => {
        setReviewed((prev) => new Set(prev).add(currentCard.id));
        setIsFlipped(false);

        // Move to next card after short delay
        setTimeout(() => {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex((i) => i + 1);
            }
        }, 300);
    }, [currentCard, currentIndex, cards.length]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setCurrentIndex((i) => i - 1);
        }
    }, [currentIndex]);

    const handleNext = useCallback(() => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setCurrentIndex((i) => i + 1);
        }
    }, [currentIndex, cards.length]);

    const isComplete = progress.done === progress.total;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-lg font-semibold">Flashcard Review</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-[var(--color-muted)]">
                        {progress.done}/{progress.total} reviewed
                    </span>
                    <div className="w-32 h-2 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                            style={{ width: `${(progress.done / progress.total) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Card Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                {isComplete ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
                        <p className="text-[var(--color-muted)] mb-6">
                            You reviewed all {progress.total} cards
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => { setCurrentIndex(0); setReviewed(new Set()); setIsFlipped(false); }}>
                                <RotateCcw className="w-4 h-4" /> Review Again
                            </Button>
                            <Link to="/"><Button>Back to Notebooks</Button></Link>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Flashcard */}
                        <div className="perspective-1000 w-full max-w-lg cursor-pointer mb-8" onClick={handleFlip}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${currentCard.id}-${isFlipped}`}
                                    initial={{ rotateY: 90, opacity: 0 }}
                                    animate={{ rotateY: 0, opacity: 1 }}
                                    exit={{ rotateY: -90, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn(
                                        'relative min-h-64 rounded-2xl p-8 flex flex-col items-center justify-center text-center',
                                        'border border-[var(--color-border)] shadow-lg',
                                        isFlipped
                                            ? 'bg-gradient-to-br from-[var(--color-primary-subtle)] to-[var(--color-surface)]'
                                            : 'bg-[var(--color-surface)]',
                                    )}
                                >
                                    <span className="absolute top-4 right-4 text-xs text-[var(--color-muted-foreground)]">
                                        {isFlipped ? 'ANSWER' : 'QUESTION'}
                                    </span>
                                    <div className={cn(
                                        'text-xl font-semibold leading-relaxed whitespace-pre-line',
                                        isFlipped && 'text-lg font-normal',
                                    )}>
                                        {isFlipped ? currentCard.back : currentCard.front}
                                    </div>
                                    {!isFlipped && (
                                        <p className="text-xs text-[var(--color-muted-foreground)] mt-4">
                                            Click to reveal answer
                                        </p>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center gap-4 mb-6">
                            <Button variant="ghost" size="icon" onClick={handlePrev} disabled={currentIndex === 0}>
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <span className="text-sm text-[var(--color-muted)] min-w-16 text-center">
                                {currentIndex + 1} / {cards.length}
                            </span>
                            <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentIndex === cards.length - 1}>
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Quality Rating (only after flip) */}
                        {isFlipped && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex gap-3"
                            >
                                {QUALITY_LABELS.map((q) => (
                                    <button
                                        key={q.value}
                                        onClick={() => handleRate(q.value)}
                                        className={cn(
                                            'flex flex-col items-center gap-1 px-5 py-3 rounded-xl transition-all cursor-pointer',
                                            q.color, 'text-white hover:scale-105 hover:shadow-lg',
                                        )}
                                    >
                                        <span className="text-sm font-semibold">{q.label}</span>
                                        <span className="text-[10px] opacity-80">{q.desc}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
