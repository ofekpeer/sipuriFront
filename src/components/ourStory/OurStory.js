import { Link } from "react-router-dom";
import { FaArrowLeft, FaHeart, FaMagic, FaStar } from "react-icons/fa";
import "./OurStory.css";
import storyImage from "../../assets/story/story-image.png";

const values = [
  { icon: <FaMagic />, title: "מותאם אישית", text: "לשם, לחלומות ולתחביבים" },
  { icon: <FaHeart />, title: "נוצר באהבה", text: "בשביל רגעי קריאה משותפים" },
  { icon: <FaStar />, title: "נשאר בלב", text: "סיפור שחוזרים אליו שוב" },
];

function OurStory() {
  return (
    <section id="story" className="our-story" dir="rtl">
      <div className="our-story__glow our-story__glow--one" />
      <div className="our-story__glow our-story__glow--two" />

      <div className="story-container">
        <div className="story-layout">
          <div className="story-copy">
            <span className="story-kicker">הסיפור שלנו</span>
            <h2>כל ילד ראוי להיות<br /><em>הגיבור של הסיפור שלו.</em></h2>
            <p className="story-lead">התחלנו משאלה קטנה: איך הופכים את זמן הקריאה לרגע שהילדים באמת מחכים לו?</p>
            <p>
              התשובה הייתה פשוטה: נותנים להם להיכנס לתוך הסיפור. עם השם שלהם,
              התחביבים שלהם והעולם שהם הכי אוהבים לדמיין.
            </p>
            <p>
              כך נולד Sipuri — מקום שבו כל ספר הוא הרפתקה אישית, מאוירת ומלאה
              בקסם, שנוצרה במיוחד בשביל ילד או ילדה אחת.
            </p>

            <div className="story-values">
              {values.map((value) => (
                <div className="story-value" key={value.title}>
                  <span aria-hidden="true">{value.icon}</span>
                  <div><strong>{value.title}</strong><small>{value.text}</small></div>
                </div>
              ))}
            </div>

            <Link className="story-cta" to="/create-book">
              יוצרים את הספר הראשון <FaArrowLeft aria-hidden="true" />
            </Link>
          </div>

          <div className="story-visual">
            <div className="story-image">
              <img src={storyImage} alt="ילד קורא סיפור אישי של Sipuri" />
            </div>
            <div className="story-visual__tag">✦ נכתב במיוחד בשבילם</div>
            <div className="story-visual__spark story-visual__spark--one">✦</div>
            <div className="story-visual__spark story-visual__spark--two">✧</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurStory;
