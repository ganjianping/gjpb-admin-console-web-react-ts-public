import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Box, 
  TextField, 
  Button,
  Typography, 
  Paper,
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
import type { LoginCredentials } from '../../../shared-lib/src/services/auth-service';

// Login method tabs
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Tab props
function a11yProps(index: number) {
  return {
    id: `login-tab-${index}`,
    'aria-controls': `login-tabpanel-${index}`,
  };
}

// Schema for username login
const usernameSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for email login
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for mobile login
const mobileSchema = z.object({
  mobileCountryCode: z.string().regex(/^\d+$/, 'Country code must contain only digits'),
  mobileNumber: z.string().regex(/^\d+$/, 'Mobile number must contain only digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type UsernameFormInputs = z.infer<typeof usernameSchema>;
type EmailFormInputs = z.infer<typeof emailSchema>;
type MobileFormInputs = z.infer<typeof mobileSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => Promise<void>;
  error?: string | null;
  submitText?: string; // Optional prop for the submit button text
}

const LoginForm = ({ onSubmit, error, submitText }: LoginFormProps) => {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Forms for each login method
  const usernameForm = useForm<UsernameFormInputs>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: '', password: '' },
  });
  
  const emailForm = useForm<EmailFormInputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '', password: '' },
  });
  
  const mobileForm = useForm<MobileFormInputs>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobileCountryCode: '65', mobileNumber: '', password: '' },
  });
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  
  // Handle login form submission
  const handleUsernameLogin: SubmitHandler<UsernameFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEmailLogin: SubmitHandler<EmailFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMobileLogin: SubmitHandler<MobileFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  // Get button text - simplified approach without safeTranslate
  const getButtonText = () => {
    return isLoading ? <CircularProgress size={24} /> : (submitText || t('login.form.submit', 'Login'));
  };
  
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        {t('login.title', 'Login to GJPB Admin Console')}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="login methods" centered>
          <Tab label={t('login.tabs.username', 'Username')} {...a11yProps(0)} />
          <Tab label={t('login.tabs.email', 'Email')} {...a11yProps(1)} />
          <Tab label={t('login.tabs.mobile', 'Mobile')} {...a11yProps(2)} />
        </Tabs>
      </Box>
      
      {/* Username login tab */}
      <TabPanel value={tabIndex} index={0}>
        <form onSubmit={usernameForm.handleSubmit(handleUsernameLogin)}>
          <Controller
            name="username"
            control={usernameForm.control}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          
          <Controller
            name="password"
            control={usernameForm.control}
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
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {getButtonText()}
            </Button>
          </Box>
          
          <Box textAlign="right">
            <Typography variant="body2" color="textSecondary">
              <a href="#forgot-password">
                {t('login.form.forgotPassword', 'Forgot password?')}
              </a>
            </Typography>
          </Box>
        </form>
      </TabPanel>
      
      {/* Email login tab */}
      <TabPanel value={tabIndex} index={1}>
        <form onSubmit={emailForm.handleSubmit(handleEmailLogin)}>
          <Controller
            name="email"
            control={emailForm.control}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          
          <Controller
            name="password"
            control={emailForm.control}
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
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {getButtonText()}
            </Button>
          </Box>
          
          <Box textAlign="right">
            <Typography variant="body2" color="textSecondary">
              <a href="#forgot-password">
                {t('login.form.forgotPassword', 'Forgot password?')}
              </a>
            </Typography>
          </Box>
        </form>
      </TabPanel>
      
      {/* Mobile login tab */}
      <TabPanel value={tabIndex} index={2}>
        <form onSubmit={mobileForm.handleSubmit(handleMobileLogin)}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Controller
              name="mobileCountryCode"
              control={mobileForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('login.form.countryCode', 'Code')}
                  variant="outlined"
                  sx={{ width: '30%' }}
                  margin="normal"
                  error={!!fieldState.error}
                  disabled={isLoading}
                />
              )}
            />
            
            <Controller
              name="mobileNumber"
              control={mobileForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('login.form.mobileNumber', 'Mobile Number')}
                  variant="outlined"
                  sx={{ width: '70%' }}
                  margin="normal"
                  error={!!fieldState.error}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>
          
          {(mobileForm.formState.errors.mobileCountryCode || mobileForm.formState.errors.mobileNumber) && (
            <FormHelperText error>
              {mobileForm.formState.errors.mobileCountryCode?.message || mobileForm.formState.errors.mobileNumber?.message}
            </FormHelperText>
          )}
          
          <Controller
            name="password"
            control={mobileForm.control}
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
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {getButtonText()}
            </Button>
          </Box>
          
          <Box textAlign="right">
            <Typography variant="body2" color="textSecondary">
              <a href="#forgot-password">
                {t('login.form.forgotPassword', 'Forgot password?')}
              </a>
            </Typography>
          </Box>
        </form>
      </TabPanel>
    </Paper>
  );
};

export default LoginForm;
