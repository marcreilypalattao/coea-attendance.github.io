const API_URL = 'http://127.0.0.1:8000'

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(API_URL + path, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(typeof err.detail === 'string' ? err.detail : `Request failed (${res.status})`)
    }
    if (res.status === 204) return null as T
    return res.json()
}
