import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Exercise {
    id: string;
    type: 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK' | 'TRANSLATION';
    question: string;
    options?: string[];
    answer: string;
    explanation?: string;
    difficulty: string;
}

const MOCK_EXERCISES: Exercise[] = [
    {
        id: '1', type: 'MULTIPLE_CHOICE', difficulty: 'BEGINNER',
        question: 'What does "negotiate" mean?',
        options: ['Từ chối', 'Đàm phán', 'Đồng ý', 'Phản đối'],
        answer: 'Đàm phán',
        explanation: '"Negotiate" means to discuss something in order to reach an agreement.',
    },
    {
        id: '2', type: 'FILL_IN_BLANK', difficulty: 'INTERMEDIATE',
        question: 'The project _____ is next Friday. (hạn chót)',
        answer: 'deadline',
        explanation: '"Deadline" means the latest time or date by which something should be completed.',
    },
    {
        id: '3', type: 'TRANSLATION', difficulty: 'BEGINNER',
        question: 'Translate to English: 明天有一个重要的会议',
        answer: 'There is an important meeting tomorrow',
        explanation: '会议 (huì yì) = meeting, 重要 (zhòng yào) = important',
    },
    {
        id: '4', type: 'MULTIPLE_CHOICE', difficulty: 'INTERMEDIATE',
        question: 'Choose the correct translation of "revenue"',
        options: ['Chi phí', 'Lợi nhuận', 'Doanh thu', 'Thuế'],
        answer: 'Doanh thu',
        explanation: '"Revenue" = total income, while "profit" = income after expenses.',
    },
    {
        id: '5', type: 'FILL_IN_BLANK', difficulty: 'ADVANCED',
        question: 'Let\'s _____ on this presentation together. (hợp tác)',
        answer: 'collaborate',
        explanation: '"Collaborate" = work jointly on an activity or project.',
    },
];

interface AnswerResult {
    exerciseId: string;
    userAnswer: string;
    isCorrect: boolean;
}

export function ExercisesPage(): React.ReactElement {
    const [exercises] = useState(MOCK_EXERCISES);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [results, setResults] = useState<AnswerResult[]>([]);

    const current = exercises[currentIndex];
    const isComplete = currentIndex >= exercises.length;

    const score = useMemo(() => {
        const correct = results.filter((r) => r.isCorrect).length;
        return { correct, total: results.length, pct: results.length > 0 ? Math.round((correct / results.length) * 100) : 0 };
    }, [results]);

    const checkAnswer = useCallback(() => {
        const isCorrect = userAnswer.toLowerCase().trim() === current.answer.toLowerCase().trim();
        setResults((prev) => [...prev, { exerciseId: current.id, userAnswer, isCorrect }]);
        setShowResult(true);
    }, [userAnswer, current]);

    const handleNext = useCallback(() => {
        setShowResult(false);
        setUserAnswer('');
        setCurrentIndex((i) => i + 1);
    }, []);

    const handleSelectOption = useCallback((option: string) => {
        setUserAnswer(option);
        const isCorrect = option.toLowerCase().trim() === current.answer.toLowerCase().trim();
        setResults((prev) => [...prev, { exerciseId: current.id, userAnswer: option, isCorrect }]);
        setShowResult(true);
    }, [current]);

    const lastResult = results[results.length - 1];

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-8">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
                    <div className="text-6xl mb-4">{score.pct >= 80 ? '🏆' : score.pct >= 50 ? '👍' : '💪'}</div>
                    <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
                    <p className="text-4xl font-bold text-[var(--color-primary)] mb-2">{score.pct}%</p>
                    <p className="text-[var(--color-muted)] mb-6">{score.correct}/{score.total} correct answers</p>
                    <div className="flex gap-3 justify-center">
                        <Link to="/"><Button variant="outline">Back to Home</Button></Link>
                        <Button onClick={() => { setCurrentIndex(0); setResults([]); setUserAnswer(''); setShowResult(false); }}>Try Again</Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-lg font-semibold">Practice Quiz</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-[var(--color-muted)]">{currentIndex + 1}/{exercises.length}</span>
                    <div className="w-32 h-2 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500" style={{ width: `${((currentIndex) / exercises.length) * 100}%` }} />
                    </div>
                </div>
            </div>

            {/* Exercise Area */}
            <div className="flex-1 flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        className="w-full max-w-2xl"
                    >
                        {/* Badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className={cn(
                                'text-xs px-2 py-1 rounded-full font-medium',
                                current.type === 'MULTIPLE_CHOICE' ? 'bg-blue-500/20 text-blue-400' :
                                    current.type === 'FILL_IN_BLANK' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-purple-500/20 text-purple-400',
                            )}>
                                {current.type === 'MULTIPLE_CHOICE' ? 'Multiple Choice' :
                                    current.type === 'FILL_IN_BLANK' ? 'Fill in the Blank' : 'Translation'}
                            </span>
                            <span className="text-xs text-[var(--color-muted-foreground)]">{current.difficulty}</span>
                        </div>

                        {/* Question */}
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 mb-6">
                            <h2 className="text-xl font-semibold leading-relaxed">{current.question}</h2>
                        </div>

                        {/* Answer Area */}
                        {current.type === 'MULTIPLE_CHOICE' && current.options ? (
                            <div className="grid grid-cols-2 gap-3">
                                {current.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => !showResult && handleSelectOption(opt)}
                                        disabled={showResult}
                                        className={cn(
                                            'p-4 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer',
                                            showResult && opt === current.answer
                                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                                : showResult && opt === userAnswer && opt !== current.answer
                                                    ? 'bg-red-500/20 border-red-500 text-red-400'
                                                    : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]',
                                            showResult && 'cursor-default',
                                        )}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <input
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !showResult && userAnswer.trim() && checkAnswer()}
                                    placeholder="Type your answer..."
                                    disabled={showResult}
                                    className="flex-1 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                />
                                {!showResult && (
                                    <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>Check</Button>
                                )}
                            </div>
                        )}

                        {/* Result */}
                        {showResult && lastResult && (
                            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-6">
                                <div className={cn(
                                    'flex items-start gap-3 p-4 rounded-xl',
                                    lastResult.isCorrect ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30',
                                )}>
                                    {lastResult.isCorrect ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <p className={cn('text-sm font-semibold', lastResult.isCorrect ? 'text-emerald-400' : 'text-red-400')}>
                                            {lastResult.isCorrect ? 'Correct!' : `Incorrect — Answer: ${current.answer}`}
                                        </p>
                                        {current.explanation && (
                                            <p className="text-xs text-[var(--color-muted)] mt-1">{current.explanation}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button onClick={handleNext}>
                                        Next <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
