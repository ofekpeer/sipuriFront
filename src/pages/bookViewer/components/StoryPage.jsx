import React, { forwardRef } from "react";
import { getBookAssetUrl } from '../../../services/bookApi';
import { useLiveBookContent } from './Book/BookContentContext';
import "./StoryPage.css";

const StoryPage = forwardRef(({ page, pageNumber }, ref) => {
  const liveBook = useLiveBookContent();
  const displayedPage = liveBook?.pages?.find(
    (item) => item.page === (pageNumber ?? page?.page),
  ) || page;

  if (!displayedPage) {
    return (
      <div className="story-page" ref={ref}>
        <div className="story-paper empty-paper" />
      </div>
    );
  }

  return (
    <div className="story-page" ref={ref}>
      <div className="story-paper">
        <div className="story-background">
          {displayedPage.imageUrl ? (
            <img
              src={getBookAssetUrl(displayedPage.imageUrl)}
              alt={`איור לעמוד ${displayedPage.page}`}
              draggable="false"
              decoding="async"
            />
          ) : (
            <div className="story-placeholder" role="status">
              <span aria-hidden="true" />
              <p>האיור של העמוד בדרך...</p>
            </div>
          )}

          <div className="story-overlay" />

          <div className="story-content">
            <div className="story-text" dir="rtl">
              {displayedPage.text}
            </div>

            <div className="story-footer">
              עמוד {displayedPage.page}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

StoryPage.displayName = "StoryPage";

export default StoryPage;
