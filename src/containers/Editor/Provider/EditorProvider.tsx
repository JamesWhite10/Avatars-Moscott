import { FC, PropsWithChildren, useMemo } from 'react';
import { EditorContext } from '@app/containers/Editor/Context/EditorContext';
import EditorStore from '@app/containers/Editor/stores/EditorStore';
import useSoundSystem from '@app/hooks/useSoundSystem';

const EditorProvider: FC<PropsWithChildren> = ({ children }) => {
  const soundSystem = useSoundSystem();
  const store = useMemo(() => {
    return new EditorStore(soundSystem);
  }, [soundSystem]);

  return (
    <EditorContext.Provider value={{ store }}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;
