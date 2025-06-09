/**
 * MUI Grid Compatibility Layer
 * 
 * This file provides a wrapper for the MUI Grid component that handles
 * compatibility between different MUI versions (especially v5 to v7 migration).
 * 
 * This allows using deprecated 'item' props while providing a compatible API.
 */

import { Grid as MuiGrid } from '@mui/material';
import * as React from 'react';

// Define props interface for our compatibility Grid
interface GridCompatProps {
  item?: boolean; // Handle the deprecated 'item' prop
  container?: boolean;
  xs?: number | string | boolean;
  sm?: number | string | boolean;
  md?: number | string | boolean;
  lg?: number | string | boolean;
  xl?: number | string | boolean;
  spacing?: number;
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;  // Allow any other props to pass through
}

// Create a compatibility wrapper for Grid
const GridCompat = React.forwardRef<HTMLDivElement, GridCompatProps>((props, ref) => {
  // Remove 'item' prop which is no longer needed in MUI v7
  // In v7, a Grid is automatically an item if it's not a container
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { item: _item, ...rest } = props;
  
  // In MUI v7, component prop is required for Grid
  return <MuiGrid ref={ref} component="div" {...rest} />;
});

GridCompat.displayName = 'GridCompat';

export { GridCompat as Grid };
