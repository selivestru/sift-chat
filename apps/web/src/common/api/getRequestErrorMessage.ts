import { isHTTPError, isNetworkError, isTimeoutError } from 'ky'

export const getRequestErrorMessage = (error: unknown, fallback: string): string => {
  if (isTimeoutError(error)) {
    return 'The server took too long to respond. Please try again'
  }

  if (isNetworkError(error)) {
    return 'Unable to reach the server. Check your connection and try again'
  }

  if (isHTTPError(error)) {
    if (error.response.status === 429) {
      return 'Too many attempts. Please try again later'
    }

    if (error.response.status >= 500) {
      return 'The service is temporarily unavailable. Please try again later'
    }

    if (error.response.status === 403) {
      return 'This request is not allowed'
    }
  }

  return fallback
}
