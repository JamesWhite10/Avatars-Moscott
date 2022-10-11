import EditorStore from '../stores/EditorStore';
import { EditorContext } from '../Context/EditorContext';
import { useContext } from 'react';
import ControlsStore from '../stores/ControlsStore';

export const useEditorStore = (): EditorStore => {
  const rootContext = useContext(EditorContext);
  if (!rootContext) {
    throw new Error('No EditorContext provider found');
  }
  return rootContext.store;
};

export const useControlsStore = (): ControlsStore => {
  return useEditorStore().controlsStore;
};

export default useEditorStore;
