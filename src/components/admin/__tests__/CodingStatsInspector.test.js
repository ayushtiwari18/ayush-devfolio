import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import CodingStatsInspector from '../inspectors/CodingStatsInspector';
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

describe('CodingStatsInspector Component', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

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
            id: 'stats-row-1',
            total_problems: 885,
            total_contests: 35,
            total_badges: 11,
            max_streak: '250',
            leetcode_username: '_aayush03',
            leetcode_display: true,
            leetcode_solved: 550,
            leetcode_rating: 1657,
            codechef_username: 'ayushtiwari10',
            codechef_display: true,
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

  it('renders overall telemetry and saves updates', async () => {
    const mockShowToast = jest.fn();
    const mockClose = jest.fn();

    useAdminMode.mockReturnValue({
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<CodingStatsInspector onClose={mockClose} />);
    });

    expect(container.textContent).toContain('Coding Stats & Telemetry');
    expect(container.textContent).toContain('Total Problems Solved');
    expect(container.textContent).toContain('Contests Fought');

    // Click Save Coding Stats
    const saveBtn = container.querySelector('[data-testid="save-drawer-btn"]');
    expect(saveBtn).toBeTruthy();

    await act(async () => {
      saveBtn.click();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/admin/status',
      expect.objectContaining({
        method: 'PATCH',
        body: expect.stringContaining('"total_problems":885'),
      })
    );
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('updated successfully'),
      'success'
    );
    expect(mockClose).toHaveBeenCalled();
  });

  it('switches to LeetCode tab and displays fields', async () => {
    useAdminMode.mockReturnValue({ showToast: jest.fn() });

    await act(async () => {
      root.render(<CodingStatsInspector onClose={jest.fn()} />);
    });

    const lcTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('LeetCode')
    );
    expect(lcTab).toBeTruthy();

    await act(async () => {
      lcTab.click();
    });

    expect(container.textContent).toContain('LeetCode Telemetry Card');
    expect(container.textContent).toContain('LeetCode Username');
    expect(container.textContent).toContain('Contest Rating');
  });
});
