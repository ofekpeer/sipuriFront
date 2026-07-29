import "./Features.css";
import story from "../../assets/features/story.jpg";
import art from "../../assets/features/art.jpg";
import gift from "../../assets/features/gift.jpg";
import shipping from "../../assets/features/shipping.jpg";
const features = [

    {
        title:"סיפור אישי באמת",
        text:"כל ספר נכתב במיוחד עבור הילד שלכם ומשלב את השם, התחביבים והחלומות שלו.",
        image: story
    },

    {
        title:"איורים קסומים",
        text:"כל עמוד מאויר במיוחד כדי להפוך את הסיפור לחוויה שילדים לא ישכחו.",
        image: art
    },

    {
        title:"מתנה שנשארת לנצח",
        text:"ספר מודפס ואיכותי שהופך לזיכרון משפחתי שנשמר לאורך שנים.",
        image: gift
    },

    {
        title:"הדפסה ומשלוח",
        text:"אנחנו מדפיסים באיכות גבוהה ושולחים עד הבית, מוכן להפתיע ולרגש.",
        image: shipping
    }

];

function Features(){

    return(

        <section className="features">

            <div className="features-header">

                <span>

                    💜 למה משפחות אוהבות את Sipuri?

                </span>

                <h2>

                    הרבה יותר מספר ילדים

                </h2>

                <p>

                    כל ספר הוא חוויה אישית שמתחילה בדמיון ומסתיימת במזכרת שנשארת לכל החיים.

                </p>

            </div>

            <div className="features-grid">

                {

                    features.map((feature,index)=>(

                        <div
                            key={index}
                            className="feature-card"
                        >

                            <div className="feature-image">

                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    loading="lazy"
                                    decoding="async"
                                />

                            </div>

                            <div className="feature-content">

                                <h3>

                                    {feature.title}

                                </h3>

                                <p>

                                    {feature.text}

                                </p>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default Features;
