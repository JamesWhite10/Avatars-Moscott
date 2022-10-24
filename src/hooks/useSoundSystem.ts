import SoundSystem from '../sound/SoundSystem';
import { useContext } from 'react';
import { SoundContext } from '@app/sound';

export default function useSoundSystem(): SoundSystem {
  const rootContext = useContext(SoundContext);
  if (!rootContext) {
    throw new Error('No Sound provider found');
  }
  return rootContext.soundSystem;
}
