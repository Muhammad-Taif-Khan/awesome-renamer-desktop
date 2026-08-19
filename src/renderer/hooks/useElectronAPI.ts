import React from 'react'
import ElectronAPIContext from '@renderer/contexts/electron/ElectronAPIContext'
import { IPCTypes } from '../../types'
export const useElectronAPI = (): IPCTypes => {
  const electronAPI = React.useContext(ElectronAPIContext)

  return electronAPI
}
