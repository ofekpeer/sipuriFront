import "./BookScene.css";

function BookScene({ backgroundUrl, children }) {
    return (
        <div className="book-scene">
            {backgroundUrl ? (
                <img
                    className="scene-artwork"
                    src={backgroundUrl}
                    alt=""
                    aria-hidden="true"
                />
            ) : null}
            <div className="scene-vignette" />
            <div className="scene-light" />
            <div className="scene-table">
                {children}
            </div>
        </div>
    );
}

export default BookScene;
