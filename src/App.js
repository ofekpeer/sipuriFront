import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomeLayout from './layouts/HomeLayout';
import CreateBookLayout from './layouts/CreateBookLayout';

import Home from './pages/home/Home';
import CreateBook from './pages/createBook/CreateBook';
import BookViewer from './pages/bookViewer/BookViewer';
import BookLoading from './pages/BookLoading/BookLoading';
import BookCheckout from './pages/BookCheckout/BookCheckout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthPage from './pages/Auth/AuthPage';
import Library from './pages/Library/Library';
import BookEditor from './pages/BookEditor/BookEditor';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<CreateBookLayout />}>
          <Route path="/create-book" element={<ProtectedRoute><CreateBook /></ProtectedRoute>} />
        </Route>

        <Route path="/book-loading" element={<BookLoading />} />

        <Route path="/book/:id/checkout" element={<ProtectedRoute><BookCheckout /></ProtectedRoute>} />
        <Route path="/book/:id" element={<BookViewer />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/library/book/:id/edit" element={<ProtectedRoute><BookEditor /></ProtectedRoute>} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
