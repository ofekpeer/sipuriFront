import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';

const BookContext = createContext();
const DRAFT_KEY = 'sipuri.bookDraft.v2';

function createSubmissionId() {
  return window.crypto?.randomUUID?.()
    || `book-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createInitialFormData() {
  return {
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
}

function createInitialState() {
  return {
    step: 1,
    formData: createInitialFormData(),
    submissionId: createSubmissionId(),
  };
}

function restoreDraft() {
  if (typeof window === 'undefined') return createInitialState();

  try {
    const savedDraft = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
    if (!savedDraft?.formData) return createInitialState();

    const initial = createInitialState();
    return {
      step: Math.min(Math.max(Number(savedDraft.step) || 1, 1), 5),
      submissionId: savedDraft.submissionId || initial.submissionId,
      formData: {
        child: {
          ...initial.formData.child,
          ...savedDraft.formData.child,
          image: null,
        },
        story: {
          ...initial.formData.story,
          ...savedDraft.formData.story,
        },
        design: {
          ...initial.formData.design,
          ...savedDraft.formData.design,
        },
      },
    };
  } catch (_) {
    return createInitialState();
  }
}

export function bookWizardReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        submissionId: action.submissionId || state.submissionId,
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

    case 'SET_STEP':
      return {
        ...state,
        step: Math.min(Math.max(Number(action.step) || 1, 1), 5),
      };

    case 'RESET':
      return action.state || createInitialState();

    default:
      return state;
  }
}

export function BookProvider({ children }) {
  const [state, dispatch] = useReducer(
    bookWizardReducer,
    undefined,
    restoreDraft,
  );

  useEffect(() => {
    const serializableState = {
      ...state,
      formData: {
        ...state.formData,
        child: {
          ...state.formData.child,
          image: null,
        },
      },
    };

    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(serializableState));
    } catch (_) {
      // The wizard still works when browser storage is unavailable.
    }
  }, [state]);

  function updateField(section, field, value) {
    dispatch({
      type: 'UPDATE_FIELD',
      section,
      field,
      value,
      submissionId: createSubmissionId(),
    });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    updateField(section, field, value);
  }

  function resetBook() {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch (_) {
      // Nothing else is required when browser storage is unavailable.
    }
    dispatch({ type: 'RESET', state: createInitialState() });
  }

  function nextStep() {
    dispatch({ type: 'NEXT_STEP' });
  }

  function prevStep() {
    dispatch({ type: 'PREV_STEP' });
  }

  function goToStep(step) {
    dispatch({ type: 'SET_STEP', step });
  }

  return (
    <BookContext.Provider
      value={{
        step: state.step,
        formData: state.formData,
        submissionId: state.submissionId,
        updateField,
        handleInputChange,
        nextStep,
        prevStep,
        goToStep,
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
