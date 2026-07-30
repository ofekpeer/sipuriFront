import "./CreateBook.css";

import { useEffect, useRef } from "react";

import { useBook } from "../../context/BookContext";

import ProgressBar from "../../components/bookWizard/ProgressBar";
import StepOne from "../../components/bookWizard/StepOne";
import StepTwo from "../../components/bookWizard/StepTwo";
import StepThree from "../../components/bookWizard/StepThree";
import StepFour from "../../components/bookWizard/StepFour";
import StepFive from "../../components/bookWizard/StepFive";

function CreateBook() {

    const { step } = useBook();
    const formRef = useRef(null);

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [step]);

    return (

        <div className="create-page">

            <div className="create-wrapper">

                <div className="create-form" ref={formRef}>

                    <ProgressBar step={step} />

                    {step === 1 && <StepOne />}

                    {step === 2 && <StepTwo />}

                    {step === 3 && <StepThree />}

                    {step === 4 && <StepFour />}

                    {step === 5 && <StepFive />}

                </div>
            </div>

        </div>

    );

}

export default CreateBook;
