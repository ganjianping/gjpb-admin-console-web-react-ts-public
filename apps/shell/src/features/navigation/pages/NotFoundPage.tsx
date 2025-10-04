import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
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
          {/* 404 Error Icon or Image */}
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '6rem', md: '8rem' },
              fontWeight: 700,
              color: 'primary.main',
              mb: 2,
            }}
          >
            404
          </Typography>
          
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {t('errors.notFound')}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            paragraph
            sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
          >
            {t('errors.pageNotFoundMessage')}
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

export default NotFoundPage;