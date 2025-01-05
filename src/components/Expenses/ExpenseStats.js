import React, { useMemo, useState } from 'react';
import { 
  Card, 
  Typography, 
  Grid, 
  Button, 
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box
} from '@mui/material';
import { CloudDownload, DateRange, Assessment } from '@mui/icons-material';
import { useExpenses } from '../../context/ExpenseContext';
import { ExportService } from '../../services/ExportService';

const ExpenseStats = () => {
  const { getExpenseStats, getFilteredExpenses, getAllExpenses } = useExpenses();
  const stats = useMemo(() => getExpenseStats(), [getExpenseStats]);
  const expenses = useMemo(() => getFilteredExpenses(), [getFilteredExpenses]);
  const allExpenses = useMemo(() => getAllExpenses(), [getAllExpenses]);
  
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState('current');

  const handleExportExcel = () => {
    const dataToExport = exportType === 'current' ? expenses : allExpenses;
    ExportService.exportToExcel(dataToExport, exportType === 'all');
    setIsExportDialogOpen(false);
  };

  const handleExportPDF = () => {
    const dataToExport = exportType === 'current' ? expenses : allExpenses;
    ExportService.exportToPDF(dataToExport, exportType === 'all');
    setIsExportDialogOpen(false);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, height: '100%', bgcolor: 'primary.light', color: 'white', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total Expenses
            </Typography>
            <Typography variant="h4">
              ${stats.total.toFixed(2)}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, height: '100%', bgcolor: 'secondary.light', color: 'white', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Number of Expenses
            </Typography>
            <Typography variant="h4">
              {stats.count}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, height: '100%', bgcolor: 'success.light', color: 'white', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Average Expense
            </Typography>
            <Typography variant="h4">
              ${stats.average.toFixed(2)}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ p: 3, mb: 4, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Export Options
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DateRange />}
            onClick={() => setIsExportDialogOpen(true)}
            disabled={expenses.length === 0}
            fullWidth
          >
            Export Selected Period
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Assessment />}
            onClick={() => {
              setExportType('all');
              setIsExportDialogOpen(true);
            }}
            disabled={allExpenses.length === 0}
            fullWidth
          >
            Export All Time Data
          </Button>
        </Stack>
      </Card>

      {/* Export Dialog */}
      <Dialog 
        open={isExportDialogOpen} 
        onClose={() => setIsExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {exportType === 'current' ? 'Export Selected Period' : 'Export All Time Data'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="body1" gutterBottom>
              Choose your export format:
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {exportType === 'current' 
                ? 'Export data for the selected time period with detailed analysis.'
                : 'Export complete expense history with comprehensive statistics.'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudDownload />}
                onClick={handleExportExcel}
                fullWidth
              >
                Export as Excel
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CloudDownload />}
                onClick={handleExportPDF}
                fullWidth
              >
                Export as PDF
              </Button>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExpenseStats; 