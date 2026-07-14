import './OurStory.css';

import storyImage from '../../assets/story/story-image.png';

function OurStory() {
  return (
    <section className="our-story">
      <div className="story-container">
        <div className="story-header">
          <span>✨ כל סיפור גדול מתחיל בחלום קטן</span>

          <h2>
            למה יצרנו את
            <span>?סיפורי</span>
          </h2>
        </div>

        <div className="story-image">
          <img src={storyImage} alt="Our Story" />
        </div>

        <div className="story-text">
          <p>פעם שאלנו את עצמנו שאלה פשוטה.</p>

          <p>
            איך אפשר לגרום לילדים להתרגש מספר, בדיוק כמו שהם מתרגשים מסרט או
            ממשחק?
          </p>

          <p>
            התשובה הייתה פשוטה. אם כל ילד יוכל להיות הגיבור של הסיפור שלו,
            הקריאה תהפוך להרפתקה שהוא לעולם לא ישכח.
          </p>

          <p>
            לכן יצרנו את Sipuri — מקום שבו כל ספר נכתב במיוחד עבור ילד אחד, עם
            השם שלו, התחביבים שלו, והחלומות שלו.
          </p>

          <button>צור את הספר הראשון שלך →</button>
        </div>
      </div>
    </section>
  );
}

export default OurStory;
