import React, { useMemo, useState } from 'react';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	Box,
	Typography,
	Chip,
	Card,
	CardContent,
	Link,
	Avatar,
	IconButton,
	Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { Eye, Video as LucideVideo, Tag, CheckCircle2, XCircle, ExternalLink, Calendar, User, Copy, Check } from 'lucide-react';

import { getFullVideoUrl } from '../utils/getFullVideoUrl';
import type { Video } from '../types/video.types';

interface VideoViewDialogProps {
	open: boolean;
	video: Video;
	onClose: () => void;
	onEdit?: (video: Video) => void;
}

const VideoViewDialog = ({ open, onClose, video, onEdit }: VideoViewDialogProps) => {
	const { t } = useTranslation();
	const [copiedField, setCopiedField] = useState<string | null>(null);
	// Full URLs for video and cover
	const videoUrl = useMemo(() => (video.filename ? getFullVideoUrl(video.filename) : ''), [video.filename]);
	const coverUrl = useMemo(() => (video.coverImageFilename ? getFullVideoUrl(`/cover-image/${video.coverImageFilename}`) : ''), [video.coverImageFilename]);
	const sizeInMB = useMemo(() => {
		try {
			const bytes = Number(video.sizeBytes || 0);
			if (!bytes) return '0.00';
			return (bytes / 1024 / 1024).toFixed(2);
		} catch (e) {
			return '-';
		}
	}, [video.sizeBytes]);
	const handleCopy = async (text: string, fieldName: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedField(fieldName);
			setTimeout(() => setCopiedField(null), 2000);
		} catch (error) {
			console.error('[VideoViewDialog] Failed to copy to clipboard:', error);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)' } } }}>
			<DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
				<Eye size={20} />
				<Typography variant="h6" component="span">{t('videos.view')}</Typography>
			</DialogTitle>
			<DialogContent sx={{ pt: 3, mt: 2 }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
					{/* Big video preview at the top */}
					<Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider', alignItems: 'center', justifyContent: 'center' }}>
						<CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
							{/* Cover preview with play button overlay, video hidden until play */}
        
									{coverUrl ? (
										<Box sx={{ mb: 2, maxWidth: 800, width: '100%', textAlign: 'center', position: 'relative' }}>
											<img id="video-cover" src={coverUrl} alt={video.name} style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
											{videoUrl && (
												<IconButton
													id="video-play-btn"
													sx={{
														position: 'absolute',
														top: '50%',
														left: '50%',
														transform: 'translate(-50%, -50%)',
														bgcolor: 'rgba(0,0,0,0.5)',
														color: 'white',
														width: 64,
														height: 64,
														'&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
													}}
													onClick={() => {
														const coverElem = document.getElementById('video-cover');
														const videoElem = document.getElementById('video-preview');
														const playBtn = document.getElementById('video-play-btn');
														if (coverElem) coverElem.style.display = 'none';
														if (videoElem) (videoElem as HTMLVideoElement).style.display = 'block';
														if (videoElem) (videoElem as HTMLVideoElement).play();
														if (playBtn) playBtn.style.display = 'none';
													}}
												>
													<LucideVideo size={40} />
												</IconButton>
											)}
										</Box>
									) : (
										<Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }} variant="rounded">
											<LucideVideo size={32} />
										</Avatar>
									)}
									{/* Video preview, hidden until play */}
									{videoUrl && (
										<Box sx={{ mb: 2, maxWidth: 800, width: '100%', textAlign: 'center' }}>
											<video id="video-preview" src={videoUrl} controls style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', display: 'none' }} />
										</Box>
									)}
									<Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{video.name}</Typography>
									<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
										{/* Clickable full URLs for video and cover */}
										{videoUrl && (
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
												<Typography variant="caption" sx={{ color: 'text.secondary' }}>Video URL:</Typography>
												<Link href={videoUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
													<ExternalLink size={14} />
													<Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{videoUrl}</Typography>
												</Link>
												<Tooltip title={copiedField === 'videoUrl' ? t('videos.messages.filenameCopied') : 'Copy'}>
													<IconButton size="small" onClick={() => handleCopy(videoUrl, 'videoUrl')} sx={{ ml: 0.5 }}>
														{copiedField === 'videoUrl' ? <Check size={16} /> : <Copy size={16} />}
													</IconButton>
												</Tooltip>
											</Box>
										)}
										{coverUrl && (
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
												<Typography variant="caption" sx={{ color: 'text.secondary' }}>Cover URL:</Typography>
												<Link href={coverUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
													<ExternalLink size={14} />
													<Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{coverUrl}</Typography>
												</Link>
												<Tooltip title={copiedField === 'coverUrl' ? t('videos.messages.filenameCopied') : 'Copy'}>
													<IconButton size="small" onClick={() => handleCopy(coverUrl, 'coverUrl')} sx={{ ml: 0.5 }}>
														{copiedField === 'coverUrl' ? <Check size={16} /> : <Copy size={16} />}
													</IconButton>
												</Tooltip>
											</Box>
										)}
									</Box>
						</CardContent>
					</Card>
					{/* Details grid for all metadata fields */}
					<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
						<CardContent sx={{ p: 3 }}>
							<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>Video Details</Typography>
							<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>ID</Typography>
									<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all', color: 'text.primary' }}>{video.id}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Name</Typography>
									<Typography variant="body2" sx={{ fontWeight: 600 }}>{video.name}</Typography>
								</Box>
                                <Box sx={{ gridColumn: '1 / -1' }}>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Description</Typography>
									<Typography variant="body2">{video.description}</Typography>
								</Box>
                                <Box sx={{ gridColumn: '1 / -1' }}>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Tags</Typography>
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
										{video.tags?.split(',').map((tag: string) => (
											<Chip key={tag.trim()} icon={<Tag size={14} />} label={tag.trim()} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
										))}
									</Box>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Filename</Typography>
									<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{video.filename}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Cover Image Filename</Typography>
									<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{video.coverImageFilename}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Size (MB)</Typography>
									<Typography variant="body2">{sizeInMB !== '-' ? `${sizeInMB} MB` : '-'}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Language</Typography>
									<Chip label={t(`videos.languages.${video.lang}`)} size="small" sx={{ fontWeight: 600 }} />
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Display Order</Typography>
									<Typography variant="body2">{video.displayOrder}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Active</Typography>
									<Chip icon={video.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />} label={video.isActive ? 'Active' : 'Inactive'} color={video.isActive ? 'success' : 'default'} sx={{ fontWeight: 600 }} />
								</Box>
							</Box>
						</CardContent>
					</Card>
					<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
						<CardContent sx={{ p: 3 }}>
							<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>Metadata</Typography>
							<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Created At</Typography>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<Calendar size={16} />
										<Typography variant="body2" sx={{ fontWeight: 600 }}>{video.createdAt ? format(parseISO(video.createdAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
									</Box>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Updated At</Typography>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<Calendar size={16} />
										<Typography variant="body2" sx={{ fontWeight: 600 }}>{video.updatedAt ? format(parseISO(video.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
									</Box>
								</Box>
								<Box sx={{ gridColumn: '1 / -1' }}>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Created By</Typography>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<User size={16} />
										<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{video.createdBy || '-'}</Typography>
									</Box>
								</Box>
								<Box sx={{ gridColumn: '1 / -1' }}>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Updated By</Typography>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<User size={16} />
										<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{video.updatedBy || '-'}</Typography>
									</Box>
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
				{onEdit && (
					<Button onClick={() => onEdit(video)} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.edit')}</Button>
				)}
				<Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.close')}</Button>
			</DialogActions>
		</Dialog>
	);
};

export default VideoViewDialog;
