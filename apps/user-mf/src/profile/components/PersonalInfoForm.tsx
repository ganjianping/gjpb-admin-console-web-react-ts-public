import React from 'react';
import { TextField, Button, Box, Grid, useTheme } from '@mui/material';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { User, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ProfileFormData } from '../types/profile.types';

interface PersonalInfoFormProps {
  form: UseFormReturn<ProfileFormData>;
  isUpdating: boolean;
  onSubmit: (data: ProfileFormData) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = React.memo(({ 
  form, 
  isUpdating, 
  onSubmit 
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Grid container component="div" spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="nickname"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t('profile.form.nickname')}
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <User size={18} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                    ),
                  },
                }}
              />
            )}
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t('profile.form.email')}
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <Mail size={18} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                    ),
                  },
                }}
              />
            )}
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name="mobileCountryCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t('profile.form.countryCode')}
                placeholder="1"
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 9 }}>
          <Controller
            name="mobileNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t('profile.form.mobileNumber')}
                variant="outlined"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <Phone size={18} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                    ),
                  },
                }}
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
              disabled={!form.formState.isDirty || form.formState.isSubmitting || isUpdating}
              sx={{ py: 1, px: 4 }}
            >
              {isUpdating ? t('common.saving') : t('common.save')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
});

PersonalInfoForm.displayName = 'PersonalInfoForm';
