
import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box } from '@mui/material';
import type { VideoFormData } from '../types/video.types';

interface VideoCreateDialogProps {
	open: boolean;
	formData: VideoFormData;
	onFormChange: (field: keyof VideoFormData, value: any) => void;
	onSubmit: () => void;
	onClose: () => void;
	loading?: boolean;
	formErrors?: Record<string, string>;
}

const VideoCreateDialog: React.FC<VideoCreateDialogProps> = ({ open, formData, onFormChange, onSubmit, onClose, loading, formErrors }) => {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Create Video</DialogTitle>
			<DialogContent>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
					<TextField label="Name" value={formData.name} onChange={e => onFormChange('name', e.target.value)} fullWidth />
					<TextField label="Filename" value={formData.filename} onChange={e => onFormChange('filename', e.target.value)} fullWidth />
					<TextField label="Cover Image Filename" value={formData.coverImageFilename} onChange={e => onFormChange('coverImageFilename', e.target.value)} fullWidth />
					<TextField label="Description" value={formData.description} onChange={e => onFormChange('description', e.target.value)} fullWidth multiline rows={2} />
					<TextField label="Tags" value={formData.tags} onChange={e => onFormChange('tags', e.target.value)} fullWidth />
					<TextField label="Language" value={formData.lang} onChange={e => onFormChange('lang', e.target.value)} fullWidth />
					<TextField label="Display Order" type="number" value={formData.displayOrder} onChange={e => onFormChange('displayOrder', Number(e.target.value))} fullWidth />
					<TextField label="Active" type="checkbox" checked={formData.isActive} onChange={e => onFormChange('isActive', e.target.checked)} />
					<Button variant="contained" onClick={onSubmit} disabled={loading} sx={{ mt: 2 }}>Save</Button>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default VideoCreateDialog;
