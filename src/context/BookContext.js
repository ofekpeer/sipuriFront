import { createContext, useContext, useState } from 'react';

const BookContext = createContext();

const initialFormData = {
  child: {
    name: '',
    age: '',
    gender: '',
    image: null,
  },

  story: {
    type: '',
    hobbies: '',
    lesson: '',
  },

  design: {
    illustrationStyle: '',
  },
};

export function BookProvider({ children }) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState(initialFormData);

  function updateField(section, field, value) {
    setFormData((prev) => ({
      ...prev,

      [section]: {
        ...prev[section],

        [field]: value,
      },
    }));
  }

  function handleInputChange(e) {
    const { name, value } = e.target;

    const [section, field] = name.split('.');

    updateField(section, field, value);
  }

  function resetBook() {
    setFormData(initialFormData);

    setStep(1);
  }

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, 5));
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  return (
    <BookContext.Provider
      value={{
        step,
        setStep,

        formData,
        setFormData,

        updateField,
        handleInputChange,

        nextStep,
        prevStep,

        resetBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBook() {
  return useContext(BookContext);
}
