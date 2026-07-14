import './AdventureSection.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

import dino from '../../assets/adventures/dino.png';
import space from '../../assets/adventures/space.png';
import magic from '../../assets/adventures/magic.png';
import pirates from '../../assets/adventures/pirates.png';
import jungle from '../../assets/adventures/jungle.png';
import ocean from '../../assets/adventures/ocean.png';

const adventures = [
  {
    title: 'עולם הדינוזאורים',
    image: dino,
    description: 'פגשו דינוזאורים ענקיים וצאו למסע בלתי נשכח.',
  },
  {
    title: 'מסע לחלל',
    image: space,
    description: 'טוסו בין הכוכבים ופגשו עולמות חדשים.',
  },
  {
    title: 'עולם הקסמים',
    image: magic,
    description: 'קסמים, דרקונים ופיות מחכים רק לכם.',
  },
  {
    title: 'אי הפיראטים',
    image: pirates,
    description: 'חפשו את האוצר האבוד בלב הים.',
  },
  {
    title: "ספארי בג'ונגל",
    image: jungle,
    description: "גלו חיות מופלאות והרפתקאות בג'ונגל.",
  },
  {
    title: 'מעמקי הים',
    image: ocean,
    description: 'שחו לצד דולפינים וגלו עולם קסום מתחת למים.',
  },
];

function AdventureSection() {
  return (
    <section className="adventure-section">
      <div className="stars">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="magic-glow"></div>
      <div className="adventure-header">
        <span className="section-badge">✨ מעל 100 הרפתקאות שונות</span>

        <h2>
          בחרו את
          <span> ההרפתקה המושלמת</span>
        </h2>

        <p>כל ספר הוא עולם חדש שבו הילד שלכם הוא הגיבור הראשי.</p>
      </div>

      <Swiper
        modules={[Autoplay]}
        loop={true}
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        grabCursor={true}
        centeredSlides={false}
        spaceBetween={18}
        slidesPerView={4}
        breakpoints={{
          0: {
            slidesPerView: 1.15,
            spaceBetween: 14,
          },

          480: {
            slidesPerView: 1.4,
            spaceBetween: 16,
          },

          768: {
            slidesPerView: 2.2,
            spaceBetween: 18,
          },

          1024: {
            slidesPerView: 3,
            spaceBetween: 22,
          },

          1400: {
            slidesPerView: 4,
            spaceBetween: 25,
          },
        }}
        className="adventure-slider"
      >
        {adventures.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="adventure-card">
              <img src={item.image} alt={item.title} />

              <div className="overlay">
                <div className="card-badge">✨ חדש</div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <button>צור ספר →</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default AdventureSection;
