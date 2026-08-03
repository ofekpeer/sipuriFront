import {
  getBookPreviewImageUrls,
  getBookRenderFingerprint,
  hasRenderableBookPreview,
  isBookStillEnhancing,
} from './bookViewerState';

const readyBook = {
  _id: 'book-1',
  status: 'completed',
  generationStep: 'completed',
  previewImagesStatus: 'completed',
  remainingPagesStatus: 'generating',
  isPurchased: false,
  title: 'הספר שלי',
  child: { name: 'נועם' },
  cover: { imageUrl: '/cover.jpg' },
  pages: [
    { page: 1, text: 'עמוד ראשון', imageUrl: '/page-1.jpg' },
    { page: 2, text: 'עמוד שני', imageUrl: '/page-2.jpg' },
  ],
};

test('requires the cover and both preview pages before rendering the book', () => {
  expect(hasRenderableBookPreview(readyBook)).toBe(true);
  expect(hasRenderableBookPreview({
    ...readyBook,
    pages: [{ page: 1, imageUrl: '/page-1.jpg' }],
  })).toBe(false);
});

test('keeps polling when a preview asset is missing', () => {
  const incompleteBook = {
    ...readyBook,
    pages: [
      readyBook.pages[0],
      { page: 2, text: 'עמוד שני', imageUrl: '' },
    ],
  };

  expect(isBookStillEnhancing(incompleteBook)).toBe(true);
  expect(getBookPreviewImageUrls(incompleteBook)).toEqual([
    '/cover.jpg',
    '/page-1.jpg',
  ]);
});

test('does not treat unpaid background generation as a reader refresh', () => {
  expect(isBookStillEnhancing(readyBook)).toBe(false);
  expect(isBookStillEnhancing({ ...readyBook, isPurchased: true })).toBe(true);
});

test('creates the same render fingerprint for equivalent poll responses', () => {
  const clonedBook = JSON.parse(JSON.stringify(readyBook));

  expect(getBookRenderFingerprint(clonedBook))
    .toBe(getBookRenderFingerprint(readyBook));
});
