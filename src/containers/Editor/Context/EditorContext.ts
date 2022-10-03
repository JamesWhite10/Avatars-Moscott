import EditorStore from '../stores/EditorStore';
import { createContext } from 'react';

export type EditorContextType = {
  store: EditorStore;
};

export const EditorContext = createContext<EditorContextType | undefined>(undefined);
