import './Books.css';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import useMediaQuery from '../../hooks/useMediaQuery';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import book1 from '../../assets/books/book1.jpg';
import book2 from '../../assets/books/book2.jpg';
import book3 from '../../assets/books/book3.jpg';
import pirates from '../../assets/adventures/pirates.jpg';
import magic from '../../assets/adventures/magic.jpg';
import jungle from '../../assets/adventures/jungle.jpg';

const books = [
  {
    image: book1,
    title: 'המסע של נועם',
    description: 'הרפתקה בעולם הדינוזאורים',
    label: 'עולם קדום',
    icon: '🦕',
  },
  {
    image: book2,
    title: 'מאיה והחד־קרן',
    description: 'מסע קסום בארץ הקשת בענן',
    label: 'הבחירה הקסומה',
    icon: '🦄',
  },
  {
    image: book3,
    title: 'יואב בחלל',
    description: 'מסע בין הכוכבים',
    label: 'מעבר לכוכבים',
    icon: '🚀',
  },
];

const desktopBooks = [
  books[0],
  {
    image: pirates,
    title: 'אורי ואוצר הפיראטים',
    description: 'מפת אוצר והרפתקה בלב הים',
    label: 'אוצר מעבר לים',
    icon: '🏴‍☠️',
  },
  books[1],
  {
    image: magic,
    title: 'אלה ומפתח הקסמים',
    description: 'דלת סודית לעולם מלא פלאים',
    label: 'קסם בכל עמוד',
    icon: '🪄',
  },
  books[2],
  {
    image: jungle,
    title: 'ליה בלב הג׳ונגל',
    description: 'חברות אמיצה בין חיות מופלאות',
    label: 'מסע בטבע',
    icon: '🌿',
  },
];

function Books() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [swiper, setSwiper] = useState(null);
  const displayedBooks = desktopBooks;
  const initialSlide = 2;

  return (
    <section className="books" aria-labelledby="books-title">
      <div className="books__aurora books__aurora--one" aria-hidden="true" />
      <div className="books__aurora books__aurora--two" aria-hidden="true" />

      <div className="books__header">
        <span className="books-badge">📚 הצצה למדף הקסום שלנו</span>

        <h2 id="books-title">
          כל ספר הוא
          <span> יצירת אמנות</span>
        </h2>

        <p>
          סיפור שנכתב במיוחד לילד שלכם, עם עולם מאויר שבו הוא הגיבור הראשי.
        </p>
      </div>

      <div className="books__gallery">
        <button
          type="button"
          className="books-nav books-prev"
          aria-label="הספר הקודם"
          onClick={() => swiper?.slideNext()}
        >
          <span aria-hidden="true">→</span>
        </button>

        <Swiper
          key={isMobile ? 'books-mobile' : 'books-desktop'}
          effect={isMobile ? 'slide' : 'coverflow'}
          grabCursor
          centeredSlides
          initialSlide={initialSlide}
          slidesPerView={isMobile ? 'auto' : 3}
          spaceBetween={isMobile ? 16 : 26}
          centerInsufficientSlides
          watchSlidesProgress
          loop
          pagination={{ el: '.books-pagination', clickable: true }}
          onSwiper={setSwiper}
          coverflowEffect={{
            rotate: 3,
            stretch: 0,
            depth: 115,
            modifier: .9,
            slideShadows: false,
            scale: .9,
          }}
          modules={[EffectCoverflow, Pagination]}
          className="books-slider"
        >
          {displayedBooks.map((book) => (
            <SwiperSlide key={book.title} className="book-slide">
              <article className="book-card">
                <div className="book-card__visual">
                  <img src={book.image} alt={`כריכת הספר ${book.title}`} loading="lazy" decoding="async" />
                  <span className="book-card__spine" aria-hidden="true" />
                  <span className="book-card__shine" aria-hidden="true" />
                  <span className="book-card__label">{book.icon} {book.label}</span>
                </div>

                <div className="book-info">
                  <div>
                    <h3>{book.title}</h3>
                    <p>{book.description}</p>
                  </div>
                  <span className="book-info__personal">נוצר במיוחד עבור ילד אחד</span>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="books-pagination swiper-pagination" aria-label="ניווט בין הספרים" />

        <button
          type="button"
          className="books-nav books-next"
          aria-label="הספר הבא"
          onClick={() => swiper?.slidePrev()}
        >
          <span aria-hidden="true">←</span>
        </button>
      </div>

      <div className="books__footer">
        <div className="books__promise">
          <span>✦</span>
          <p><strong>אף ספר לא דומה לאחר</strong> השם, העלילה והאיורים נוצרים במיוחד עבורכם.</p>
        </div>

        <Link className="books__cta" to="/create-book">
          צרו את הספר שלכם
          <span aria-hidden="true">←</span>
        </Link>
      </div>
    </section>
  );
}

export default Books;
