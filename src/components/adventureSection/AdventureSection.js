import './AdventureSection.css';

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import useMediaQuery from '../../hooks/useMediaQuery';

import 'swiper/css';

import dino from '../../assets/adventures/dino.jpg';
import space from '../../assets/adventures/space.jpg';
import magic from '../../assets/adventures/magic.jpg';
import pirates from '../../assets/adventures/pirates.jpg';
import jungle from '../../assets/adventures/jungle.jpg';
import ocean from '../../assets/adventures/ocean.jpg';

const adventures = [
  { title: 'עולם הדינוזאורים', image: dino, icon: '🦕', label: 'מסע בזמן', description: 'פגשו דינוזאורים ענקיים וצאו למסע בלתי נשכח.' },
  { title: 'מסע לחלל', image: space, icon: '🚀', label: 'מעבר לכוכבים', description: 'טוסו בין הכוכבים ופגשו עולמות חדשים.' },
  { title: 'עולם הקסמים', image: magic, icon: '🪄', label: 'אבקת פיות', description: 'קסמים, דרקונים ופיות מחכים רק לכם.' },
  { title: 'אי הפיראטים', image: pirates, icon: '🏴‍☠️', label: 'מפת אוצר', description: 'חפשו את האוצר האבוד בלב הים.' },
  { title: 'ספארי בג׳ונגל', image: jungle, icon: '🌿', label: 'חיות מופלאות', description: 'גלו חיות מופלאות והרפתקאות בג׳ונגל.' },
  { title: 'מעמקי הים', image: ocean, icon: '🐠', label: 'מתחת לגלים', description: 'שחו לצד דולפינים וגלו עולם קסום מתחת למים.' },
];

function AdventureSection() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const autoplayResumeTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(autoplayResumeTimer.current), []);

  function pauseAutoplay(swiper) {
    if (!isMobile) return;
    window.clearTimeout(autoplayResumeTimer.current);
    swiper.autoplay?.stop();
  }

  function resumeAutoplay(swiper) {
    if (!isMobile) return;
    window.clearTimeout(autoplayResumeTimer.current);
    autoplayResumeTimer.current = window.setTimeout(() => swiper.autoplay?.start(), 1800);
  }

  return (
    <section className="adventure-section" aria-labelledby="adventure-title">
      <div className="adventure-section__stars" aria-hidden="true" />
      <div className="adventure-section__orb adventure-section__orb--one" aria-hidden="true" />
      <div className="adventure-section__orb adventure-section__orb--two" aria-hidden="true" />

      <div className="adventure-header">
        <span className="section-badge">✦ מעל 100 עולמות והרפתקאות</span>
        <h2 id="adventure-title">בחרו את <span>ההרפתקה המושלמת</span></h2>
        <p>כל ספר פותח עולם חדש שבו הילד או הילדה שלכם הם הגיבורים הראשיים.</p>
      </div>

      <Swiper
        modules={[Autoplay]}
        loop
        speed={9500}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        grabCursor
        followFinger
        threshold={5}
        resistanceRatio={0.85}
        longSwipesRatio={0.12}
        onTouchStart={pauseAutoplay}
        onTouchEnd={resumeAutoplay}
        spaceBetween={18}
        breakpoints={{
          0: { slidesPerView: 1.14, spaceBetween: 14 },
          480: { slidesPerView: 1.42, spaceBetween: 16 },
          768: { slidesPerView: 2.2, spaceBetween: 18 },
          1024: { slidesPerView: 3, spaceBetween: 22 },
          1400: { slidesPerView: 4, spaceBetween: 25 },
        }}
        className="adventure-slider"
      >
        {adventures.map((adventure) => (
          <SwiperSlide key={adventure.title}>
            <article className="adventure-card">
              <img src={adventure.image} alt={adventure.title} loading="lazy" decoding="async" />
              <div className="adventure-card__shade" aria-hidden="true" />
              <div className="adventure-card__content">
                <span className="adventure-card__label">{adventure.icon} {adventure.label}</span>
                <h3>{adventure.title}</h3>
                <p>{adventure.description}</p>
                <Link to="/create-book" className="adventure-card__action">
                  בחרו הרפתקה
                  <span aria-hidden="true">←</span>
                </Link>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="adventure-section__hint">גררו ימינה או שמאלה כדי לגלות עוד עולמות</p>
    </section>
  );
}

export default AdventureSection;
