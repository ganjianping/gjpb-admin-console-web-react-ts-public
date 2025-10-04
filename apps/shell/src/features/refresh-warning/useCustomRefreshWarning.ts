import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../shared/hooks/useRedux';
import { selectIsAuthenticated, logoutUser } from '../authentication/store/authSlice';

/**
 * Custom hook that provides a confirmation dialog for page refresh/navigation
 */
export const useCustomRefreshWarning = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<'refresh' | 'navigate' | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Handle page refresh and browser close
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Browser's built-in confirmation for refresh/close
      event.preventDefault();
      return 'You are currently logged in. Refreshing or closing this page will log you out.';
    };

    // Handle browser navigation (back/forward buttons)
    const handlePopState = () => {
      if (isAuthenticated) {
        // Prevent the navigation temporarily
        window.history.pushState(null, '', window.location.href);
        setDialogAction('navigate');
        setShowDialog(true);
      }
    };

    // Handle keyboard shortcuts like Ctrl+R, F5, etc.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isAuthenticated) return;

      // Detect common refresh shortcuts
      const isRefresh = (
        (event.ctrlKey && event.key === 'r') || // Ctrl+R
        (event.metaKey && event.key === 'r') || // Cmd+R (Mac)
        event.key === 'F5' || // F5
        (event.ctrlKey && event.shiftKey && event.key === 'R') // Ctrl+Shift+R
      );

      if (isRefresh) {
        event.preventDefault();
        setDialogAction('refresh');
        setShowDialog(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    // Push initial state to handle back button
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthenticated]);

  const handleConfirm = async () => {
    setShowDialog(false);
    
    if (dialogAction === 'refresh') {
      // Logout first, then refresh
      await dispatch(logoutUser());
      window.location.reload();
    } else if (dialogAction === 'navigate') {
      // Logout first, then navigate back
      await dispatch(logoutUser());
      window.history.go(-1);
    }
    
    setDialogAction(null);
  };

  const handleCancel = () => {
    setShowDialog(false);
    setDialogAction(null);
    // Ensure we stay on the current page
    window.history.pushState(null, '', window.location.href);
  };

  const getDialogMessage = () => {
    switch (dialogAction) {
      case 'refresh':
        return 'You are currently logged in. Refreshing this page will log you out and you will need to sign in again.';
      case 'navigate':
        return 'You are currently logged in. Navigating away from this page will log you out and you will need to sign in again.';
      default:
        return 'You are currently logged in. This action will log you out and you will need to sign in again.';
    }
  };

  const getActionButtonText = () => {
    switch (dialogAction) {
      case 'refresh':
        return 'Refresh & Logout';
      case 'navigate':
        return 'Navigate & Logout';
      default:
        return 'Continue & Logout';
    }
  };

  return {
    showDialog,
    dialogMessage: getDialogMessage(),
    actionButtonText: getActionButtonText(),
    onConfirm: handleConfirm,
    onCancel: handleCancel
  };
};

export default useCustomRefreshWarning;