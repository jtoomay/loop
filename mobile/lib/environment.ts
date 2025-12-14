import { router } from 'expo-router'
import { Environment, FetchFunction, Network, RecordSource, Store } from 'relay-runtime'
import { authService } from './auth'
import { HTTP_ENDPOINT } from './constants'

const fetchQuery: FetchFunction = async (operation, variables) => {
  const accessToken = await authService.getAccessToken()

  const makeRequest = async (token: string | null) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(HTTP_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: operation.text, variables }),
    })

    const json = await res.json()

    if (json.errors) {
      if (isUnauthenticatedError(json.errors)) {
        if (token) {
          const newSession = await authService.refreshAccessToken()

          if (newSession) {
            return makeRequest(newSession.accessToken)
          } else {
            router.replace('/join')
          }
        } else {
          router.replace('/join')
        }
      }
      throw new Error(json.errors[0].message)
    }

    return json
  }

  return makeRequest(accessToken)
}

export const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
})

function isUnauthenticatedError(errors: any[]): boolean {
  return errors.some((error) => error.extensions?.code === 'UNAUTHENTICATED')
}
