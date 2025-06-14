import React from 'react';
import { useCustomRefreshWarning } from '../hooks/useCustomRefreshWarning';
import { RefreshWarningDialog } from './RefreshWarningDialog';

/**
 * Component that provides automatic refresh/navigation warning for authenticated users
 * Place this component anywhere in your app and it will automatically handle warnings
 */
export const RefreshWarningProvider: React.FC = () => {
  const {
    showDialog,
    dialogMessage,
    actionButtonText,
    onConfirm,
    onCancel
  } = useCustomRefreshWarning();

  return (
    <RefreshWarningDialog
      open={showDialog}
      onConfirm={onConfirm}
      onCancel={onCancel}
      message={dialogMessage}
      actionButtonText={actionButtonText}
    />
  );
};

export default RefreshWarningProvider;
