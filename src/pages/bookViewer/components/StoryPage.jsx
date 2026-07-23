import React, { forwardRef } from "react";
import { getBookAssetUrl } from '../../../services/bookApi';
import "./StoryPage.css";

const StoryPage = forwardRef(({ page }, ref) => {
  if (!page) {
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
          {page.imageUrl ? (
            <img
              src={getBookAssetUrl(page.imageUrl)}
              alt={`Page ${page.page}`}
              draggable="false"
            />
          ) : (
            <div className="story-placeholder">🎨</div>
          )}

          <div className="story-overlay" />

          <div className="story-content">
            <div className="story-text">
              {page.text}
            </div>

            <div className="story-footer">
              עמוד {page.page}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

StoryPage.displayName = "StoryPage";

export default StoryPage;
