import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { store } from '@/store';
import { apolloClient } from '@/lib/apollo';
import { Header } from '@/components/layout/Header';
import { HomePage } from '@/pages/HomePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotebookDetailPage } from '@/pages/NotebookDetailPage';
import { FlashcardsPage } from '@/pages/FlashcardsPage';
import { ExercisesPage } from '@/pages/ExercisesPage';

export function App(): React.ReactElement {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/notebook/:id" element={<NotebookDetailPage />} />
                <Route path="/flashcards" element={<FlashcardsPage />} />
                <Route path="/exercises" element={<ExercisesPage />} />
              </Routes>
            </main>
          </div>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-foreground)',
              },
            }}
          />
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  );
}
