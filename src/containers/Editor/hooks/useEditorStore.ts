import EditorStore from '../stores/EditorStore';
import { EditorContext } from '../Context/EditorContext';
import { useContext } from 'react';
import ControlsStore from '../stores/ControlsStore';
import AboutStore from '../stores/AboutStore';
import PanelsStore from '../stores/PanelsStore';
import AvatarPanelStore from '../stores/panels/AvatarPanelStore';
import AnimationsPanelStore from '../stores/panels/AnimationsPanelStore';
import StylePanelStore from '../stores/panels/StylePanelStore';

export const useEditorStore = (): EditorStore => {
  const rootContext = useContext(EditorContext);
  if (!rootContext) {
    throw new Error('No EditorContext provider found');
  }
  return rootContext.store;
};

export const useAboutStore = (): AboutStore => {
  return useEditorStore().aboutStore;
};

export const useControlsStore = (): ControlsStore => {
  return useEditorStore().controlsStore;
};

export const useAvatarStore = (): AvatarPanelStore => {
  return useEditorStore().panelsStore.avatarPanelStore;
};

export const useAnimationsStore = (): AnimationsPanelStore => {
  return useEditorStore().panelsStore.animationsPanelStore;
};

export const useStyleStore = (): StylePanelStore => {
  return useEditorStore().panelsStore.stylePanelStore;
};

export const usePanelsStore = (): PanelsStore => {
  return useEditorStore().panelsStore;
};

export default useEditorStore;
