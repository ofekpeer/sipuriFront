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

  it('replaces the submission id when the draft changes', () => {
    const state = bookWizardReducer(
      {
        step: 2,
        submissionId: 'old-request',
        formData: { story: { type: '' } },
      },
      {
        type: 'UPDATE_FIELD',
        section: 'story',
        field: 'type',
        value: 'space',
        submissionId: 'new-request',
      },
    );

    expect(state.submissionId).toBe('new-request');
    expect(state.formData.story.type).toBe('space');
  });

  it('allows returning directly to a review section', () => {
    const state = bookWizardReducer(
      { step: 5, formData: {} },
      { type: 'SET_STEP', step: 2 },
    );

    expect(state.step).toBe(2);
  });
});
