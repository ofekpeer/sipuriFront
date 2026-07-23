import { createContext, useContext, useReducer } from 'react';

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
    illustrationStyle: 'pixar',
  },
};

const initialState = {
  step: 1,
  formData: initialFormData,
};

export function bookWizardReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.section]: {
            ...state.formData[action.section],
            [action.field]: action.value,
          },
        },
      };

    case 'NEXT_STEP':
      return {
        ...state,
        step: Math.min(state.step + 1, 5),
      };

    case 'PREV_STEP':
      return {
        ...state,
        step: Math.max(state.step - 1, 1),
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function BookProvider({ children }) {
  const [state, dispatch] = useReducer(bookWizardReducer, initialState);

  function updateField(section, field, value) {
    dispatch({ type: 'UPDATE_FIELD', section, field, value });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    const [section, field] = name.split('.');

    updateField(section, field, value);
  }

  function resetBook() {
    dispatch({ type: 'RESET' });
  }

  function nextStep() {
    dispatch({ type: 'NEXT_STEP' });
  }

  function prevStep() {
    dispatch({ type: 'PREV_STEP' });
  }

  return (
    <BookContext.Provider
      value={{
        step: state.step,
        formData: state.formData,
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
