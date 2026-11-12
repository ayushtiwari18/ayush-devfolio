import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import EditableSection from '../EditableSection';
import { useAdminMode } from '@/context/AdminModeContext';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock AdminModeContext hook
jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

describe('EditableSection Component', () => {
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

  it('renders clean children with no edit badges when editMode is false', async () => {
    useAdminMode.mockReturnValue({
      editMode: false,
      openDrawer: jest.fn(),
    });

    await act(async () => {
      root.render(
        <EditableSection title="Hero" drawerId="hero">
          <div data-testid="child-content">Hero Content</div>
        </EditableSection>
      );
    });

    expect(container.textContent).toContain('Hero Content');
    expect(container.querySelector('button[aria-label="Edit Hero"]')).toBeNull();
  });

  it('renders floating edit badge and triggers openDrawer when editMode is true', async () => {
    const mockOpenDrawer = jest.fn();
    useAdminMode.mockReturnValue({
      editMode: true,
      openDrawer: mockOpenDrawer,
    });

    const sampleData = { headline: 'Hello world' };

    await act(async () => {
      root.render(
        <EditableSection
          title="Hero & Profile"
          drawerId="hero"
          drawerData={sampleData}
          className="custom-class"
        >
          <div data-testid="child-content">Hero Content</div>
        </EditableSection>
      );
    });

    expect(container.textContent).toContain('Hero Content');
    const editBtn = container.querySelector('button[aria-label="Edit Hero & Profile"]');
    expect(editBtn).toBeTruthy();
    expect(editBtn.textContent).toContain('Edit Hero & Profile');

    // Click the button
    await act(async () => {
      editBtn.click();
    });

    expect(mockOpenDrawer).toHaveBeenCalledWith('hero', sampleData);
  });
});
