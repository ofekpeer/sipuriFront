import "./CreateBook.css";

import { useBook } from "../../context/BookContext";

import ProgressBar from "../../components/bookWizard/ProgressBar";
import StepOne from "../../components/bookWizard/StepOne";
import StepTwo from "../../components/bookWizard/StepTwo";
import StepThree from "../../components/bookWizard/StepThree";
import StepFour from "../../components/bookWizard/StepFour";
import StepFive from "../../components/bookWizard/StepFive";

import BookPreview from "../../components/bookPreview/BookPreview";

function CreateBook() {

    const { step } = useBook();

    return (

        <div className="create-page">

            <div className="create-wrapper">

                <div className="create-form">

                    <ProgressBar step={step} />

                    {step === 1 && <StepOne />}

                    {step === 2 && <StepTwo />}

                    {step === 3 && <StepThree />}

                    {step === 4 && <StepFour />}

                    {step === 5 && <StepFive />}

                </div>

                <BookPreview />

            </div>

        </div>

    );

}

export default CreateBook;