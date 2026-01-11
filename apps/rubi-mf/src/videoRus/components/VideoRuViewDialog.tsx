import { useMemo, useState } from 'react';
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
import { Eye, Video as LucideVideoRu, Tag, CheckCircle2, XCircle, ExternalLink, Calendar, User, Copy, Check } from 'lucide-react';

import type { VideoRu } from '../types/videoRu.types';

interface VideoRuViewDialogProps {
	open: boolean;
	videoRu: VideoRu;
	onClose: () => void;
	onEdit?: (videoRu: VideoRu) => void;
}

const VideoRuViewDialog = ({ open, onClose, videoRu, onEdit }: VideoRuViewDialogProps) => {
	const { t } = useTranslation();
	const [copiedField, setCopiedField] = useState<string | null>(null);
	// Full URLs for videoRu and cover
	const videoRuUrl = videoRu.fileUrl || '';
	const coverUrl = videoRu.coverImageFileUrl || '';
	const sizeInMB = useMemo(() => {
		try {
			const bytes = Number(videoRu.sizeBytes || 0);
			if (!bytes) return '0.00';
			return (bytes / 1024 / 1024).toFixed(2);
		} catch (e) {
			return '-';
		}
	}, [videoRu.sizeBytes]);
	const handleCopy = async (text: string, fieldName: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedField(fieldName);
			setTimeout(() => setCopiedField(null), 2000);
		} catch (error) {
			console.error('[VideoRuViewDialog] Failed to copy to clipboard:', error);
		}
	};

	return (
			<Dialog
				open={open}
				onClose={(_event, reason) => {
					if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
					onClose();
				}}
				disableEscapeKeyDown
				maxWidth="md"
				fullWidth
				slotProps={{ paper: { sx: { borderRadius: 3, boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)' } } }}
			>
			<DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
				<Eye size={20} />
				<Typography variant="h6" component="span">{t('videoRus.view')}</Typography>
			</DialogTitle>
			<DialogContent sx={{ pt: 3, mt: 2 }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
					{/* Big videoRu preview at the top */}
					<Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider', alignItems: 'center', justifyContent: 'center' }}>
						<CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
							{/* Cover preview with play button overlay, videoRu hidden until play */}
        
									{coverUrl ? (
										<Box sx={{ mb: 2, maxWidth: 800, width: '100%', textAlign: 'center', position: 'relative' }}>
											<img id="videoRu-cover" src={coverUrl} alt={videoRu.name} style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
											{videoRuUrl && (
												<IconButton
													id="videoRu-play-btn"
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
														const coverElem = document.getElementById('videoRu-cover');
														const videoRuElem = document.getElementById('videoRu-preview');
														const playBtn = document.getElementById('videoRu-play-btn');
														if (coverElem) coverElem.style.display = 'none';
												if (videoRuElem) (videoRuElem as HTMLVideoElement).style.display = 'block';
												if (videoRuElem) (videoRuElem as HTMLVideoElement).play();
														if (playBtn) playBtn.style.display = 'none';
													}}
												>
													<LucideVideoRu size={40} />
												</IconButton>
											)}
										</Box>
									) : (
										<Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }} variant="rounded">
											<LucideVideoRu size={32} />
										</Avatar>
									)}
									{/* VideoRu preview, hidden until play */}
									{videoRuUrl && (
										<Box sx={{ mb: 2, maxWidth: 800, width: '100%', textAlign: 'center' }}>
										<video id="videoRu-preview" src={videoRuUrl} controls style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', display: 'none' }} />
										</Box>
									)}
									<Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{videoRu.name}</Typography>
									<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
										{/* Clickable full URLs for videoRu and cover */}
																				{videoRuUrl && (
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
												<Typography variant="caption" sx={{ color: 'text.secondary' }}>VideoRu URL:</Typography>
												<Link href={videoRuUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
													<ExternalLink size={14} />
													<Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{videoRuUrl}</Typography>
												</Link>
												<Tooltip title={copiedField === 'videoRuUrl' ? t('videoRus.messages.filenameCopied') : 'Copy'}>
													<IconButton size="small" onClick={() => handleCopy(videoRuUrl, 'videoRuUrl')} sx={{ ml: 0.5 }}>
														{copiedField === 'videoRuUrl' ? <Check size={16} /> : <Copy size={16} />}
													</IconButton>
												</Tooltip>
											</Box>
										)}										
										{/* Show original URL (external source) if provided */}
										{(videoRu as any).originalUrl && (
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
												<Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('videoRus.viewDialog.originalUrl') || 'Original URL'}:</Typography>
												<Link href={(videoRu as any).originalUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
													<ExternalLink size={14} />
													<Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{(videoRu as any).originalUrl}</Typography>
												</Link>
												<Tooltip title={copiedField === 'originalUrl' ? t('videoRus.messages.filenameCopied') : 'Copy'}>
													<IconButton size="small" onClick={() => handleCopy((videoRu as any).originalUrl, 'originalUrl')} sx={{ ml: 0.5 }}>
														{copiedField === 'originalUrl' ? <Check size={16} /> : <Copy size={16} />}
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
												<Tooltip title={copiedField === 'coverUrl' ? t('videoRus.messages.filenameCopied') : 'Copy'}>
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
							<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>VideoRu Details</Typography>
							<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>ID</Typography>
									<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all', color: 'text.primary' }}>{videoRu.id}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Name</Typography>
									<Typography variant="body2" sx={{ fontWeight: 600 }}>{videoRu.name}</Typography>
								</Box>
								<Box sx={{ gridColumn: '1 / -1' }}>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Description</Typography>
									<Typography variant="body2">{videoRu.description}</Typography>
								</Box>
                                <Box sx={{ gridColumn: '1 / -1' }}>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Tags</Typography>
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
										{videoRu.tags?.split(',').map((tag: string) => (
											<Chip key={tag.trim()} icon={<Tag size={14} />} label={tag.trim()} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
										))}
									</Box>
								</Box>
                                <Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Source Name</Typography>
									<Typography variant="body2" sx={{ fontWeight: 600 }}>{videoRu.sourceName || '-'}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Filename</Typography>
									<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{videoRu.filename}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Cover Image Filename</Typography>
									<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{videoRu.coverImageFilename}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Size (MB)</Typography>
									<Typography variant="body2">{sizeInMB !== '-' ? `${sizeInMB} MB` : '-'}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Language</Typography>
									<Chip label={t(`videoRus.languages.${videoRu.lang}`)} size="small" sx={{ fontWeight: 600 }} />
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Display Order</Typography>
									<Typography variant="body2">{videoRu.displayOrder}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Active</Typography>
									<Chip icon={videoRu.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />} label={videoRu.isActive ? 'Active' : 'Inactive'} color={videoRu.isActive ? 'success' : 'default'} sx={{ fontWeight: 600 }} />
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
										<Typography variant="body2" sx={{ fontWeight: 600 }}>{videoRu.createdAt ? format(parseISO(videoRu.createdAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
									</Box>
								</Box>
								<Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Updated At</Typography>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<Calendar size={16} />
										<Typography variant="body2" sx={{ fontWeight: 600 }}>{videoRu.updatedAt ? format(parseISO(videoRu.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
									</Box>
								</Box>
								<Box sx={{ gridColumn: '1 / -1' }}>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Created By</Typography>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<User size={16} />
										<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{videoRu.createdBy || '-'}</Typography>
									</Box>
								</Box>
								<Box sx={{ gridColumn: '1 / -1' }}>
									<Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Updated By</Typography>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<User size={16} />
										<Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{videoRu.updatedBy || '-'}</Typography>
									</Box>
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
				{onEdit && (
					<Button onClick={() => onEdit(videoRu)} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.edit')}</Button>
				)}
				<Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.close')}</Button>
			</DialogActions>
		</Dialog>
	);
};

export default VideoRuViewDialog;
