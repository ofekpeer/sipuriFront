import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Book from './Book';

const mockFlipNext = jest.fn();
const mockFlipPrev = jest.fn();
const mockPageFlipApi = {
  getState: jest.fn(() => 'read'),
  flipNext: mockFlipNext,
  flipPrev: mockFlipPrev,
};

jest.mock('react-pageflip', () => {
  const ReactModule = require('react');
  return ReactModule.forwardRef((props, ref) => {
    ReactModule.useImperativeHandle(ref, () => ({
      pageFlip: () => mockPageFlipApi,
    }));
    return (
      <div className={props.className} style={props.style} data-testid="flipbook">
        {props.children}
      </div>
    );
  });
});

jest.mock('../CoverPage', () => {
  const ReactModule = require('react');
  return ReactModule.forwardRef((_props, ref) => <div ref={ref}>cover</div>);
});

jest.mock('../StoryPage', () => {
  const ReactModule = require('react');
  return ReactModule.forwardRef((_props, ref) => <div ref={ref}>page</div>);
});

jest.mock('../EndingPage', () => {
  const ReactModule = require('react');
  return ReactModule.forwardRef((_props, ref) => <div ref={ref}>ending</div>);
});

jest.mock('../PaywallPage', () => {
  const ReactModule = require('react');
  return ReactModule.forwardRef((_props, ref) => <div ref={ref}>paywall</div>);
});

jest.mock('./BookScene', () => ({ children }) => <div>{children}</div>);
jest.mock('./BookShell', () => ({ children }) => <div>{children}</div>);

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}

    disconnect() {}
  };
});

beforeEach(() => {
  mockFlipNext.mockClear();
  mockFlipPrev.mockClear();
  mockPageFlipApi.getState.mockReturnValue('read');
});

test('isolates the flip engine from the global RTL layout and keeps navigation working', () => {
  const book = {
    _id: 'book-1',
    title: 'הספר שלי',
    summary: 'תקציר',
    moral: 'מוסר השכל',
    child: { name: 'נועה' },
    cover: { imageUrl: '/cover.jpg' },
    pages: [
      { page: 1, text: 'עמוד ראשון', imageUrl: '/1.jpg' },
      { page: 2, text: 'עמוד שני', imageUrl: '/2.jpg' },
    ],
    isPurchased: false,
  };

  const { container, getByTestId } = render(<Book book={book} />);

  expect(getByTestId('flipbook').style.direction).toBe('ltr');
  fireEvent.click(container.querySelector('.nav-button--next'));
  expect(mockFlipNext).toHaveBeenCalledTimes(1);

  mockPageFlipApi.getState.mockReturnValue('flipping');
  fireEvent.click(container.querySelector('.nav-button--next'));
  expect(mockFlipNext).toHaveBeenCalledTimes(1);
});
