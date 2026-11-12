import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import HeroInspector from '../inspectors/HeroInspector';
import { useAdminMode } from '@/context/AdminModeContext';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ refresh: jest.fn() }),
}));

// Mock AdminModeContext
jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

describe('HeroInspector Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    // Mock fetch for GET and PATCH /api/admin/profile
    global.fetch = jest.fn((url, options) => {
      if (options?.method === 'PATCH') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 'test-profile-id',
            name: 'Ayush Tiwari',
            title: 'Full Stack Engineer',
            description: 'Building systems',
            about_location: 'Jabalpur, IN',
            about_availability: 'Open for work',
            rolling_texts: ['Systems', 'Next.js'],
          }),
      });
    });
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

  it('renders with profile initial data and allows editing fields', async () => {
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();

    useAdminMode.mockReturnValue({
      showToast: mockShowToast,
    });

    const initialData = {
      id: 'test-profile-id',
      name: 'Ayush Tiwari',
      title: 'Full Stack Engineer',
      description: 'Building systems',
      about_location: 'Jabalpur, IN',
      about_availability: 'Open for work',
      rolling_texts: ['Systems', 'Next.js'],
    };

    await act(async () => {
      root.render(<HeroInspector initialData={initialData} onClose={mockClose} />);
    });

    expect(container.textContent).toContain('Hero & Profile Section');
    expect(container.textContent).toContain('Systems');
    expect(container.textContent).toContain('Next.js');

    // Test removing a tag
    const removeBtn = container.querySelector('button[title="Remove Systems"]');
    expect(removeBtn).toBeTruthy();
    await act(async () => {
      removeBtn.click();
    });
    expect(container.textContent).not.toContain('Systems');
    expect(container.textContent).toContain('Next.js');

    // Test clicking Save Hero Section
    const saveBtn = container.querySelector('button.bg-primary');
    expect(saveBtn).toBeTruthy();

    await act(async () => {
      saveBtn.click();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/admin/profile',
      expect.objectContaining({
        method: 'PATCH',
      })
    );
    expect(mockShowToast).toHaveBeenCalledWith('Hero section updated successfully', 'success');
    expect(mockClose).toHaveBeenCalled();
  });
});
