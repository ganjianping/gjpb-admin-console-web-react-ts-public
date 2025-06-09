import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Grid } from '../../../shared-lib/src/utils/grid';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Define the document schema with Zod
const documentSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot be more than 100 characters'),
  type: z.enum(['report', 'policy', 'contract', 'invoice'], {
    errorMap: () => ({ message: 'Please select a valid document type' }),
  }),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot be more than 500 characters')
    .optional(),
  status: z.enum(['draft', 'pending', 'published', 'archived'], {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }),
  tags: z.array(z.string())
    .max(5, 'You can add up to 5 tags')
    .default([])
});

// Infer TypeScript type from the schema
type DocumentFormData = z.infer<typeof documentSchema>;

// Document types and statuses for the select fields
const DOCUMENT_TYPES = [
  { value: 'report', label: 'Report' },
  { value: 'policy', label: 'Policy Document' },
  { value: 'contract', label: 'Contract' },
  { value: 'invoice', label: 'Invoice' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const DocumentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Initialize the form with React Hook Form + Zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      type: 'report' as const,
      description: '',
      status: 'draft' as const,
      tags: [],
    },
  });
  
  // Handle form submission
  const onSubmit: SubmitHandler<DocumentFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // Simulate API call
      console.log('Submitting document data:', data);
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Show success message
      setSubmitSuccess(true);
      toast.success('Document created successfully!');
      
      // Reset form
      reset();
    } catch (error) {
      console.error('Error creating document:', error);
      setSubmitError('Failed to create document. Please try again.');
      toast.error('Failed to create document');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset the form
  const handleReset = () => {
    reset();
    setSubmitSuccess(false);
    setSubmitError(null);
  };
  
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
      <CardHeader 
        title="Create New Document" 
        subheader="Fill out the form to create a new document"
      />
      <Divider />
      <CardContent>
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Document created successfully!
          </Alert>
        )}
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container component="div" spacing={3}>
            <Grid item component="div" xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Document Title"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>
            
            <Grid item component="div" xs={12} md={6}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Document Type"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    disabled={isSubmitting}
                  >
                    {DOCUMENT_TYPES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            
            <Grid item component="div" xs={12} md={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    disabled={isSubmitting}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            
            <Grid item component="div" xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>
            
            <Grid item component="div" xs={12}>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tags (comma-separated)"
                    variant="outlined"
                    fullWidth
                    placeholder="e.g. finance, quarterly, 2023"
                    error={!!errors.tags}
                    helperText={
                      errors.tags?.message || 
                      'Optional: Add up to 5 tags separated by commas'
                    }
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>
            
            <Grid item component="div" xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting && <CircularProgress size={20} />}
                >
                  {isSubmitting ? 'Creating...' : 'Create Document'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentForm;
