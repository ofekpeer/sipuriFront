import "./Testimonials.css";

function Testimonials() {
  return (
    <section className="testimonials">

      <div className="title">

        <span>לקוחות מספרים</span>

        <h2>
          אלפי הורים כבר הפכו את הילדים שלהם
          לגיבורי הסיפור
        </h2>

      </div>

      <div className="reviews">

        <div className="review">

          <div className="avatar">
            נ
          </div>

          <h3>נועה</h3>

          <h4>אמא של עידו</h4>

          <p>
            הבן שלי לא הפסיק לקרוא את הספר.
            הוא היה בטוח שהוא באמת יצא להרפתקה.
          </p>

        </div>

        <div className="review">

          <div className="avatar">
            ר
          </div>

          <h3>רועי</h3>

          <h4>אבא של מאיה</h4>

          <p>
            איכות מדהימה.
            האיורים פשוט מושלמים.
          </p>

        </div>

        <div className="review">

          <div className="avatar">
            ש
          </div>

          <h3>שירה</h3>

          <h4>אמא של נועם</h4>

          <p>
            המתנה הכי מיוחדת שקנינו לילדה שלנו.
          </p>

        </div>

      </div>

    </section>
  );
}

export default Testimonials;