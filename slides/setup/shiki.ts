import { defineShikiSetup } from '@slidev/types'

// Terminal/code blocks are always dark ("terminal window" look) on the light slides.
export default defineShikiSetup(() => ({
  themes: { dark: 'github-dark', light: 'github-dark' },
}))
