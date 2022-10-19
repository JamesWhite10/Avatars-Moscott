import EditorStore from '../stores/EditorStore';
import { EditorContext } from '../Context/EditorContext';
import { useContext } from 'react';
import ControlsStore from '../stores/ControlsStore';
import CharacterStore from '../stores/CharacterStore';
import StyleStore from '../stores/StyleStore';

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

export const useCharacterStore = (): CharacterStore => {
  return useEditorStore().charactersStore;
};

export const useStyleStore = (): StyleStore => {
  return useEditorStore().styleStore;
};

export default useEditorStore;
