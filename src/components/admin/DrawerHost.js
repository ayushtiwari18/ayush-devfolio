'use client';

import React from 'react';
import { useAdminMode } from '@/context/AdminModeContext';
import HeroInspector from './inspectors/HeroInspector';
import ExperienceInspector from './inspectors/ExperienceInspector';
import EducationInspector from './inspectors/EducationInspector';

export default function DrawerHost() {
  const { activeDrawer, closeDrawer } = useAdminMode();

  if (!activeDrawer) return null;

  switch (activeDrawer.id) {
    case 'hero':
      return <HeroInspector initialData={activeDrawer.data} onClose={closeDrawer} />;
    case 'experience':
      return <ExperienceInspector onClose={closeDrawer} />;
    case 'education':
      return <EducationInspector onClose={closeDrawer} />;
    default:
      return null;
  }
}
