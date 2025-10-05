import { z } from 'zod';

// Profile form schema
export const profileSchema = z.object({
  nickname: z.string().min(2, 'Nickname must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobileCountryCode: z.string().optional(),
  mobileNumber: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Password form schema
export const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(8, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PasswordFormData = z.infer<typeof passwordSchema>;
