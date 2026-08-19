import React from 'react'
import { IPCTypes } from '../../../types'
const ElectronAPIContext = React.createContext<IPCTypes>(null as unknown as IPCTypes); 
export default ElectronAPIContext
