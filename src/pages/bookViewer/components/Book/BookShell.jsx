import "./BookShell.css";

function BookShell({ children }) {
    return (
        <div className="book-shell">

            <div className="book-shadow" />
            <div className="book-pages">

                {children}

            </div>

        </div>
    );
}

export default BookShell;