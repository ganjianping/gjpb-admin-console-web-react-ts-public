import React from 'react';
import { HeadingIcon, AlignmentIcon, BulletedIcon, NumberedIcon, QuoteIcon, CodeIcon, ImageIcon, TableIcon, LinkIcon, VideoIcon } from './icons';

export type MenuItem = {
  id: string;
  label: string;
  icon?: React.FC<{ size?: number }>;
  children?: MenuItem[];
};

export const defaultMenuItems: MenuItem[] = [
  {
    id: 'headings',
    label: 'Headings',
    icon: HeadingIcon,
    children: [
      { id: 'heading-1', label: 'Heading 1' },
      { id: 'heading-2', label: 'Heading 2' },
      { id: 'heading-3', label: 'Heading 3' },
      { id: 'heading-4', label: 'Heading 4' },
      { id: 'heading-5', label: 'Heading 5' }
    ],
  },
  {
    id: 'alignment',
    label: 'Alignment',
    icon: AlignmentIcon,
    children: [
      { id: 'align-left', label: 'Align left' },
      { id: 'align-center', label: 'Align center' },
      { id: 'align-right', label: 'Align right' },
      { id: 'align-justify', label: 'Justify' },
    ],
  },
  { id: 'bulleted', label: 'Bulleted list', icon: BulletedIcon },
  { id: 'numbered', label: 'Numbered list', icon: NumberedIcon },
  { id: 'quote', label: 'Quote', icon: QuoteIcon },
  {
    id: 'code',
    label: 'Code block',
    icon: CodeIcon,
    children: [
      { id: 'javascript', label: 'JavaScript' },
      { id: 'typescript', label: 'TypeScript' },
      { id: 'python', label: 'Python' },
      { id: 'java', label: 'Java' },
      { id: 'json', label: 'JSON' },
      { id: 'bash', label: 'Bash' },
      { id: 'html', label: 'HTML' },
      { id: 'markdown', label: 'Markdown' },
      { id: 'go', label: 'Go' },
      { id: 'php', label: 'PHP' },
      { id: 'sql', label: 'SQL' },
      { id: 'xml', label: 'XML' },
    ],
  },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'table', label: 'Table', icon: TableIcon },
  { id: 'link', label: 'Link', icon: LinkIcon },
  { id: 'youtube', label: 'Video', icon: VideoIcon },
];
