import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.confirm for tests
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(() => true),
})

// Mock window.alert for tests
Object.defineProperty(window, 'alert', {
  writable: true,
  value: vi.fn(),
})

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()