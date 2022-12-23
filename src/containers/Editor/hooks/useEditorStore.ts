import EditorStore from '../stores/EditorStore';
import { EditorContext } from '../Context/EditorContext';
import { useContext } from 'react';
import ControlsStore from '../stores/ControlsStore';
import AboutStore from '../stores/AboutStore';
import PanelsStore from '../stores/PanelsStore';
import AvatarPanelStore from '../stores/panels/AvatarPanelStore';
import AnimationsPanelStore from '../stores/panels/AnimationsPanelStore';
import StylePanelStore from '../stores/panels/StylePanelStore';
import HeadPanelStore from '../stores/panels/HeadPanelStore';
import BodyPanelStore from '../stores/panels/BodyPanelStore';
import ShoesPanelStore from '../stores/panels/ShoesPanelStore';
import BackgroundPanelStore from '../stores/panels/BackgroundPanelStore';
import EyePanelStore from '../stores/panels/EyePanelStore';

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

export const useHeadStore = (): HeadPanelStore => {
  return useEditorStore().panelsStore.headPanelStore;
};

export const useBodyStore = (): BodyPanelStore => {
  return useEditorStore().panelsStore.bodyPanelStore;
};

export const useShoesStore = (): ShoesPanelStore => {
  return useEditorStore().panelsStore.shoesPanelStore;
};

export const useBackgroundStore = (): BackgroundPanelStore => {
  return useEditorStore().panelsStore.backgroundPanelStore;
};

export const useEyeStore = (): EyePanelStore => {
  return useEditorStore().panelsStore.eyePanelStore;
};

export const usePanelsStore = (): PanelsStore => {
  return useEditorStore().panelsStore;
};

export default useEditorStore;
