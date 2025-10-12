import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Image as LucideImage } from 'lucide-react';

const ImagePageHeader = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <LucideImage size={32} />
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {t('images.pageTitle')}
      </Typography>
    </Box>
  );
};

export default ImagePageHeader;
