import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useBook } from "../context/BookContext";
import Footer from "../components/footer/Footer";
function CreateBookLayout() {

    const { step } = useBook();

    return (

        <>

            <Navbar

                showProgress={true}

                step={step}

                totalSteps={5}

            />

            <Outlet />

                        <Footer/>


        </>

    );

}

export default CreateBookLayout;