import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { Grid } from '../../../shared-lib/src/utils/grid';
import {
  Plus,
  Files,
  FileText,
  FileArchive,
  FileCog,
  Search,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Firebase Analytics
import { trackPageView } from '../utils/firebaseAnalytics';

// Redux
import { useAppDispatch } from '../hooks/useRedux';
import { setPageTitle } from '../redux/slices/uiSlice';

// Components
import DocumentForm from '../components/DocumentForm';

// Tab panel interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`documents-tabpanel-${index}`}
      aria-labelledby={`documents-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `documents-tab-${index}`,
    'aria-controls': `documents-tabpanel-${index}`,
  };
}

// Mock documents data
const mockDocuments = [
  {
    id: '1',
    title: 'Annual Financial Report 2025',
    type: 'report',
    status: 'published',
    createdAt: '2025-05-15T14:30:00Z',
    createdBy: 'admin@example.com',
  },
  {
    id: '2',
    title: 'Employee Handbook',
    type: 'policy',
    status: 'published',
    createdAt: '2025-04-10T09:15:00Z',
    createdBy: 'hr@example.com',
  },
  {
    id: '3',
    title: 'Vendor Agreement Template',
    type: 'contract',
    status: 'draft',
    createdAt: '2025-05-20T11:45:00Z',
    createdBy: 'legal@example.com',
  },
  {
    id: '4',
    title: 'Q2 2025 Marketing Expense Report',
    type: 'invoice',
    status: 'pending',
    createdAt: '2025-05-18T16:20:00Z',
    createdBy: 'marketing@example.com',
  },
  {
    id: '5',
    title: 'Data Protection Policy',
    type: 'policy',
    status: 'archived',
    createdAt: '2024-11-05T10:30:00Z',
    createdBy: 'compliance@example.com',
  },
];

const DocumentsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Set page title
  useEffect(() => {
    dispatch(setPageTitle(t('navigation.documents')));
    
    // Track page view for analytics
    trackPageView('Documents', t('navigation.documents'));
  }, [dispatch, t]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Toggle create form
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Page heading */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('navigation.documents')}
        </Typography>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={toggleCreateForm}
        >
          {showCreateForm ? t('common.cancel') : t('navigation.createDocument')}
        </Button>
      </Box>

      {/* Create document form */}
      {showCreateForm && (
        <Box sx={{ mb: 4 }}>
          <DocumentForm />
        </Box>
      )}

      {/* Documents tabs */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="document tabs"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                py: 2,
                minHeight: 48,
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Files size={18} />
                  <span>{t('documents.allDocuments')}</span>
                </Box>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileText size={18} />
                  <span>{t('documents.myDocuments')}</span>
                </Box>
              }
              {...a11yProps(1)}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileCog size={18} />
                  <span>{t('documents.pendingReview')}</span>
                </Box>
              }
              {...a11yProps(2)}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileArchive size={18} />
                  <span>{t('documents.archived')}</span>
                </Box>
              }
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 2 }}>
          <Grid container component="div" spacing={2} alignItems="center">
            <Grid item component="div" xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                }}
              >
                <Search size={18} style={{ marginRight: 8 }} />
                <input
                  type="text"
                  placeholder={t('documents.searchDocuments')}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    background: 'transparent',
                    color: 'inherit',
                    fontSize: '16px',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* All Documents Tab */}
        <TabPanel value={tabIndex} index={0}>
          <Grid container component="div" spacing={3}>
            {mockDocuments.map((doc) => (
              <Grid item component="div" xs={12} md={6} lg={4} key={doc.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: theme.shadows[3],
                      borderColor: 'primary.main',
                      cursor: 'pointer',
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box
                      sx={{
                        color: 'primary.main',
                        bgcolor: 'primary.lighter',
                        p: 1,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FileText size={20} />
                    </Box>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'medium',
                        textTransform: 'uppercase',
                        ...getStatusStyle(doc.status),
                      }}
                    >
                      {doc.status}
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {doc.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      textTransform: 'capitalize',
                    }}
                  >
                    {doc.type}
                  </Typography>

                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(doc.createdAt).toLocaleDateString()} by {doc.createdBy}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* My Documents Tab */}
        <TabPanel value={tabIndex} index={1}>
          <Typography>Your documents will appear here.</Typography>
        </TabPanel>

        {/* Pending Review Tab */}
        <TabPanel value={tabIndex} index={2}>
          <Typography>Documents pending review will appear here.</Typography>
        </TabPanel>

        {/* Archived Tab */}
        <TabPanel value={tabIndex} index={3}>
          <Typography>Archived documents will appear here.</Typography>
        </TabPanel>
      </Card>
    </Box>
  );
};

// Helper function to get status styles
function getStatusStyle(status: string) {
  switch (status) {
    case 'draft':
      return {
        bgcolor: 'grey.100',
        color: 'grey.700',
      };
    case 'pending':
      return {
        bgcolor: 'warning.lighter',
        color: 'warning.main',
      };
    case 'published':
      return {
        bgcolor: 'success.lighter',
        color: 'success.main',
      };
    case 'archived':
      return {
        bgcolor: 'info.lighter',
        color: 'info.main',
      };
    default:
      return {
        bgcolor: 'grey.100',
        color: 'grey.700',
      };
  }
}

export default DocumentsPage;
