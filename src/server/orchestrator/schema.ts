import { z } from 'zod';

export const ManifestPageSchema = z.object({
  id: z.string(),
  route: z.string(),
  auth: z.boolean().optional(),
});

export const ManifestFieldSchema = z.object({
  name: z.string(),
  type: z.string(),
  unique: z.boolean().optional(),
  nullable: z.boolean().optional(),
});

export const ManifestSchema = z.object({
  app_name: z.string(),
  app_display_name: z.string().optional(),
  app_tagline: z.string().optional(),
  pages: z.array(ManifestPageSchema),
  entities: z
    .record(
      z.object({
        fields: z.array(ManifestFieldSchema).optional(),
      })
    )
    .optional(),
  integrations: z
    .object({
      supabase: z
        .object({
          project_id: z.string(),
        })
        .optional(),
      stripe: z
        .object({
          product_fixture: z.string().optional(),
          cli_project_name: z.string().optional(),
          app_name: z.string().optional(),
          publishable_key: z.string().optional(),
        })
        .optional(),
      resend: z.object({ api_key: z.string().optional() }).optional(),
    })
    .optional(),
  deploy: z
    .object({
      type: z.enum(['vercel', 'docker']).optional(),
      env: z.array(z.string()).optional(),
    })
    .optional(),
});

export type Manifest = z.infer<typeof ManifestSchema>;


