import { createContext } from 'react';
import SoundSystem from '../SoundSystem';

export type SoundContextType = {
  soundSystem: SoundSystem;
};

export const SoundContext = createContext<SoundContextType | undefined>(undefined);
