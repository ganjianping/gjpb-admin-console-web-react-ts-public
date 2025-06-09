import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

interface AppLoadingProps {
  message?: string;
}

const AppLoading = ({ message = 'Loading application...' }: AppLoadingProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: theme.palette.grey[50],
        color: theme.palette.text.secondary,
        gap: 2,
      }}
    >
      <CircularProgress 
        size={50}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
        }}
      />
      <Typography 
        variant="body1" 
        sx={{ 
          fontFamily: theme.typography.fontFamily,
          fontSize: '16px',
          textAlign: 'center',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export { AppLoading };
export default AppLoading;
