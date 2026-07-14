import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useBook } from "../context/BookContext";
import Footer from "../components/footer/Footer";

function MainLayout() {

    const location = useLocation();

    const isCreateBook = location.pathname === "/create-book";

    const { step } = useBook();

    return (

        <>

            <Navbar

                showProgress={isCreateBook}

                step={step}

                totalSteps={5}

            />

            <Outlet />
            <Footer/>

        </>

    );

}

export default MainLayout;