import i18n from '../../../../shared-lib/src/i18n/i18n';

const enTranslations = {
	images: {
		title: 'Images',
		subtitle: 'Manage images and information',
		create: 'Create Image',
		edit: 'Edit Image',
		delete: 'Delete Image',
		view: 'View Image',
		search: 'Search Images',
		clearFilters: 'Clear Filters',
		noImagesFound: 'No images found',
		description: 'Manage images and information',
		pageTitle: 'Images Management',
		actions: {
			view: 'View',
			edit: 'Edit',
			delete: 'Delete',
			copyFilename: 'Copy Filename',
			create: 'Create',
			cancel: 'Cancel',
			save: 'Save',
		},
		messages: {
			filenameCopied: 'Filename copied to clipboard',
			savingImage: 'Saving image...',
			pleaseWait: 'Please wait...',
		},
		columns: {
			name: 'Name',
			extension: 'Extension',
			lang: 'Language',
			tags: 'Tags',
			displayOrder: 'Order',
			isActive: 'Status',
			updatedAt: 'Updated At',
		},
		form: {
			name: 'Image Name',
			sourceName: 'Source Name',
			originalUrl: 'Original URL',
			filename: 'Filename',
			thumbnailFilename: 'Thumbnail Filename',
			extension: 'Extension',
			mimeType: 'MIME Type',
			sizeBytes: 'Size (bytes)',
			width: 'Width',
			height: 'Height',
			altText: 'Alt Text',
			tags: 'Tags',
			lang: 'Language',
			displayOrder: 'Display Order',
			isActive: 'Active Status',
			status: 'Status',
		},
		filters: {
			searchByName: 'Search by name',
			all: 'All',
		},
		languages: {
			EN: 'English',
			ZH: 'Chinese',
		},
		status: {
			active: 'Active',
			inactive: 'Inactive',
		},
	},
};

i18n.addResourceBundle('en', 'translation', enTranslations, true, true);

export default enTranslations;
