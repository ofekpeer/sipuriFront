import "./BookPreview.css";
import { useBook } from "../../context/BookContext";

import Sipuri from "../../assets/sipuri-fox.png";

function BookPreview() {

  const { formData } = useBook();

  const storyIcons = {

    space: "🚀",

    dinosaurs: "🦖",

    magic: "🪄",

    pirates: "🏴‍☠️",

    princess: "👑",

    jungle: "🦁",

    ocean: "🌊",

  };

  const storyNames = {

    space: "חלל",

    dinosaurs: "דינוזאורים",

    magic: "קסמים",

    pirates: "פיראטים",

    princess: "נסיכות",

    jungle: "ג'ונגל",

    ocean: "אוקיינוס",

  };

  const styleNames = {
    disney: "אגדה",
    pixar: "תלת־ממד",
    watercolor: "צבעי מים",
    comic: "קומיקס",
  };

  const selectedStyle = formData.design.illustrationStyle || "pixar";

  return (

    <div className="preview">

      <div className="preview-book">

        <div className={`preview-cover preview-cover--${selectedStyle}`}>

          <div className="preview-bookmark"></div>

          <div className="preview-logo">

            סיפורי

          </div>

          <div className="preview-stars">

            ✨ ✦ ⭐

          </div>

          <img

            src={Sipuri}

            alt="Sipuri"

            className="preview-character"

          />

          <div className="preview-icon">

            {

              storyIcons[formData.story.type] || "✨"

            }

          </div>

          <h2>

            {

              formData.child.name

                ? `ההרפתקה של ${formData.child.name}`

                : "הספר שלך"

            }

          </h2>

          <span>

            {

              storyNames[formData.story.type] ||

              "בחר הרפתקה"

            }

          </span>

          <small className="preview-style-label">
            {styleNames[selectedStyle]} · תצוגה להמחשה
          </small>

        </div>

      </div>

    </div>

  );

}

export default BookPreview;
