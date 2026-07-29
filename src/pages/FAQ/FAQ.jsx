import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./FAQ.css";

const questions = [
  {
    question: "מה זה Sipuri?",
    answer: "Sipuri מאפשר ליצור ספר ילדים אישי שבו הילד או הילדה הופכים לגיבורי הסיפור. בוחרים נושא, מוסיפים פרטים ותמונה, ואנחנו יוצרים חוויה מאוירת במיוחד עבורכם.",
  },
  {
    question: "איך יוצרים ספר?",
    answer: "נרשמים לאתר, לוחצים על ׳צור ספר׳, ממלאים פרטים על הגיבור או הגיבורה, בוחרים את נושא הסיפור ואת הסגנון המועדף ומעלים תמונה. לאחר מכן הספר יופיע בספרייה האישית שלך.",
  },
  {
    question: "האם חייבים להעלות תמונה?",
    answer: "כן, תמונה עוזרת לנו ליצור דמות שמזכירה את הילד או הילדה. מומלץ לבחור תמונה ברורה, מוארת, שבה הפנים נראות היטב וללא אנשים נוספים בפריים.",
  },
  {
    question: "האם האיור יהיה זהה לתמונה שהעליתי?",
    answer: "האיורים נוצרים באמצעות בינה מלאכותית ובסגנון שבחרת. המטרה היא לשמור על מאפיינים כלליים של הדמות, אך האיור הוא פרשנות יצירתית ואינו העתק מדויק של התמונה המקורית.",
  },
  {
    question: "כמה זמן לוקח ליצור ספר?",
    answer: "הספר נוצר ברקע כדי שתוכלו להמשיך להשתמש באתר. משך ההכנה משתנה בהתאם לעומס ולמספר האיורים, וניתן לראות את סטטוס ההתקדמות בעמוד הטעינה ובספרייה האישית.",
  },
  {
    question: "איפה נמצאים הספרים שלי?",
    answer: "לאחר התחברות, אפשר להיכנס ל׳הספרייה שלי׳ דרך התפריט. שם אפשר לפתוח ספרים שנוצרו, לנהל אותם ולגשת לרכישות שבוצעו בחשבון.",
  },
  {
    question: "אפשר לערוך ספר שכבר נוצר?",
    answer: "כן. מהספרייה אפשר לפתוח את אפשרויות הניהול של הספר ולערוך פרטים, טקסטים או תמונות לפי האפשרויות הזמינות.",
  },
  {
    question: "למה חלק מהעמודים נעולים?",
    answer: "ייתכן שחלק מהספר מוצג כתצוגה מקדימה. לאחר השלמת רכישה תקינה, הגישה לספר המלא נפתחת בחשבון שבו בוצעה הרכישה.",
  },
  {
    question: "איך שומרים על הפרטיות של הילד או הילדה?",
    answer: "אנו משתמשים בפרטים ובתמונה רק לצורך יצירת הספר, הפעלת החשבון ומתן השירות. מידע נוסף מופיע במדיניות הפרטיות שלנו.",
  },
  {
    question: "לא מצאתי תשובה — איך יוצרים קשר?",
    answer: "אפשר לפנות אלינו דרך ערוץ יצירת הקשר באתר. נשמח לעזור בכל שאלה על יצירת ספר, החשבון או הגישה לספרייה.",
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <article className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
      <button className="faq-item__question" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.question}</span>
        <FaChevronDown aria-hidden="true" />
      </button>
      <div className="faq-item__answer" hidden={!isOpen}>
        <p>{item.answer}</p>
      </div>
    </article>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <main className="faq-page" dir="rtl">
      <section className="faq-hero">
        <span className="faq-hero__eyebrow">SIPURI · כאן בשבילכם</span>
        <h1>שאלות נפוצות</h1>
        <p>כל מה שכדאי לדעת לפני שמתחילים ליצור סיפור אישי וקסום.</p>
      </section>

      <section className="faq-list" aria-label="שאלות ותשובות נפוצות">
        {questions.map((item, index) => (
          <FAQItem
            key={item.question}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </section>
    </main>
  );
}

export default FAQ;
