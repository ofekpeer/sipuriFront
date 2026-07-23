import { bookWizardReducer } from './BookContext';

describe('bookWizardReducer', () => {
  it('moves forward and backward between steps', () => {
    const nextState = bookWizardReducer(
      { step: 1, formData: { child: { name: '' } } },
      { type: 'NEXT_STEP' },
    );

    expect(nextState.step).toBe(2);

    const prevState = bookWizardReducer(nextState, { type: 'PREV_STEP' });

    expect(prevState.step).toBe(1);
  });

  it('updates a nested field correctly', () => {
    const state = bookWizardReducer(
      { step: 1, formData: { child: { name: '' } } },
      {
        type: 'UPDATE_FIELD',
        section: 'child',
        field: 'name',
        value: 'אורי',
      },
    );

    expect(state.formData.child.name).toBe('אורי');
  });
});
