// Simplified Login Form - Better balance of organization vs complexity
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Box, 
  TextField, 
  Button,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  FormHelperText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Eye, EyeOff, User, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LoginCredentials } from '../../../../shared-lib/src/features/api/auth-service';

// Schema definitions
const schemas = {
  username: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
  email: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
  mobile: z.object({
    mobileCountryCode: z.string().regex(/^\d+$/, 'Country code must contain only digits'),
    mobileNumber: z.string().regex(/^\d+$/, 'Mobile number must contain only digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
};

type FormData = {
  username: z.infer<typeof schemas.username>;
  email: z.infer<typeof schemas.email>;
  mobile: z.infer<typeof schemas.mobile>;
};

// Shared styles
const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: 'background.paper',
    '& fieldset': { borderColor: 'divider' },
    '&:hover fieldset': { borderColor: 'primary.main' },
    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': {
    color: 'text.secondary',
    '&.Mui-focused': { color: 'primary.main' },
  },
};

const tabStyles = {
  '& .MuiTab-root': {
    textTransform: 'none' as const,
    fontWeight: 500,
    fontSize: '0.9rem',
    color: 'text.secondary',
    '&.Mui-selected': { color: 'primary.main', fontWeight: 600 },
  },
  '& .MuiTabs-indicator': { height: 2, borderRadius: 1 },
};

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`login-tabpanel-${index}`}
    aria-labelledby={`login-tab-${index}`}
    {...other}
    style={{ animation: value === index ? 'fadeIn 0.3s ease-in-out' : 'none' }}
  >
    {value === index && <Box sx={{ pt: 0.75 }}>{children}</Box>}
  </div>
);

// Password Field Component
interface PasswordFieldProps {
  name: string;
  control: any;
  showPassword: boolean;
  onTogglePassword: () => void;
  disabled?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  name, control, showPassword, onTogglePassword, disabled = false
}) => {
  const { t } = useTranslation();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          type={showPassword ? 'text' : 'password'}
          label={t('login.form.password', 'Password')}
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          disabled={disabled}
          sx={fieldStyles}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onTogglePassword}
                    edge="end"
                    sx={{ color: 'text.secondary' }}
                    disabled={disabled}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
};

// Main Component
interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => Promise<void>;
  error?: string | null;
  submitText?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error, submitText }) => {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Forms for each login method
  const forms = {
    username: useForm<FormData['username']>({
      resolver: zodResolver(schemas.username),
      defaultValues: { username: '', password: '' },
    }),
    email: useForm<FormData['email']>({
      resolver: zodResolver(schemas.email),
      defaultValues: { email: '', password: '' },
    }),
    mobile: useForm<FormData['mobile']>({
      resolver: zodResolver(schemas.mobile),
      defaultValues: { mobileCountryCode: '65', mobileNumber: '', password: '' },
    }),
  };
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabIndex(newValue);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  // Generic submit handler
  const createSubmitHandler = <T,>(): SubmitHandler<T> => 
    async (data) => {
      setIsLoading(true);
      try {
        await onSubmit(data as LoginCredentials);
      } finally {
        setIsLoading(false);
      }
    };
  
  const getButtonText = () => 
    isLoading ? <CircularProgress size={24} /> : (submitText ?? t('login.form.submit', 'Login'));

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, borderRadius: 2, backgroundColor: 'error.light',
            color: 'error.contrastText', '& .MuiAlert-icon': { color: 'error.main' },
          }}
        >
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" sx={tabStyles}>
          <Tab label={t('login.tabs.username', 'Username')} />
          <Tab label={t('login.tabs.email', 'Email')} />
          <Tab label={t('login.tabs.mobile', 'Mobile')} />
        </Tabs>
      </Box>
      
      {/* Username Tab */}
      <TabPanel value={tabIndex} index={0}>
        <form onSubmit={forms.username.handleSubmit(createSubmitHandler())}>
          <Controller
            name="username"
            control={forms.username.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t('login.form.username', 'Username')}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isLoading}
                sx={fieldStyles}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={20} style={{ color: 'currentColor', opacity: 0.7 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
          <PasswordField
            name="password"
            control={forms.username.control}
            showPassword={showPassword}
            onTogglePassword={toggleShowPassword}
            disabled={isLoading}
          />
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
              {getButtonText()}
            </Button>
          </Box>
        </form>
      </TabPanel>
      
      {/* Email Tab */}
      <TabPanel value={tabIndex} index={1}>
        <form onSubmit={forms.email.handleSubmit(createSubmitHandler())}>
          <Controller
            name="email"
            control={forms.email.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t('login.form.email', 'Email')}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={isLoading}
                sx={fieldStyles}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} style={{ color: 'currentColor', opacity: 0.7 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
          <PasswordField
            name="password"
            control={forms.email.control}
            showPassword={showPassword}
            onTogglePassword={toggleShowPassword}
            disabled={isLoading}
          />
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
              {getButtonText()}
            </Button>
          </Box>
        </form>
      </TabPanel>
      
      {/* Mobile Tab */}
      <TabPanel value={tabIndex} index={2}>
        <form onSubmit={forms.mobile.handleSubmit(createSubmitHandler())}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Controller
              name="mobileCountryCode"
              control={forms.mobile.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('login.form.countryCode', 'Code')}
                  variant="outlined"
                  sx={{ width: '30%', ...fieldStyles }}
                  margin="normal"
                  error={!!fieldState.error}
                  disabled={isLoading}
                />
              )}
            />
            <Controller
              name="mobileNumber"
              control={forms.mobile.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('login.form.mobileNumber', 'Mobile Number')}
                  variant="outlined"
                  sx={{ width: '70%', ...fieldStyles }}
                  margin="normal"
                  error={!!fieldState.error}
                  disabled={isLoading}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone size={20} style={{ color: 'currentColor', opacity: 0.7 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Box>
          {(forms.mobile.formState.errors.mobileCountryCode || forms.mobile.formState.errors.mobileNumber) && (
            <FormHelperText error>
              {forms.mobile.formState.errors.mobileCountryCode?.message ?? 
               forms.mobile.formState.errors.mobileNumber?.message}
            </FormHelperText>
          )}
          <PasswordField
            name="password"
            control={forms.mobile.control}
            showPassword={showPassword}
            onTogglePassword={toggleShowPassword}
            disabled={isLoading}
          />
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
              {getButtonText()}
            </Button>
          </Box>
        </form>
      </TabPanel>
    </Box>
  );
};

export default LoginForm;
