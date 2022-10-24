import { FC, PropsWithChildren, useMemo } from 'react';
import { SoundContext } from '@app/sound';
import SoundSystem from '@app/sound/SoundSystem';
import { soundMap } from '@app/sound/config/soundConfig';

const SoundProvider: FC<PropsWithChildren> = ({ children }) => {
  const soundSystem = useMemo(() => {
    const system = new SoundSystem();

    for (let i = 0; i < Object.entries(soundMap).length; i++) {
      const [name, source] = Object.entries(soundMap)[i];
      system.addSound(name, source.src, source.loop);
    }
    return system;
  }, []);

  return (
    <SoundContext.Provider value={{ soundSystem }}>
      {children}
    </SoundContext.Provider>
  );
};

export default SoundProvider;
