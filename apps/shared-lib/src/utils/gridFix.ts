/**
 * Utility for fixing MUI v7 Grid component issues
 * 
 * This file re-exports the Grid component from our compatibility layer.
 * This prevents JSX usage in .ts files that would cause TypeScript errors.
 */
import { Grid } from './grid';

// Re-export the compatible Grid component
export { Grid };
