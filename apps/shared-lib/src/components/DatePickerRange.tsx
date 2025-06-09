import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Button, Popover, Typography } from '@mui/material';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

// Define DateRange type
type DateRange<T = Date> = [T | null, T | null];

interface DatePickerRangeProps {
  value: DateRange<Date>;
  onChange: (newValue: DateRange<Date>) => void;
  label?: string;
  maxDate?: Date;
  minDate?: Date;
}

export const DatePickerRange = ({
  value,
  onChange,
  label,
  maxDate,
  minDate
}: DatePickerRangeProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(value[0] || null);
  const [endDate, setEndDate] = useState<Date | null>(value[1] || null);
  
  const open = Boolean(anchorEl);
  
  // Update component state when props change
  useEffect(() => {
    setStartDate(value[0] || null);
    setEndDate(value[1] || null);
  }, [value]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    // Reset dates to the current value when opening
    setStartDate(value[0] || null);
    setEndDate(value[1] || null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancel = () => {
    // Reset temporary values
    setStartDate(value[0] || null);
    setEndDate(value[1] || null);
    handleClose();
  };

  const handleApply = () => {
    // Only update if we have both dates
    if (startDate && endDate) {
      onChange([startDate, endDate]);
    }
    handleClose();
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (date && startDate && date < startDate) {
      setStartDate(date);
    }
  };

  // Quick select options
  const quickSelects = [
    {
      label: t('common.today'),
      action: () => {
        const today = new Date();
        setStartDate(today);
        setEndDate(today);
      }
    },
    {
      label: t('common.yesterday'),
      action: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
      }
    },
    {
      label: t('common.last7Days'),
      action: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        setStartDate(start);
        setEndDate(end);
      }
    },
    {
      label: t('common.last30Days'),
      action: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        setStartDate(start);
        setEndDate(end);
      }
    },
    {
      label: t('common.thisMonth'),
      action: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date();
        setStartDate(start);
        setEndDate(end);
      }
    },
    {
      label: t('common.lastMonth'),
      action: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        setStartDate(start);
        setEndDate(end);
      }
    }
  ];

  // Format the displayed date range
  const formatDateRange = () => {
    if (!value[0] || !value[1]) return t('common.selectDateRange');
    
    const startFormatted = format(value[0], 'MMM d, yyyy');
    const endFormatted = format(value[1], 'MMM d, yyyy');
    
    if (startFormatted === endFormatted) {
      return startFormatted;
    }
    
    return `${startFormatted} - ${endFormatted}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Button
          onClick={handleClick}
          variant="outlined"
          startIcon={<CalendarIcon size={16} />}
          size="medium"
        >
          {label || formatDateRange()}
        </Button>
        
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              p: 3,
              width: 'auto',
              minWidth: 300,
            }
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
              {t('common.dateRange')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {quickSelects.map((option, index) => (
                <Button 
                  key={index}
                  size="small"
                  variant="outlined"
                  onClick={option.action}
                >
                  {option.label}
                </Button>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
            <DatePicker
              label={t('common.startDate')}
              value={startDate}
              onChange={handleStartDateChange}
              maxDate={maxDate}
              minDate={minDate}
              slotProps={{ textField: { variant: 'outlined', fullWidth: true } }}
            />
            <DatePicker
              label={t('common.endDate')}
              value={endDate}
              onChange={handleEndDateChange}
              minDate={startDate || undefined}
              maxDate={maxDate}
              slotProps={{ textField: { variant: 'outlined', fullWidth: true } }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCancel} color="inherit">
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleApply} 
              variant="contained" 
              disabled={!startDate || !endDate}
            >
              {t('common.apply')}
            </Button>
          </Box>
        </Popover>
      </Box>
    </LocalizationProvider>
  );
};
