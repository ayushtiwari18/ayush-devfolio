import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Contact from '../Contact';
import { submitContactForm } from '@/app/actions/contact';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@/app/actions/contact', () => ({
  submitContactForm: jest.fn(),
}));

function setNativeValue(element, value) {
  const valueSetter = Object.getOwnPropertyDescriptor(element.__proto__, 'value')?.set
    || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value')?.set;
  if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('Contact Section Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root.unmount();
      });
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    jest.clearAllMocks();
  });

  it('renders contact form fields, intent pills, and submit button', async () => {
    await act(async () => {
      root.render(<Contact />);
    });

    expect(container.textContent).toContain('Start a Conversation');
    expect(container.textContent).toContain('🚀 Full-Stack Web App');
    expect(container.querySelector('input#name')).not.toBeNull();
    expect(container.querySelector('input#email')).not.toBeNull();
    expect(container.querySelector('textarea#message')).not.toBeNull();
    expect(container.querySelector('button[type="submit"]')).not.toBeNull();
  });

  it('updates message prefix when selecting an intent pill', async () => {
    await act(async () => {
      root.render(<Contact />);
    });

    const cloudPill = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('AWS Cloud Architecture')
    );
    expect(cloudPill).toBeTruthy();

    await act(async () => {
      cloudPill.click();
    });

    const textarea = container.querySelector('textarea#message');
    expect(textarea.value).toContain('AWS cloud infrastructure');
  });

  it('dispatches submitContactForm Server Action on submit and displays success message', async () => {
    submitContactForm.mockResolvedValue({
      success: true,
      message: 'Message delivered successfully!',
    });

    await act(async () => {
      root.render(<Contact />);
    });

    const nameInput = container.querySelector('input#name');
    const emailInput = container.querySelector('input#email');
    const messageInput = container.querySelector('textarea#message');

    await act(async () => {
      setNativeValue(nameInput, 'Jordan Lee');
      setNativeValue(emailInput, 'jordan@enterprise.io');
      setNativeValue(messageInput, 'Interested in full-stack architecture contract.');
    });

    const form = container.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(submitContactForm).toHaveBeenCalledWith({
      name: 'Jordan Lee',
      email: 'jordan@enterprise.io',
      subject: 'Portfolio Collaboration Inquiry',
      message: 'Interested in full-stack architecture contract.',
    });

    expect(container.textContent).toContain('Message Delivered!');
  });

  it('displays inline error banner when submitContactForm returns failure', async () => {
    submitContactForm.mockResolvedValue({
      success: false,
      message: 'Spam filter triggered. Please try again.',
    });

    await act(async () => {
      root.render(<Contact />);
    });

    const nameInput = container.querySelector('input#name');
    const emailInput = container.querySelector('input#email');
    const messageInput = container.querySelector('textarea#message');

    await act(async () => {
      nameInput.value = 'Test User';
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
      emailInput.value = 'test@example.com';
      emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      messageInput.value = 'Test message content.';
      messageInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const form = container.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Spam filter triggered. Please try again.');
  });
});
