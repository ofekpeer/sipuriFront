import "./HowItWorks.css";
import aboutkid from "../../assets/howItWorks/aboutkid.png";
import magicstart from "../../assets/howItWorks/magicstart.png";
import book from "../../assets/howItWorks/bookcreate.png";
import delivery from "../../assets/howItWorks/delivery.png";
const steps = [

    {
        title: "ספרו לנו על הילד",
        icon: "👦",
        image: aboutkid,
        text: "שם, גיל, תחביבים וכל פרט שהופך את הסיפור לייחודי."
    },

    {
        title: "הקסם מתחיל",
        icon: "✨",
        image: magicstart,
        text: "ה-AI יוצר עלילה אישית ואיורים מרהיבים במיוחד."
    },

    {
        title: "הספר נוצר",
        icon: "📖",
        image: book,
        text: "צפו בתוצאה והתרשמו מהספר לפני ההזמנה."
    },

    {
        title: "מגיע עד הבית",
        icon: "📦",
        image: delivery,
        text: "אנחנו מדפיסים ושולחים את הספר באיכות גבוהה."
    }

];

function HowItWorks(){

    return(

        <section className="how">

            <div className="how-background"></div>

            <div className="how-header">

                <span className="how-badge">

                    ✨ תוך פחות מ־3 דקות

                </span>

                <h2>

                    כך נוצר
                    <span> הקסם</span>

                </h2>

                <p>

                    ארבעה צעדים פשוטים והילד שלכם הופך לגיבור של ספר אמיתי.

                </p>

            </div>

            <div className="magic-line">

                {

                    steps.map((step,index)=>(

                        <div
                            className="magic-step"
                            key={index}
                        >

                            <div className="magic-circle">

                               <img className="magic-image" src={step.image} alt={step.title} />

                            </div>

                            <h3>

                                {step.title}

                            </h3>

                            <p>

                                {step.text}

                            </p>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default HowItWorks;