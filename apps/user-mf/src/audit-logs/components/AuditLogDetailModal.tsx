import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Chip,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';
import { X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { AuditLogEntry } from '../types';

interface AuditLogDetailModalProps {
  open: boolean;
  log: AuditLogEntry | null;
  onClose: () => void;
}

export const AuditLogDetailModal: React.FC<AuditLogDetailModalProps> = ({
  open,
  log,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!log) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="audit-log-details-title"
      aria-describedby="audit-log-details-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', sm: '80vw', md: '70vw', lg: '60vw' },
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            id="audit-log-details-title"
            variant="h5"
            component="h2"
            sx={{ fontWeight: 600 }}
          >
            {t('auditLogs.details.title')}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <X size={24} />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.id')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                {log.id}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.userId')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {log.userId || '-'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.username')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {log.username || 'System'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.httpMethod')}
              </Typography>
              <Chip 
                label={log.httpMethod} 
                size="small" 
                variant="outlined"
                sx={{ mt: 0.5 }}
              />
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.endpoint')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                {log.endpoint || '-'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.requestId')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                {log.requestId || '-'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.result')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {log.result || '-'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.statusCode')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {log.statusCode}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.errorMessage')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {log.errorMessage || 'null'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.ipAddress')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {log.ipAddress || '-'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.sessionId')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {log.sessionId || '-'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.duration')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {log.durationMs || '-'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.timestamp')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {format(parseISO(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
              </Typography>
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('auditLogs.details.userAgent')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                {log.userAgent || '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
