import "./BookScene.css";

function BookScene({ children }) {
    return (
        <div className="book-scene">

            <div className="scene-light" />

            <div className="scene-table">

                {children}

            </div>

        </div>
    );
}

export default BookScene;