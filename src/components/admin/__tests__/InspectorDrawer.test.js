import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import InspectorDrawer from '../InspectorDrawer';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('InspectorDrawer Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
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

  it('renders drawer header, content, and buttons when isOpen is true', async () => {
    const mockClose = jest.fn();
    const mockSave = jest.fn();

    await act(async () => {
      root.render(
        <InspectorDrawer
          isOpen={true}
          title="Edit Section Test"
          description="Test description"
          onClose={mockClose}
          onSave={mockSave}
          saveLabel="Save Test"
        >
          <div data-testid="drawer-body">Drawer Form Body</div>
        </InspectorDrawer>
      );
    });

    expect(container.textContent).toContain('Edit Section Test');
    expect(container.textContent).toContain('Test description');
    expect(container.textContent).toContain('Drawer Form Body');
    expect(container.textContent).toContain('Save Test');

    // Test clicking close button
    const closeBtn = container.querySelector('button[aria-label="Close drawer"]');
    expect(closeBtn).toBeTruthy();
    await act(async () => {
      closeBtn.click();
    });
    expect(mockClose).toHaveBeenCalled();

    // Test clicking save button
    const saveBtn = container.querySelector('button.bg-primary');
    expect(saveBtn).toBeTruthy();
    await act(async () => {
      saveBtn.click();
    });
    expect(mockSave).toHaveBeenCalled();
  });

  it('handles Escape key to close the drawer', async () => {
    const mockClose = jest.fn();

    await act(async () => {
      root.render(
        <InspectorDrawer
          isOpen={true}
          title="Escape Test"
          onClose={mockClose}
        >
          <div>Content</div>
        </InspectorDrawer>
      );
    });

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(mockClose).toHaveBeenCalled();
  });

  it('renders nothing when isOpen is false', async () => {
    await act(async () => {
      root.render(
        <InspectorDrawer
          isOpen={false}
          title="Closed Test"
        >
          <div>Hidden</div>
        </InspectorDrawer>
      );
    });

    expect(container.innerHTML).toBe('');
  });
});
