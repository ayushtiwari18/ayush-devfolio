'use client';

import React from 'react';
import { useAdminMode } from '@/context/AdminModeContext';
import HeroInspector from './inspectors/HeroInspector';
import AboutInspector from './inspectors/AboutInspector';
import ExperienceInspector from './inspectors/ExperienceInspector';
import EducationInspector from './inspectors/EducationInspector';
import ProjectInspector from './inspectors/ProjectInspector';
import BlogInspector from './inspectors/BlogInspector';
import MessagesDrawer from './inspectors/MessagesDrawer';
import SettingsDrawer from './inspectors/SettingsDrawer';

export default function DrawerHost() {
  const { activeDrawer, closeDrawer } = useAdminMode();

  if (!activeDrawer) return null;

  switch (activeDrawer.id) {
    case 'hero':
      return <HeroInspector initialData={activeDrawer.data} onClose={closeDrawer} />;
    case 'about':
      return <AboutInspector initialData={activeDrawer.data} onClose={closeDrawer} />;
    case 'settings':
      return <SettingsDrawer onClose={closeDrawer} />;
    case 'experience':
      return <ExperienceInspector onClose={closeDrawer} />;
    case 'education':
      return <EducationInspector onClose={closeDrawer} />;
    case 'project-new':
      return <ProjectInspector mode="new" onClose={closeDrawer} />;
    case 'project-edit':
      return <ProjectInspector mode="edit" project={activeDrawer.data} onClose={closeDrawer} />;
    case 'blog-new':
      return <BlogInspector mode="new" onClose={closeDrawer} />;
    case 'blog-edit':
      return <BlogInspector mode="edit" post={activeDrawer.data} onClose={closeDrawer} />;
    case 'messages':
      return <MessagesDrawer onClose={closeDrawer} />;
    default:
      return null;
  }
}
