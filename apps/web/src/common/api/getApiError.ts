import { isHTTPError } from 'ky'
import z from 'zod'

export const apiErrorSchema = z.object({
  statusCode: z.number().int().min(400).max(599),
  message: z.string(),
  errorCode: z.string().min(1),
})

export type ApiError = z.infer<typeof apiErrorSchema>

export const getApiError = (error: unknown): ApiError | null => {
  if (!isHTTPError(error)) {
    return null
  }

  const result = apiErrorSchema.safeParse(error.data)

  return result.success ? result.data : null
}
