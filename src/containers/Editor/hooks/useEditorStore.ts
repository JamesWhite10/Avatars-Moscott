import EditorStore from '../stores/EditorStore';
import { EditorContext } from '../Context/EditorContext';
import { useContext } from 'react';

const useEditorStore = (): EditorStore => {
  const rootContext = useContext(EditorContext);
  if (!rootContext) {
    throw new Error('No EditorContext provider found');
  }
  return rootContext.store;
};

export default useEditorStore;
