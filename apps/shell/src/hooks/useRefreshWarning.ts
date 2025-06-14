import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './useRedux';
import { selectIsAuthenticated, logoutUser } from '../redux/slices/authSlice';

/**
 * Hook to warn users about page refresh when authenticated
 * Shows a browser confirmation dialog before refreshing/closing the page
 * This is a simpler version that uses browser's native confirmation
 */
export const useRefreshWarning = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only show warning if user is authenticated
    if (!isAuthenticated) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Show browser's built-in confirmation dialog
      event.preventDefault();
      
      // Modern browsers show a generic message, but we still need to prevent default
      // The browser will show its own confirmation dialog with a message like:
      // "Changes you made may not be saved"
      const confirmationMessage = 'You are currently logged in. Refreshing or leaving this page will log you out.';
      
      // Return the message for older browsers that still support custom messages
      return confirmationMessage;
    };

    // Handle navigation events that we can intercept
    const handleKeyDown = (event: KeyboardEvent) => {
      // Detect common refresh shortcuts
      const isRefresh = (
        (event.ctrlKey && event.key === 'r') || // Ctrl+R
        (event.metaKey && event.key === 'r') || // Cmd+R (Mac)
        event.key === 'F5' || // F5
        (event.ctrlKey && event.shiftKey && event.key === 'R') // Ctrl+Shift+R
      );

      if (isRefresh) {
        const confirmed = window.confirm(
          'You are currently logged in. Refreshing this page will log you out and you will need to sign in again.\n\nDo you want to continue?'
        );
        
        if (confirmed) {
          // User confirmed, logout first then refresh
          dispatch(logoutUser()).then(() => {
            window.location.reload();
          });
        }
        
        // Prevent the default refresh in either case
        event.preventDefault();
      }
    };

    // Handle browser back/forward buttons
    const handlePopState = () => {
      if (isAuthenticated) {
        const confirmed = window.confirm(
          'You are currently logged in. Navigating away from this page will log you out and you will need to sign in again.\n\nDo you want to continue?'
        );
        
        if (confirmed) {
          // User confirmed, logout first then navigate
          dispatch(logoutUser()).then(() => {
            window.history.go(-1);
          });
        } else {
          // User cancelled, stay on current page
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    // Push initial state to handle back button
    window.history.pushState(null, '', window.location.href);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated, dispatch]);
};

export default useRefreshWarning;
