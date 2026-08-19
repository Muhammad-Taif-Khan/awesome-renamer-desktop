import HomeEmptyDragArea from './HomeEmptyDragArea';
import FilesDashboard from './FilesDashboard';
import { useFilesStore } from '@renderer/store/filesStore';

const HomePage = (): React.ReactNode => {
  const files  = useFilesStore((state) => state.files);
  if (files.length === 0) {
    return <HomeEmptyDragArea />;
  }
  return <FilesDashboard/>;
};
export default HomePage;
