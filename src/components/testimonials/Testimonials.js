import { useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaQuoteRight, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import useMediaQuery from "../../hooks/useMediaQuery";
import "swiper/css";
import "swiper/css/pagination";
import "./Testimonials.css";

const reviews = [
  {
    initial: "נ",
    name: "נועה",
    role: "אמא של עידו",
    text: "הבן שלי לא הפסיק לקרוא את הספר. הוא היה בטוח שהוא באמת יצא להרפתקה — וזו הייתה מתנה מרגשת במיוחד.",
    tone: "violet",
  },
  {
    initial: "ר",
    name: "רועי",
    role: "אבא של מאיה",
    text: "האיכות נהדרת והאיורים פשוט קסומים. לראות את מאיה מזהה את עצמה בתוך הסיפור היה רגע שלא נשכח.",
    tone: "orange",
  },
  {
    initial: "ש",
    name: "שירה",
    role: "אמא של נועם",
    text: "זו המתנה הכי אישית שנתנו לילדה שלנו. היא מבקשת לקרוא את הסיפור שוב ושוב לפני השינה.",
    tone: "pink",
  },
  {
    initial: "א",
    name: "אורית",
    role: "אמא של ליבי",
    text: "הסיפור הצליח לרגש את כולנו. ליבי חייכה מהרגע שראתה את עצמה על הכריכה ועד העמוד האחרון.",
    tone: "teal",
  },
  {
    initial: "ד",
    name: "דניאל",
    role: "אבא של תום",
    text: "התהליך היה פשוט ומהיר, והתוצאה הרגישה ממש אישית. תום כבר מבקש לבחור את ההרפתקה הבאה שלו.",
    tone: "blue",
  },
  {
    initial: "מ",
    name: "מיכל",
    role: "אמא של יעל",
    text: "רעיון מקסים ליום הולדת. הספר גרם ליעל להרגיש שהיא יכולה להיות כל מה שתרצה לדמיין.",
    tone: "coral",
  },
];

function Testimonials() {
  const swiperRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section id="reviews" className="testimonials" dir="rtl">
      <header className="testimonials-header">
        <span className="testimonials-kicker">אהבה שמספרת סיפור</span>
        <h2>מה הורים מספרים<br /><em>על הרגעים הקסומים בבית</em></h2>
        <p>ספר אישי הוא הרבה יותר מאיור יפה — הוא זיכרון משפחתי שנשאר.</p>
      </header>

      <div className="reviews-carousel-shell">
      <Swiper
        className="reviews-carousel"
        dir="rtl"
        modules={[Autoplay, Pagination]}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        spaceBetween={22}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={isMobile ? false : { delay: 5200, disableOnInteraction: false, pauseOnMouseEnter: true }}
        breakpoints={{
          700: { slidesPerView: 2 },
          1080: { slidesPerView: 3 },
        }}
      >
        {reviews.map((review) => (
          <SwiperSlide className="review-slide" key={review.name}>
            <article className="review">
              <FaQuoteRight className="review-quote" aria-hidden="true" />
              <div className="review-stars" aria-label="5 מתוך 5 כוכבים">
                {[...Array(5)].map((_, index) => <FaStar key={index} aria-hidden="true" />)}
              </div>
              <p className="review-text">״{review.text}״</p>
              <footer className="review-author">
                <div className={`avatar avatar--${review.tone}`} aria-hidden="true">{review.initial}</div>
                <div>
                  <h3>{review.name}</h3>
                  <span>{review.role}</span>
                </div>
              </footer>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="reviews-controls" aria-label="ניווט בין ביקורות">
        <button type="button" onClick={() => swiperRef.current?.slidePrev()} aria-label="הביקורת הקודמת">
          <FaArrowRight aria-hidden="true" />
        </button>
        <button type="button" onClick={() => swiperRef.current?.slideNext()} aria-label="הביקורת הבאה">
          <FaArrowLeft aria-hidden="true" />
        </button>
      </div>
      </div>
    </section>
  );
}

export default Testimonials;
