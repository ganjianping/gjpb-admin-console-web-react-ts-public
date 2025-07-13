import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  Alert,
  Box,
  Chip,
  Typography,
  CircularProgress,
  OutlinedInput,
  InputLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Shield, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { User, AccountStatus } from '../../services/userService';
import type { UserFormData, UserActionType } from '../../types/user.types';
import { useRoles } from '../../hooks/useRoles';

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  actionType: UserActionType;
  formData: UserFormData;
  onFormChange: (field: keyof UserFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

const accountStatusOptions: { value: AccountStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'locked', label: 'Locked' },
  { value: 'suspend', label: 'Suspended' },
  { value: 'pending_verification', label: 'Pending Verification' },
];

export const UserDialog = ({
  open,
  onClose,
  user,
  actionType,
  formData,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: UserDialogProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { roles: availableRoles, loading: rolesLoading } = useRoles();

  // No useEffect - we only use cached roles, never make API calls

  if (!actionType) return null;

  const isReadOnly = actionType === 'view';
  const isEdit = actionType === 'edit';
  const isCreate = actionType === 'create';

  const getDialogTitle = () => {
    switch (actionType) {
      case 'view':
        return t('users.actions.viewUser');
      case 'edit':
        return t('users.actions.editUser');
      case 'create':
        return t('users.actions.createUser');
      default:
        return '';
    }
  };

  const handleSubmit = () => {
    if (isReadOnly) {
      onClose();
      return;
    }
    onSubmit();
  };

  const getErrorMessage = (field: string) => {
    const error = formErrors[field];
    console.log(`=== getErrorMessage for field "${field}" ===`);
    console.log('Raw error value:', error);
    console.log('Error type:', typeof error);
    
    let result = '';
    if (Array.isArray(error)) {
      result = error.join(', ');
    } else if (error) {
      result = String(error);
    }
    
    console.log('Final error message:', result);
    console.log('=== End getErrorMessage ===');
    return result;
  };

  const hasError = (field: string) => {
    const error = formErrors[field];
    const hasErrorResult = Boolean(error);
    console.log(`=== hasError for field "${field}" ===`);
    console.log('Raw error value:', error);
    console.log('Boolean result:', hasErrorResult);
    console.log('All formErrors:', formErrors);
    console.log('=== End hasError ===');
    return hasErrorResult;
  };

  const getPasswordHelperText = () => {
    if (hasError('password')) {
      return getErrorMessage('password');
    }
    if (isEdit) {
      return t('users.fields.newPasswordHint');
    }
    return undefined;
  };

  // Get general errors that don't map to specific fields
  const getGeneralErrors = () => {
    const generalErrors = [];
    
    console.log('=== UserDialog getGeneralErrors ===');
    console.log('Current formErrors:', formErrors);
    console.log('formErrors keys:', Object.keys(formErrors));
    
    // Check for contactMethodProvided error
    if (formErrors.contactMethodProvided) {
      console.log('Found contactMethodProvided error:', formErrors.contactMethodProvided);
      generalErrors.push(formErrors.contactMethodProvided);
    }
    
    // Check for general error
    if (formErrors.general) {
      console.log('Found general error:', formErrors.general);
      generalErrors.push(formErrors.general);
    }
    
    // Check for any other general errors that don't have field mapping
    const fieldNames = ['username', 'password', 'nickname', 'email', 'mobileCountryCode', 'mobileNumber', 'accountStatus', 'roleCodes', 'active', 'contactMethodProvided', 'general'];
    Object.keys(formErrors).forEach(key => {
      if (!fieldNames.includes(key)) {
        console.log(`Found unmapped error for key "${key}":`, formErrors[key]);
        generalErrors.push(formErrors[key]);
      }
    });
    
    console.log('Final general errors:', generalErrors);
    console.log('=== End UserDialog getGeneralErrors ===');
    return generalErrors;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <UserIcon size={24} />
        {getDialogTitle()}
      </DialogTitle>
      <DialogContent>
        {isReadOnly ? (
          // View Mode - Clean layout without section titles
          <Box sx={{ py: 2 }}>
            {/* User Information Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
              
              {/* Username */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('users.fields.username')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main' }}>
                  {user?.username || '-'}
                </Typography>
              </Box>

              {/* Nickname */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('users.fields.nickname')}
                </Typography>
                <Typography variant="body1">
                  {user?.nickname || '-'}
                </Typography>
              </Box>

              {/* Email */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('users.fields.email')}
                </Typography>
                <Typography variant="body1">
                  {user?.email || '-'}
                </Typography>
              </Box>

              {/* Mobile */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('users.mobile')}
                </Typography>
                <Typography variant="body1">
                  {user?.mobileNumber && user?.mobileCountryCode 
                    ? `+${user.mobileCountryCode} - ${user.mobileNumber}` 
                    : '-'
                  }
                </Typography>
              </Box>

              {/* Account Status */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('users.fields.accountStatus')}
                </Typography>
                <Chip
                  label={accountStatusOptions.find(opt => opt.value === user?.accountStatus)?.label || user?.accountStatus}
                  size="small"
                  color={user?.accountStatus === 'active' ? 'success' : 'error'}
                />
              </Box>

              {/* Active Status */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('users.fields.active')}
                </Typography>
                <Chip
                  label={user?.active ? t('common.active') : t('common.inactive')}
                  size="small"
                  color={user?.active ? 'success' : 'default'}
                />
              </Box>

              {/* Last Login */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('users.form.lastLoginAt')}
                </Typography>
                <Typography variant="body1">
                  {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '-'}
                </Typography>
              </Box>

              {/* Last Login IP */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('users.form.lastLoginIp')}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {user?.lastLoginIp || '-'}
                </Typography>
              </Box>

              {/* Password Changed At */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('users.form.passwordChangeAt')}
                </Typography>
                <Typography variant="body1">
                  {user?.passwordChangedAt ? new Date(user.passwordChangedAt).toLocaleString() : '-'}
                </Typography>
              </Box>

            </Box>

            {/* Roles - Full width */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                {t('users.fields.roles')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {user?.roles && user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <Chip
                      key={role.code}
                      label={role.code}
                      size="small"
                      variant="outlined"
                      icon={<Shield size={12} />}
                      sx={{ fontFamily: 'monospace' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No roles assigned
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Timestamps - Bottom section */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('users.form.createdAt')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('users.form.updatedAt')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          // Edit/Create Mode - Show form fields
          <Box>
            {/* General Errors */}
            {getGeneralErrors().length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {getGeneralErrors().map((error, index) => (
                  <div key={`error-${index}-${error}`}>{error}</div>
                ))}
              </Alert>
            )}

            {/* Username */}
            <TextField
              label={t('users.fields.username')}
              value={formData.username}
              onChange={(e) => onFormChange('username', e.target.value)}
              fullWidth
              margin="normal"
              error={hasError('username')}
              helperText={getErrorMessage('username')}
            />

            {/* Password - only show in create mode or edit mode */}
            {(isCreate || isEdit) && (
              <Box sx={{ position: 'relative' }}>
                <TextField
                  label={isEdit ? t('users.fields.newPassword') : t('users.fields.password')}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => onFormChange('password', e.target.value)}
                  fullWidth
                  margin="normal"
                  error={hasError('password')}
                  helperText={getPasswordHelperText()}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <Button
                          onClick={() => setShowPassword(!showPassword)}
                          size="small"
                          sx={{ minWidth: 'auto', p: 1 }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      ),
                    }
                  }}
                />
              </Box>
            )}

            {/* Nickname */}
            <TextField
              label={t('users.fields.nickname')}
              value={formData.nickname}
              onChange={(e) => onFormChange('nickname', e.target.value)}
              fullWidth
              margin="normal"
              error={hasError('nickname')}
              helperText={getErrorMessage('nickname')}
            />

            {/* Email */}
            <TextField
              label={t('users.fields.email')}
              value={formData.email}
              onChange={(e) => onFormChange('email', e.target.value)}
              fullWidth
              margin="normal"
              error={hasError('email')}
              helperText={getErrorMessage('email')}
            />

            {/* Mobile Country Code */}
            <TextField
              label={t('users.fields.mobileCountryCode')}
              value={formData.mobileCountryCode}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                onFormChange('mobileCountryCode', value);
              }}
              fullWidth
              margin="normal"
              error={hasError('mobileCountryCode')}
              helperText={getErrorMessage('mobileCountryCode')}
              slotProps={{
                input: {
                  inputMode: 'numeric',
                },
                htmlInput: {
                  pattern: '[0-9]*',
                },
              }}
            />

            {/* Mobile Number */}
            <TextField
              label={t('users.fields.mobileNumber')}
              value={formData.mobileNumber}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                onFormChange('mobileNumber', value);
              }}
              fullWidth
              margin="normal"
              error={hasError('mobileNumber')}
              helperText={getErrorMessage('mobileNumber')}
              slotProps={{
                input: {
                  inputMode: 'numeric',
                },
                htmlInput: {
                  pattern: '[0-9]*',
                },
              }}
            />

            {/* Account Status */}
            <FormControl fullWidth margin="normal">
              <FormLabel>{t('users.fields.accountStatus')}</FormLabel>
              <Select
                value={formData.accountStatus}
                onChange={(e) => onFormChange('accountStatus', e.target.value)}
                error={hasError('accountStatus')}
              >
                {accountStatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Active Status */}
            <FormControl fullWidth margin="normal">
              <FormLabel>{t('users.fields.active')}</FormLabel>
              <Select
                value={formData.active}
                onChange={(e) => onFormChange('active', e.target.value === 'true')}
                error={hasError('active')}
              >
                <MenuItem value="true">{t('common.active')}</MenuItem>
                <MenuItem value="false">{t('common.inactive')}</MenuItem>
              </Select>
            </FormControl>

            {/* Roles */}
            <FormControl fullWidth margin="normal" error={hasError('roleCodes')}>
              <InputLabel id="roles-label">{t('users.fields.roles')}</InputLabel>
              <Select
                labelId="roles-label"
                label={t('users.fields.roles')}
                multiple
                value={formData.roleCodes || []}
                onChange={(e) => {
                  onFormChange('roleCodes', e.target.value as string[]);
                }}
                input={<OutlinedInput label={t('users.fields.roles')} />}
                renderValue={(selected) => {
                  if (!selected || selected.length === 0) {
                    return <Box sx={{ color: 'text.secondary' }}>Select roles...</Box>;
                  }
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const role = availableRoles.find(r => r.code === value);
                        return (
                          <Chip
                            key={value}
                            label={role ? role.name : value}
                            size="small"
                            variant="outlined"
                            icon={<Shield size={12} />}
                          />
                        );
                      })}
                    </Box>
                  );
                }}
                disabled={rolesLoading}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                {rolesLoading && (
                  <MenuItem disabled>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    {t('common.loading')}
                  </MenuItem>
                )}
                {!rolesLoading && availableRoles.length === 0 && (
                  <MenuItem disabled>
                    No roles available
                  </MenuItem>
                )}
                {!rolesLoading && availableRoles.length > 0 && availableRoles.map((role) => (
                  <MenuItem key={role.code} value={role.code}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Shield size={16} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">{role.name}</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'primary.main' }}>
                          {role.code}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {hasError('roleCodes') && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {getErrorMessage('roleCodes')}
                </Typography>
              )}
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {isReadOnly ? t('common.close') : t('common.cancel')}
        </Button>
        {!isReadOnly && (
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
            startIcon={loading && <CircularProgress size={16} />}
          >
            {isCreate ? t('common.create') : t('common.save')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
