'use client';

import React from 'react';
import { useAdminMode } from '@/context/AdminModeContext';
import HeroInspector from './inspectors/HeroInspector';

export default function DrawerHost() {
  const { activeDrawer, closeDrawer } = useAdminMode();

  if (!activeDrawer) return null;

  switch (activeDrawer.id) {
    case 'hero':
      return <HeroInspector initialData={activeDrawer.data} onClose={closeDrawer} />;
    default:
      return null;
  }
}
