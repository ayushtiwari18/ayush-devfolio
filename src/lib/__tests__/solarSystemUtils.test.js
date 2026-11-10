import * as solarUtils from '../solarSystemUtils';

describe('solarSystemUtils', () => {
  it('exports planets configuration array with Sun and 8 planets', () => {
    expect(solarUtils.planets).toBeDefined();
    expect(solarUtils.planets.length).toBe(9);
    expect(solarUtils.planets[0].name).toBe('Sun');
    expect(solarUtils.planets[3].name).toBe('Earth');
  });

  it('handles concurrent calls to initThreeJS without race condition crashes', async () => {
    const mockMount1 = {
      clientWidth: 1200,
      clientHeight: 800,
      firstChild: null,
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    };
    const mockMount2 = {
      clientWidth: 1200,
      clientHeight: 800,
      firstChild: null,
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    };

    // Both should either resolve or reject cleanly without "Scene is not a constructor"
    const results = await Promise.allSettled([
      solarUtils.initThreeJS(mockMount1),
      solarUtils.initThreeJS(mockMount2),
    ]);

    for (const res of results) {
      if (res.status === 'rejected') {
        expect(res.reason.message).not.toContain('Scene is not a constructor');
      }
    }
  });
});
