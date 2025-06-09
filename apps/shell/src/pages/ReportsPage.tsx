import { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Chip, 
  Divider, 
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Alert,
  Tab,
  Tabs
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  RefreshCw, 
  Search,
  Calendar,
  List,
  File
} from 'lucide-react';
import { DatePickerRange } from '../../../shared-lib/src/components/DatePickerRange';
import { Grid } from '../../../shared-lib/src/utils/grid';

// Define DateRange type locally
type DateRange<T = Date> = [T | null, T | null];

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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
      style={{ paddingTop: 20 }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `reports-tab-${index}`,
    'aria-controls': `reports-tabpanel-${index}`,
  };
}

// Sample report types
const REPORT_TYPES = [
  { id: 'user-activity', name: 'User Activity Report' },
  { id: 'content-performance', name: 'Content Performance Report' },
  { id: 'site-analytics', name: 'Site Analytics Report' },
  { id: 'engagement', name: 'User Engagement Report' },
  { id: 'conversion', name: 'Conversion Report' },
];

// Sample report formats
const REPORT_FORMATS = [
  { id: 'pdf', name: 'PDF', icon: File },
  { id: 'csv', name: 'CSV', icon: FileSpreadsheet },
  { id: 'xlsx', name: 'Excel', icon: FileSpreadsheet },
];

// Sample scheduled reports
const SCHEDULED_REPORTS = [
  { 
    id: 1, 
    name: 'Weekly User Activity', 
    type: 'User Activity Report', 
    format: 'PDF', 
    frequency: 'Weekly', 
    lastRun: '2023-09-15', 
    nextRun: '2023-09-22',
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Monthly Analytics Summary', 
    type: 'Site Analytics Report', 
    format: 'Excel', 
    frequency: 'Monthly', 
    lastRun: '2023-09-01', 
    nextRun: '2023-10-01',
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Quarterly Performance Review', 
    type: 'Content Performance Report', 
    format: 'PDF', 
    frequency: 'Quarterly', 
    lastRun: '2023-07-01', 
    nextRun: '2023-10-01',
    status: 'active'
  },
  { 
    id: 4, 
    name: 'Daily Engagement Snapshot', 
    type: 'User Engagement Report', 
    format: 'CSV', 
    frequency: 'Daily', 
    lastRun: '2023-09-21', 
    nextRun: '2023-09-22',
    status: 'paused'
  },
];

// Sample report history
const REPORT_HISTORY = [
  { 
    id: 101, 
    name: 'Weekly User Activity', 
    type: 'User Activity Report', 
    format: 'PDF', 
    generatedDate: '2023-09-15 08:30 AM', 
    size: '1.2 MB',
    status: 'completed'
  },
  { 
    id: 102, 
    name: 'Monthly Analytics Summary', 
    type: 'Site Analytics Report', 
    format: 'Excel', 
    generatedDate: '2023-09-01 07:00 AM', 
    size: '3.5 MB',
    status: 'completed'
  },
  { 
    id: 103, 
    name: 'Content Performance Report', 
    type: 'Content Performance Report', 
    format: 'PDF', 
    generatedDate: '2023-09-10 02:15 PM', 
    size: '2.8 MB',
    status: 'completed'
  },
  { 
    id: 104, 
    name: 'User Engagement Analysis', 
    type: 'User Engagement Report', 
    format: 'CSV', 
    generatedDate: '2023-09-18 10:45 AM', 
    size: '0.9 MB',
    status: 'completed'
  },
  { 
    id: 105, 
    name: 'Custom Analytics Export', 
    type: 'Site Analytics Report', 
    format: 'Excel', 
    generatedDate: '2023-09-20 03:20 PM', 
    size: '4.1 MB',
    status: 'failed'
  },
];

const ReportsPage = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState<DateRange<Date>>([
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    new Date()
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState<boolean | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReportTypeChange = (event: SelectChangeEvent) => {
    setReportType(event.target.value);
  };

  const handleReportFormatChange = (event: SelectChangeEvent) => {
    setReportFormat(event.target.value);
  };

  const handleGenerateReport = () => {
    if (!reportType) return;
    
    setIsGenerating(true);
    setGenerationSuccess(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      // Random success/failure for demonstration
      const success = Math.random() > 0.2;
      setGenerationSuccess(success);
      
      // Clear success/error message after 5 seconds
      setTimeout(() => {
        setGenerationSuccess(null);
      }, 5000);
    }, 2000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('reports.title')}
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="reports tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<FileText size={16} />} 
            iconPosition="start" 
            label={t('reports.generateReport')} 
            {...a11yProps(0)} 
          />
          <Tab 
            icon={<Calendar size={16} />} 
            iconPosition="start" 
            label={t('reports.scheduledReports')} 
            {...a11yProps(1)} 
          />
          <Tab 
            icon={<List size={16} />} 
            iconPosition="start" 
            label={t('reports.reportHistory')} 
            {...a11yProps(2)} 
          />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardHeader 
              title={t('reports.generateNewReport')}
              subheader={t('reports.generateReportDescription')}
            />
            <Divider />
            <CardContent>
              <Grid container component="div" spacing={3}>
                <Grid item component="div" xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="report-type-label">{t('reports.reportType')}</InputLabel>
                    <Select
                      labelId="report-type-label"
                      id="report-type"
                      value={reportType}
                      label={t('reports.reportType')}
                      onChange={handleReportTypeChange}
                    >
                      {REPORT_TYPES.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item component="div" xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="report-format-label">{t('reports.format')}</InputLabel>
                    <Select
                      labelId="report-format-label"
                      id="report-format"
                      value={reportFormat}
                      label={t('reports.format')}
                      onChange={handleReportFormatChange}
                    >
                      {REPORT_FORMATS.map((format) => {
                        const FormatIcon = format.icon;
                        return (
                          <MenuItem key={format.id} value={format.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <FormatIcon size={16} style={{ marginRight: 8 }} />
                              {format.name}
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item component="div" xs={12}>
                  <FormControl fullWidth margin="normal">
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('reports.dateRange')}
                      </Typography>
                      <DatePickerRange 
                        value={dateRange}
                        onChange={(newRange: DateRange<Date>) => setDateRange(newRange)}
                      />
                    </Box>
                  </FormControl>
                </Grid>
                
                <Grid item component="div" xs={12}>
                  <TextField
                    fullWidth
                    id="report-name"
                    label={t('reports.reportName')}
                    variant="outlined"
                    margin="normal"
                    placeholder={t('reports.reportNamePlaceholder')}
                  />
                </Grid>
                
                {generationSuccess === true && (
                  <Grid item component="div" xs={12}>
                    <Alert severity="success">{t('reports.generationSuccess')}</Alert>
                  </Grid>
                )}
                
                {generationSuccess === false && (
                  <Grid item component="div" xs={12}>
                    <Alert severity="error">{t('reports.generationError')}</Alert>
                  </Grid>
                )}
                
                <Grid item component="div" xs={12}>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      sx={{ mr: 2 }}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleGenerateReport}
                      disabled={!reportType || isGenerating}
                      startIcon={isGenerating ? <RefreshCw className="rotating-icon" /> : <FileText />}
                    >
                      {isGenerating ? t('reports.generating') : t('reports.generate')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              placeholder={t('reports.searchReports')}
              size="small"
              InputProps={{
                startAdornment: <Search size={16} style={{ marginRight: 8 }} />,
              }}
            />
            <Button variant="contained" startIcon={<Calendar />}>
              {t('reports.newSchedule')}
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('reports.name')}</TableCell>
                  <TableCell>{t('reports.type')}</TableCell>
                  <TableCell>{t('reports.format')}</TableCell>
                  <TableCell>{t('reports.frequency')}</TableCell>
                  <TableCell>{t('reports.lastRun')}</TableCell>
                  <TableCell>{t('reports.nextRun')}</TableCell>
                  <TableCell>{t('reports.status')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {SCHEDULED_REPORTS.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.format}</TableCell>
                    <TableCell>{report.frequency}</TableCell>
                    <TableCell>{report.lastRun}</TableCell>
                    <TableCell>{report.nextRun}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status} 
                        size="small" 
                        color={report.status === 'active' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" aria-label="edit">
                        <FileText size={16} />
                      </IconButton>
                      <IconButton size="small" aria-label="download">
                        <Download size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <TextField
              placeholder={t('reports.searchHistory')}
              size="small"
              InputProps={{
                startAdornment: <Search size={16} style={{ marginRight: 8 }} />,
              }}
            />
          </Box>
          
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('reports.name')}</TableCell>
                  <TableCell>{t('reports.type')}</TableCell>
                  <TableCell>{t('reports.format')}</TableCell>
                  <TableCell>{t('reports.generatedDate')}</TableCell>
                  <TableCell>{t('reports.size')}</TableCell>
                  <TableCell>{t('reports.status')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {REPORT_HISTORY.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.format}</TableCell>
                    <TableCell>{report.generatedDate}</TableCell>
                    <TableCell>{report.size}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status} 
                        size="small" 
                        color={report.status === 'completed' ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        disabled={report.status !== 'completed'} 
                        aria-label="download report"
                      >
                        <Download size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ReportsPage;
