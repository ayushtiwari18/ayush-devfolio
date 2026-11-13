import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import CertificationsClient from '../CertificationsClient';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@/context/AdminModeContext', () => ({
  useAdminMode: jest.fn(),
}));

jest.mock('@/lib/storage', () => ({
  uploadImage: jest.fn().mockResolvedValue({
    url: 'https://example.com/uploaded-badge.png',
    error: null,
  }),
}));

const mockUpdate = jest.fn().mockReturnValue({
  eq: jest.fn().mockResolvedValue({ data: null, error: null }),
});
const mockInsert = jest.fn().mockReturnValue({
  select: jest.fn().mockReturnValue({
    single: jest.fn().mockResolvedValue({
      data: {
        id: 'cert-new-999',
        title: 'Google Professional Cloud Architect',
        issuer: 'Google Cloud',
        category: 'Cloud',
        date: '2025-02',
        published: true,
      },
      error: null,
    }),
  }),
});
const mockDelete = jest.fn().mockReturnValue({
  eq: jest.fn().mockResolvedValue({ data: null, error: null }),
});

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      update: (...args) => mockUpdate(...args),
      insert: (...args) => mockInsert(...args),
      delete: (...args) => mockDelete(...args),
    }),
  },
}));

const sampleCertifications = [
  {
    id: 'cert-1',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    category: 'Cloud',
    date: '2024-05',
    credential_id: 'AWS-CCP-1001',
    description: 'Foundational understanding of AWS Cloud services and security.',
    image: 'https://images.example.com/aws.png',
    url: 'https://credly.com/aws-ccp',
    verification_url: 'https://credly.com/verify/aws-ccp',
    published: true,
  },
  {
    id: 'cert-2',
    title: 'Oracle Certified Java Associate',
    issuer: 'Oracle',
    category: 'Software Engineering',
    date: '2023-11',
    credential_id: 'ORA-JAVA-2002',
    description: 'Fundamental Java SE programming concepts and data structures.',
    image: 'https://images.example.com/oracle.png',
    published: false,
  },
];

describe('CertificationsClient Component', () => {
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

  it('renders certifications in public view mode when user is not admin', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: false,
      editMode: false,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(<CertificationsClient certifications={sampleCertifications} />);
    });

    expect(container.textContent).toContain('AWS Certified Cloud Practitioner');
    expect(container.textContent).toContain('Amazon Web Services');
    expect(container.textContent).toContain('Oracle Certified Java Associate');
    expect(container.textContent).not.toContain('+ Add New Certificate');
    expect(container.querySelector('button[aria-label="Edit Certificate"]')).toBeFalsy();
  });

  it('opens detail modal when a card is clicked in view mode', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: false,
      editMode: false,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(<CertificationsClient certifications={sampleCertifications} />);
    });

    const firstCard = container.querySelector('.grid button');
    expect(firstCard).toBeTruthy();

    await act(async () => {
      firstCard.click();
    });

    expect(container.textContent).toContain('Credential ID');
    expect(container.textContent).toContain('AWS-CCP-1001');
    expect(container.textContent).toContain('View Credential');

    // Close modal
    const closeBtn = container.querySelector('button[aria-label="Close modal"]');
    expect(closeBtn).toBeTruthy();

    await act(async () => {
      closeBtn.click();
    });

    expect(container.querySelector('button[aria-label="Close modal"]')).toBeFalsy();
  });

  it('renders inline administrative controls and "+ Add New Certificate" in Edit Mode', async () => {
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: jest.fn(),
    });

    await act(async () => {
      root.render(<CertificationsClient certifications={sampleCertifications} />);
    });

    expect(container.textContent).toContain('+ Add New Certificate');
    const editBtns = container.querySelectorAll('button[aria-label="Edit Certificate"]');
    expect(editBtns.length).toBe(2);

    const togglePubBtns = container.querySelectorAll('button[aria-label="Toggle Published"]');
    expect(togglePubBtns.length).toBe(2);
  });

  it('toggles published status on a card and updates Supabase', async () => {
    const mockShowToast = jest.fn();
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<CertificationsClient certifications={sampleCertifications} />);
    });

    const togglePubBtn = container.querySelector('button[aria-label="Toggle Published"]');
    expect(togglePubBtn).toBeTruthy();

    await act(async () => {
      togglePubBtn.click();
    });

    expect(mockUpdate).toHaveBeenCalledWith({ published: false });
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('marked as Draft'),
      'success'
    );
  });

  it('switches card to inline editor and saves updated fields', async () => {
    const mockShowToast = jest.fn();
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<CertificationsClient certifications={sampleCertifications} />);
    });

    const editBtn = container.querySelector('button[aria-label="Edit Certificate"]');
    expect(editBtn).toBeTruthy();

    // Start inline editing
    await act(async () => {
      editBtn.click();
    });

    expect(container.textContent).toContain('Inline Card Editor');
    expect(container.textContent).toContain('Credential Title *');

    // Edit title
    const titleInput = container.querySelector('input[placeholder*="AWS Certified"]');
    expect(titleInput).toBeTruthy();

    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(titleInput, 'AWS Certified Solutions Architect Associate');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Save changes
    const saveBtn = container.querySelector('button[aria-label="Save"]');
    expect(saveBtn).toBeTruthy();

    await act(async () => {
      saveBtn.click();
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'AWS Certified Solutions Architect Associate',
      })
    );
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('saved successfully!'),
      'success'
    );
  });

  it('creates a new certificate inline via the placeholder form', async () => {
    const mockShowToast = jest.fn();
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: mockShowToast,
    });

    await act(async () => {
      root.render(<CertificationsClient certifications={sampleCertifications} />);
    });

    const addBtn = container.querySelector('button[aria-label="Add New Certificate"]');
    expect(addBtn).toBeTruthy();

    // Expand placeholder into form
    await act(async () => {
      addBtn.click();
    });

    expect(container.textContent).toContain('New Certificate Form');

    const titleInput = container.querySelector('input[placeholder*="AWS Certified Cloud"]');
    const issuerInput = container.querySelector('input[placeholder*="Amazon Web Services"]');

    expect(titleInput).toBeTruthy();
    expect(issuerInput).toBeTruthy();

    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(titleInput, 'Google Professional Cloud Architect');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeSetter.call(issuerInput, 'Google Cloud');
      issuerInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const createBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Create Certificate')
    );
    expect(createBtn).toBeTruthy();

    await act(async () => {
      createBtn.click();
    });

    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        title: 'Google Professional Cloud Architect',
        issuer: 'Google Cloud',
      }),
    ]);
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('created successfully!'),
      'success'
    );
    expect(container.textContent).toContain('Google Professional Cloud Architect');
  });

  it('deletes a certificate from the card', async () => {
    const mockShowToast = jest.fn();
    useAdminMode.mockReturnValue({
      isAdmin: true,
      editMode: true,
      showToast: mockShowToast,
    });

    // Mock window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    await act(async () => {
      root.render(<CertificationsClient certifications={sampleCertifications} />);
    });

    const deleteBtn = container.querySelector('button[aria-label="Delete Certificate"]');
    expect(deleteBtn).toBeTruthy();

    await act(async () => {
      deleteBtn.click();
    });

    expect(mockDelete).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('removed.'),
      'success'
    );
    expect(container.textContent).not.toContain('AWS-CCP-1001');

    confirmSpy.mockRestore();
  });
});
