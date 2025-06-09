import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Tab, 
  Tabs, 
  Paper, 
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import { Grid } from '../../../shared-lib/src/utils/grid';
import type { SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
// Define DateRange type here instead of importing from date-fns
type DateRange<T = Date> = [T | null, T | null];
import { DatePickerRange } from '../../../shared-lib/src/components/DatePickerRange';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
      style={{ paddingTop: 20 }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `analytics-tab-${index}`,
    'aria-controls': `analytics-tabpanel-${index}`,
  };
}

const AnalyticsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange<Date>>([
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    new Date()
  ]);
  const [timeframe, setTimeframe] = useState('week');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeframeChange = (event: SelectChangeEvent) => {
    setTimeframe(event.target.value);
  };

  // Line chart data - User Activity
  const userActivityData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: t('analytics.activeUsers'),
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
        tension: 0.3
      },
      {
        label: t('analytics.newUsers'),
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: theme.palette.secondary.main,
        backgroundColor: alpha(theme.palette.secondary.main, 0.5),
        tension: 0.3
      }
    ]
  };

  // Bar chart data - Content Performance
  const contentData: ChartData<'bar'> = {
    labels: [t('analytics.articles'), t('analytics.videos'), t('analytics.podcasts'), t('analytics.documents'), t('analytics.presentations')],
    datasets: [
      {
        label: t('analytics.views'),
        data: [4215, 5312, 2341, 3890, 2987],
        backgroundColor: alpha(theme.palette.primary.main, 0.7),
      },
      {
        label: t('analytics.engagement'),
        data: [2100, 3200, 1200, 1600, 1400],
        backgroundColor: alpha(theme.palette.secondary.main, 0.7),
      }
    ]
  };

  // Pie chart - Traffic Source
  const trafficData: ChartData<'pie'> = {
    labels: [
      t('analytics.direct'), 
      t('analytics.search'), 
      t('analytics.social'), 
      t('analytics.email'), 
      t('analytics.referral')
    ],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('analytics.userActivityTitle')
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('analytics.contentPerformanceTitle')
      }
    }
  };

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: t('analytics.trafficSourceTitle')
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('analytics.title')}
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <DatePickerRange 
          value={dateRange}
          onChange={(newRange: DateRange<Date>) => setDateRange(newRange)}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="timeframe-select-label">{t('analytics.timeframe')}</InputLabel>
          <Select
            labelId="timeframe-select-label"
            id="timeframe-select"
            value={timeframe}
            label={t('analytics.timeframe')}
            onChange={handleTimeframeChange}
          >
            <MenuItem value="day">{t('analytics.daily')}</MenuItem>
            <MenuItem value="week">{t('analytics.weekly')}</MenuItem>
            <MenuItem value="month">{t('analytics.monthly')}</MenuItem>
            <MenuItem value="quarter">{t('analytics.quarterly')}</MenuItem>
            <MenuItem value="year">{t('analytics.yearly')}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Grid container component="div" spacing={3} sx={{ mb: 3 }}>
        <Grid item component="div" xs={12} md={4}>
          <StatsCard 
            title={t('analytics.totalUsers')}
            value="12,543"
            change="+12.3%"
            isPositive={true}
          />
        </Grid>
        <Grid item component="div" xs={12} md={4}>
          <StatsCard 
            title={t('analytics.totalViews')}
            value="152,890"
            change="+5.8%"
            isPositive={true}
          />
        </Grid>
        <Grid item component="div" xs={12} md={4}>
          <StatsCard 
            title={t('analytics.conversionRate')}
            value="3.2%"
            change="-0.5%"
            isPositive={false}
          />
        </Grid>
      </Grid>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="analytics tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={t('analytics.overview')} {...a11yProps(0)} />
          <Tab label={t('analytics.users')} {...a11yProps(1)} />
          <Tab label={t('analytics.content')} {...a11yProps(2)} />
          <Tab label={t('analytics.traffic')} {...a11yProps(3)} />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container component="div" spacing={3}>
            <Grid item component="div" xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ height: 300 }}>
                    <Line options={lineOptions} data={userActivityData} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item component="div" xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ height: 300 }}>
                    <Pie options={pieOptions} data={trafficData} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item component="div" xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ height: 400 }}>
                    <Bar options={barOptions} data={contentData} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Grid container component="div" spacing={3}>
            <Grid item component="div" xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ height: 400 }}>
                    <Line options={{
                      ...lineOptions,
                      plugins: {
                        ...lineOptions.plugins,
                        title: {
                          ...lineOptions.plugins?.title,
                          text: t('analytics.userGrowthTitle')
                        }
                      }
                    }} data={userActivityData} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item component="div" xs={12} md={6}>
              <StatsCard 
                title={t('analytics.avgSessionDuration')}
                value="2m 35s"
                change="+0.8%"
                isPositive={true}
              />
            </Grid>
            <Grid item component="div" xs={12} md={6}>
              <StatsCard 
                title={t('analytics.bounceRate')}
                value="42.3%"
                change="-3.1%"
                isPositive={true}
              />
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Grid container component="div" spacing={3}>
            <Grid item component="div" xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ height: 400 }}>
                    <Bar options={barOptions} data={contentData} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item component="div" xs={12} md={6}>
              <StatsCard 
                title={t('analytics.mostViewedContent')}
                value="Product Roadmap 2023"
                change="+1,234 views"
                isPositive={true}
              />
            </Grid>
            <Grid item component="div" xs={12} md={6}>
              <StatsCard 
                title={t('analytics.avgTimeOnPage')}
                value="1m 47s"
                change="+0.3%"
                isPositive={true}
              />
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Grid container component="div" spacing={3}>
            <Grid item component="div" xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ height: 400 }}>
                    <Pie options={pieOptions} data={trafficData} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item component="div" xs={12} md={6}>
              <Grid container component="div" spacing={3}>
                <Grid item component="div" xs={12}>
                  <StatsCard 
                    title={t('analytics.topReferrer')}
                    value="google.com"
                    change="+18.7%"
                    isPositive={true}
                  />
                </Grid>
                <Grid item component="div" xs={12}>
                  <StatsCard 
                    title={t('analytics.socialMediaLeader')}
                    value="LinkedIn"
                    change="+5.4%"
                    isPositive={true}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const StatsCard = ({ title, value, change, isPositive }: StatsCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" gutterBottom>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: isPositive ? 'success.main' : 'error.main',
              fontWeight: 500
            }}
          >
            {change}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            vs. previous period
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPage;
