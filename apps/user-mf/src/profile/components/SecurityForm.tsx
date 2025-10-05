import React from 'react';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { PasswordFormData } from '../types/profile.types';

interface SecurityFormProps {
  form: UseFormReturn<PasswordFormData>;
  isChanging: boolean;
  onSubmit: (data: PasswordFormData) => void;
}

export const SecurityForm: React.FC<SecurityFormProps> = React.memo(({ 
  form, 
  isChanging, 
  onSubmit 
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Grid container component="div" spacing={3}>
        <Grid size={12}>
          <Typography variant="h6" gutterBottom>
            {t('profile.changePassword')}
          </Typography>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="password"
                label={t('profile.form.currentPassword')}
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}></Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="password"
                label={t('profile.form.newPassword')}
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="password"
                label={t('profile.form.confirmPassword')}
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!form.formState.isDirty || form.formState.isSubmitting || isChanging}
              sx={{ py: 1, px: 4 }}
            >
              {isChanging ? t('common.updating') : t('profile.updatePassword')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
});

SecurityForm.displayName = 'SecurityForm';
