import { IPCTypes } from '../types'

declare global {
  interface Window {
    electronAPI: IPCTypes
  }
}
