import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UnauthorizedPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            py: 5,
            px: 2,
          }}
        >
          {/* Unauthorized Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: '50%',
                bgcolor: 'error.light',
                color: 'error.main',
                display: 'inline-flex',
              }}
            >
              <ShieldAlert size={60} />
            </Box>
          </Box>
          
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
            }}
          >
            {t('errors.unauthorized')}
          </Typography>
          
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom
            color="text.secondary"
          >
            {t('errors.unauthorizedTitle')}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            paragraph
            sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
          >
            {t('errors.unauthorizedMessage')}
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="outlined"
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              {t('common.goBack')}
            </Button>
            
            <Button 
              variant="contained"
              startIcon={<Home size={18} />}
              onClick={() => navigate('/')}
            >
              {t('common.goHome')}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default UnauthorizedPage;