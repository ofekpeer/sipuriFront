export const PREVIEW_PAGE_COUNT = 2;

export function getBookPreviewImageUrls(book) {
  if (!book) return [];

  const pageUrls = (Array.isArray(book.pages) ? book.pages : [])
    .slice(0, PREVIEW_PAGE_COUNT)
    .map((page) => page?.imageUrl)
    .filter(Boolean);

  return [book.cover?.imageUrl, ...pageUrls].filter(Boolean);
}

export function hasRenderableBookPreview(book) {
  if (!book?.cover?.imageUrl) return false;

  const previewPages = (Array.isArray(book.pages) ? book.pages : [])
    .slice(0, PREVIEW_PAGE_COUNT);

  return previewPages.length === PREVIEW_PAGE_COUNT
    && previewPages.every((page) => Boolean(page?.imageUrl));
}

export function isBookStillEnhancing(book) {
  if (!book || book.status === 'failed') return false;

  const previewIsUpdating = ['pending', 'generating', 'partial']
    .includes(book.previewImagesStatus);
  const purchasedPagesAreUpdating = Boolean(book.isPurchased || book.isPaid)
    && ['queued', 'generating'].includes(book.remainingPagesStatus);

  return book.status === 'generating'
    || previewIsUpdating
    || purchasedPagesAreUpdating
    || !hasRenderableBookPreview(book);
}

// Backend polling returns a fresh object every time. React-pageflip rebuilds
// its internal DOM whenever its children receive new element identities, so
// update the reader only when something that is actually visible has changed.
export function getBookRenderFingerprint(book) {
  if (!book) return '';

  return JSON.stringify({
    id: book._id,
    status: book.status,
    generationStep: book.generationStep,
    previewImagesStatus: book.previewImagesStatus,
    remainingPagesStatus: book.remainingPagesStatus,
    isPurchased: Boolean(book.isPurchased || book.isPaid),
    title: book.title,
    summary: book.summary,
    moral: book.moral,
    childName: book.child?.name,
    coverUrl: book.cover?.imageUrl,
    pages: (Array.isArray(book.pages) ? book.pages : []).map((page) => ({
      page: page.page,
      text: page.text,
      imageUrl: page.imageUrl,
      isPlaceholder: page.isPlaceholder,
    })),
  });
}
