import { z } from 'zod';
import { POSITIONS } from '$lib/config.js';

// SECURITY: Runtime validation schema for API requests
export const extractRequestSchema = z.object({
	imageBase64: z.string().min(1, 'Image data is required'),
	fileName: z.string().min(1, 'File name is required'),
	position: z.enum(POSITIONS),
	imageIndex: z.number().int().positive().optional(),
	imageTotal: z.number().int().positive().optional(),
	isSegmented: z.boolean().optional(),
	segmentIndex: z.number().int().positive().optional(),
	segmentTotal: z.number().int().positive().optional()
});

export type ExtractRequest = z.infer<typeof extractRequestSchema>;
