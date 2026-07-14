import './Books.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import book1 from '../../assets/books/book1.png';
import book2 from '../../assets/books/book2.png';
import book3 from '../../assets/books/book3.png';

const books = [
  {
    image: book1,

    title: 'המסע של נועם',

    description: 'הרפתקה בעולם הדינוזאורים',
  },

  {
    image: book2,

    title: 'מאיה והחד קרן',

    description: 'מסע קסום בארץ הפלאות',
  },

  {
    image: book3,

    title: 'יואב בחלל',

    description: 'מסע בין הכוכבים',
  },
  {
    image: book3,

    title: 'יואב בחלל',

    description: 'מסע בין הכוכבים',
  },
  {
    image: book3,

    title: 'יואב בחלל',

    description: 'מסע בין הכוכבים',
  },
  {
    image: book2,

    title: 'מאיה והחד קרן',

    description: 'מסע קסום בארץ הפלאות',
  },
  {
    image: book2,

    title: 'מאיה והחד קרן',

    description: 'מסע קסום בארץ הפלאות',
  },
  {
    image: book2,

    title: 'מאיה והחד קרן',

    description: 'מסע קסום בארץ הפלאות',
  },
  {
    image: book2,

    title: 'מאיה והחד קרן',

    description: 'מסע קסום בארץ הפלאות',
  },
];

function Books() {
  return (
    <section className="books">
      <span className="books-badge">📚 ספרים שנוצרו</span>

      <h2>
        כל ספר הוא
        <span> יצירת אמנות</span>
      </h2>

      <p>הצצה לכמה מהספרים שנוצרו בסיפורי</p>

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        centerInsufficientSlides={true}
        loop={true}
        pagination={{
          clickable: true,
        }}
        
        coverflowEffect={{
          rotate: 13,

          stretch: 0,

          depth: 150,

          modifier: 0.5,

          slideShadows: false,

          scale: 0.82,
        }}
        modules={[EffectCoverflow, Pagination]}
        className="books-slider"
      >
        {books.map((book, index) => (
          <SwiperSlide key={index} className="book-slide">
            <div className="book-card">
              <img src={book.image} alt={book.title} />

              <div className="book-info">
                <h3>{book.title}</h3>

                <p>{book.description}</p>

                <button>דפדף בספר</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Books;
