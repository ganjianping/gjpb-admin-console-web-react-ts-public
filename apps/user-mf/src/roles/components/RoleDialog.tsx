import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Shield, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RoleDialogContent } from './RoleDialogContent';
import type { Role } from '../types/role.types';
import type { RoleActionType, RoleFormData } from '../types/role-dialog.types';

interface RoleDialogProps {
  open: boolean;
  actionType: RoleActionType;
  selectedRole: Role | null;
  formData: RoleFormData;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (field: keyof Role, value: any) => void;
  hasError: (field: string) => boolean;
  getErrorMessage: (field: string) => string;
  getGeneralErrors: () => (string | string[])[];
  dialogErrorMessage: string;
}

export const RoleDialog: React.FC<RoleDialogProps> = React.memo(({
  open,
  actionType,
  selectedRole,
  formData,
  onClose,
  onSave,
  onFormChange,
  hasError,
  getErrorMessage,
  getGeneralErrors,
  dialogErrorMessage,
}) => {
  const { t } = useTranslation();

  // Debug dialog state changes
  useEffect(() => {
    console.log('🔍 Dialog state changed:', { open, actionType });
  }, [open, actionType]);

  const getDialogTitle = () => {
    switch (actionType) {
      case 'view': return t('roles.viewRole');
      case 'edit': return t('roles.editRole');
      case 'create': return t('roles.createRole');
      case 'delete': return t('roles.deleteRole');
      default: return '';
    }
  };

  const getDialogSubtitle = () => {
    if (actionType === 'view') return t('roles.form.viewRoleDetails');
    if (actionType === 'edit') return t('roles.form.modifyRoleInfo');
    if (actionType === 'delete') return t('roles.form.confirmDeletion');
    return t('roles.form.addNewRole');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={actionType === 'delete' ? 'sm' : 'md'} 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
          }
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid', 
        borderColor: 'divider', 
        pb: 2,
        background: actionType === 'delete' 
          ? 'linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%)'
          : 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              backgroundColor: actionType === 'delete' ? 'error.main' : 'primary.main',
              color: actionType === 'delete' ? 'error.contrastText' : 'primary.contrastText',
              display: 'inline-flex'
            }}
          >
            {actionType === 'delete' ? <AlertTriangle size={24} /> : <Shield size={24} />}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {getDialogTitle()}
            </Typography>
            {selectedRole && (
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                {getDialogSubtitle()}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {actionType === 'delete' ? (
          <Box sx={{ p: 4 }}>
            <DialogContentText sx={{ 
              fontSize: '1.1rem', 
              color: 'text.primary',
              textAlign: 'center',
              mb: 2
            }}>
              {t('roles.deleteConfirmation', { roleName: selectedRole?.name }) || 
               `Are you sure you want to delete role "${selectedRole?.name}"?`}
            </DialogContentText>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ textAlign: 'center' }}
            >
              {t('roles.actionCannotBeUndone') || 'This action cannot be undone.'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 4 }}>
            <RoleDialogContent
              actionType={actionType}
              formData={formData}
              onFormChange={onFormChange}
              hasError={hasError}
              getErrorMessage={getErrorMessage}
              getGeneralErrors={getGeneralErrors}
              dialogErrorMessage={dialogErrorMessage}
            />
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button 
          onClick={onClose} 
          size="large"
          sx={{ 
            minWidth: 100, 
            py: 1,
            px: 2 
          }}
        >
          {t('common.close') || 'Close'}
        </Button>
        
        {actionType === 'delete' && (
          <Button 
            variant="contained" 
            color="error" 
            size="large"
            onClick={onSave}
            sx={{ 
              minWidth: 100, 
              py: 1,
              px: 2 
            }}
          >
            {t('common.delete') || 'Delete'}
          </Button>
        )}
        
        {(actionType === 'edit' || actionType === 'create') && (
          <Button 
            variant="contained" 
            size="large"
            onClick={onSave}
            sx={{ 
              minWidth: 100, 
              py: 1,
              px: 2 
            }}
          >
            {t('common.save') || 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
});

RoleDialog.displayName = 'RoleDialog';
