import { createClientOnlyFn } from '@tanstack/react-start'

const postForm = async (endpoint: string, formData: FormData) => {
  const backendUrl = import.meta.env.VITE_BACKEND

  const response = await fetch(`${backendUrl}${endpoint}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to post form: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}

export const postFormClient = createClientOnlyFn(postForm)
