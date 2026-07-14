import { useNavigate } from 'react-router-dom';
import { useBook } from '../../context/BookContext';

function StepFive() {
  const { formData, prevStep } = useBook();

  const navigate = useNavigate();

  const storyNames = {
    space: 'חלל',
    dinosaurs: 'דינוזאורים',
    magic: 'קסמים',
    pirates: 'פיראטים',
  };

  const styleNames = {
    disney: 'דיסני',
    pixar: 'פיקסאר',
    watercolor: 'צבעי מים',
    comic: 'קומיקס',
  };

  async function createBook() {
    try {
      const response = await fetch(
        'http://localhost:5000/api/books/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      console.log(data);

      // מעבר ישירות לעמוד הספר לפי ה-ID
      navigate(`/book/${data.data._id}`);
    } catch (err) {
      console.error(err);
      alert('אירעה שגיאה ביצירת הספר');
    }
  }

  return (
    <>
      <h2>הכול מוכן! 🎉</h2>

      <p>בדקו שכל הפרטים נכונים לפני יצירת הספר.</p>

      <div className="summary">
        <h3>שם: {formData.child.name || '-'}</h3>

        <h3>גיל: {formData.child.age || '-'}</h3>

        <h3>מין: {formData.child.gender || '-'}</h3>

        <h3>תחביבים: {formData.story.hobbies || '-'}</h3>

        <h3>הרפתקה: {storyNames[formData.story.type] || '-'}</h3>

        <h3>
          סגנון איור: {styleNames[formData.design.illustrationStyle] || '-'}
        </h3>

        <h3>תמונה: {formData.child.image ? '✅ הועלתה' : '❌ לא הועלתה'}</h3>
      </div>

      <div className="wizard-buttons">
        <button className="back-btn" onClick={prevStep}>
          ← הקודם
        </button>

        <button className="next-btn" onClick={createBook}>
          ✨ צור את הספר
        </button>
      </div>
    </>
  );
}

export default StepFive;