import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'nightstay-ai-booking-platform-h50gdg5j',
  authRequired: false
})

// Export individual services for convenience
export const auth = blink.auth
export const db = blink.db
export const storage = blink.storage
export const ai = blink.ai
export const notifications = blink.notifications
export const analytics = blink.analytics