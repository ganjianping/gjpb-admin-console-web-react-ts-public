import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Role } from '../types/role.types';
import type { RoleActionType, RoleFormData } from '../types/role-dialog.types';

interface RoleDialogContentProps {
  actionType: RoleActionType;
  formData: RoleFormData;
  onFormChange: (field: keyof Role, value: any) => void;
  hasError: (field: string) => boolean;
  getErrorMessage: (field: string) => string;
  getGeneralErrors: () => (string | string[])[];
  dialogErrorMessage: string;
}

export const RoleDialogContent: React.FC<RoleDialogContentProps> = React.memo(({
  actionType,
  formData,
  onFormChange,
  hasError,
  getErrorMessage,
  getGeneralErrors,
  dialogErrorMessage,
}) => {
  const { t } = useTranslation();

  if (actionType === 'view') {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
            {t('roles.form.roleName') || 'Role Name'}:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
            {formData.name || '-'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 0.2 }}>
            {t('roles.form.description') || 'Description'}:
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.5 }}>
            {formData.description || '-'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 0.5 }}>
            {t('roles.form.roleCode') || 'Role Code'}:
          </Typography>
          <Chip 
            label={formData.code || '-'} 
            size="small" 
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
            {t('roles.form.level') || 'Level'}:
          </Typography>
          <Chip 
            label={`Level ${formData.level ?? 0}`} 
            size="small" 
            color="primary"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
            {t('roles.form.systemRole') || 'System Role'}:
          </Typography>
          <Chip 
            label={formData.systemRole ? 'System Role' : 'Custom Role'} 
            size="small" 
            color={formData.systemRole ? 'error' : 'default'}
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
            {t('roles.form.activeStatus') || 'Active Status'}:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={formData.status === 'active' ? 'Active' : 'Inactive'} 
              size="medium" 
              color={formData.status === 'active' ? 'success' : 'default'}
              sx={{ fontWeight: 500 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {formData.status === 'active' ? '(Available for assignment)' : '(Not available for assignment)'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
            ID:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
            {formData.id || '-'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
            {t('roles.form.sortOrder') || 'Sort Order'}:
          </Typography>
          <Chip 
            label={formData.sortOrder || 0} 
            size="small" 
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
            {t('roles.form.parentRole') || 'Parent Role'}:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
            {formData.parentRoleId || '-'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
            {t('common.createdAt') || 'Created At'}:
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {formData.createdAt ? new Date(formData.createdAt).toLocaleString() : '-'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
            {t('common.updatedAt') || 'Updated At'}:
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : '-'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
            {t('common.createdBy') || 'Created By'}:
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {formData.createdBy || '-'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
            {t('common.updatedBy') || 'Updated By'}:
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {formData.updatedBy || '-'}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Edit/Create Mode
  return (
    <Box>
      {/* Dialog Error Message */}
      {dialogErrorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {dialogErrorMessage}
        </Alert>
      )}
      
      {/* General Errors */}
      {getGeneralErrors().length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getGeneralErrors().map((error, index) => (
            <div key={`error-${index}-${error}`}>{error}</div>
          ))}
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 1 }}>
          {t('roles.form.roleName') || 'Role Name'}:
        </Typography>
        <Box sx={{ flex: 1, ml: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={formData.name ?? ''}
            onChange={(e) => onFormChange('name', e.target.value)}
            required
            variant="outlined"
            error={hasError('name')}
            helperText={getErrorMessage('name')}
            sx={{ 
              '& .MuiInputBase-root': { 
                backgroundColor: 'white'
              }
            }}
          />
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 1 }}>
          {t('roles.form.description') || 'Description'}:
        </Typography>
        <Box sx={{ flex: 1, ml: 2 }}>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={3}
            value={formData.description ?? ''}
            onChange={(e) => onFormChange('description', e.target.value)}
            variant="outlined"
            error={hasError('description')}
            helperText={getErrorMessage('description')}
            sx={{ 
              '& .MuiInputBase-root': { 
                backgroundColor: 'white'
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 1 }}>
          {t('roles.form.roleCode') || 'Role Code'}:
        </Typography>
        <Box sx={{ flex: 1, ml: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={formData.code ?? ''}
            onChange={(e) => onFormChange('code', e.target.value)}
            required
            variant="outlined"
            error={hasError('code')}
            helperText={getErrorMessage('code')}
            sx={{ 
              '& .MuiInputBase-root': { 
                backgroundColor: 'white'
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 1 }}>
          {t('roles.form.level') || 'Level'}:
        </Typography>
        <Box sx={{ flex: 1, ml: 2 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={formData.level ?? 0}
            onChange={(e) => onFormChange('level', parseInt(e.target.value) || 0)}
            required
            variant="outlined"
            error={hasError('level')}
            helperText={getErrorMessage('level')}
            slotProps={{ htmlInput: { min: 0, max: 10 } }}
            sx={{ 
              '& .MuiInputBase-root': { 
                backgroundColor: 'white'
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 1 }}>
          {t('roles.form.sortOrder') || 'Sort Order'}:
        </Typography>
        <Box sx={{ flex: 1, ml: 2 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={formData.sortOrder ?? 0}
            onChange={(e) => onFormChange('sortOrder', parseInt(e.target.value) || 0)}
            variant="outlined"
            error={hasError('sortOrder')}
            helperText={getErrorMessage('sortOrder')}
            slotProps={{ htmlInput: { min: 0 } }}
            sx={{ 
              '& .MuiInputBase-root': { 
                backgroundColor: 'white'
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 1 }}>
          {t('roles.form.parentRole') || 'Parent Role'}:
        </Typography>
        <Box sx={{ flex: 1, ml: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={formData.parentRoleId ?? ''}
            onChange={(e) => onFormChange('parentRoleId', e.target.value || null)}
            variant="outlined"
            placeholder="Enter parent role ID (optional)"
            error={hasError('parentRoleId')}
            helperText={getErrorMessage('parentRoleId')}
            sx={{ 
              '& .MuiInputBase-root': { 
                backgroundColor: 'white'
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
          {t('roles.form.systemRole') || 'System Role'}:
        </Typography>
        <Box sx={{ flex: 1, ml: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.systemRole ?? false}
                onChange={(e) => onFormChange('systemRole', e.target.checked)}
                color="error"
              />
            }
            label={
              <Box sx={{ ml: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formData.systemRole ? 'System Role' : 'Custom Role'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {formData.systemRole ? 'Built-in system role' : 'User-defined custom role'}
                </Typography>
              </Box>
            }
            sx={{ m: 0 }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
          {t('roles.form.activeStatus') || 'Active Status'}:
        </Typography>
        <Box sx={{ flex: 1, ml: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.status === 'active'}
                onChange={(e) => onFormChange('status', e.target.checked ? 'active' : 'inactive')}
                color="primary"
              />
            }
            label={
              <Box sx={{ ml: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formData.status === 'active' ? 'Active' : 'Inactive'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {formData.status === 'active' ? 'Available for assignment' : 'Not available for assignment'}
                </Typography>
              </Box>
            }
            sx={{ m: 0 }}
          />
        </Box>
      </Box>
    </Box>
  );
});

RoleDialogContent.displayName = 'RoleDialogContent';
