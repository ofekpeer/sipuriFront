import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomeLayout from './layouts/HomeLayout';
import CreateBookLayout from './layouts/CreateBookLayout';
import BookViewer from './pages/bookViewer/BookViewer';
import Home from './pages/home/Home';
import CreateBook from './pages/createBook/CreateBook';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<CreateBookLayout />}>
          <Route path="/create-book" element={<CreateBook />} />
        </Route>
        <Route path="/book/:id" element={<BookViewer />} />{' '}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
