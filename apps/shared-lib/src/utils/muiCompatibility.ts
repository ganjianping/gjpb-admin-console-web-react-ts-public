/**
 * MUI Compatibility Layer
 * 
 * This file provides utilities and wrappers to handle compatibility issues
 * between different MUI versions (especially v5 to v7 migration).
 */

import { Grid as MuiGrid, type GridProps as MuiGridProps } from '@mui/material';
import * as React from 'react';

// Custom Grid type that accepts both old and new API
export interface GridProps extends Omit<MuiGridProps, 'item'> {
  // Allow 'item' prop for backwards compatibility
  item?: boolean;
}

// Enhanced Grid component that handles compatibility automatically
// Use function approach to avoid JSX in .ts file
export function createGrid(props: GridProps, ref: React.Ref<HTMLDivElement>) {
  // Filter out the 'item' prop which is no longer needed in v7
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { item: _item, ...rest } = props;
  
  // Use createElement instead of JSX
  return React.createElement(MuiGrid, { ref, ...rest });
}

// Create the forwardRef component
export const Grid = React.forwardRef(createGrid);
