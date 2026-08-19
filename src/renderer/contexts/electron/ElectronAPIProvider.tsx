import ElectronAPIContext from './ElectronAPIContext'

const ElectronAPIProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const electronAPI = window.electronAPI;
  return <ElectronAPIContext.Provider value={electronAPI}>{children}</ElectronAPIContext.Provider>
}

export default ElectronAPIProvider
