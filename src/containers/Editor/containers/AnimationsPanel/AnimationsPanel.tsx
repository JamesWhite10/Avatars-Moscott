import { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { useAnimationsStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useClickAway } from 'react-use';
import Fade from '@app/components/Transition/Fade';
import classNames from './AnimationsPanel.module.scss';
import AnimatedButton from '@app/components/AnimatedButton';

const AnimationsPanel: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    controlElements,
    showAnimationSelection,
    animations,
    progress,
    isPaused,
    setIsPaused,
    activeAnimationId,
    setActiveAnimationId,
    setShowAnimationSelection,
    onStop,
    isLoadAnimation,
    panelId,
  } = useAnimationsStore();

  const areaRef = useRef<HTMLDivElement>(null);

  const animationSelectHandler = useCallback((id: string) => {
    if (activeAnimationId === id) {
      setIsPaused(!isPaused);
      return;
    }
    setActiveAnimationId(id);
    setIsPaused(false);
  }, [activeAnimationId, isPaused]);

  useClickAway(areaRef as MutableRefObject<HTMLElement>,
    (e) => {
      if (!controlElements || !e.target || !showAnimationSelection) return;
      const control = controlElements.find((item) => item.contains(e.target as Node));
      if (!control) {
        setShowAnimationSelection(false);
        onStop();
      }
    });

  const animationIsActive = useCallback((id: string) => {
    return id === activeAnimationId;
  }, [activeAnimationId]);

  return (
    <Fade
      appear
      unmountOnExit
      enable={showAnimationSelection && activePanelId === panelId}
      className={classNames.animationsContainer}
    >
      <div
        style={{ width: '100%', height: '100%', display: 'grid', gap: 4 }}
        ref={areaRef}
      >
        {animations.map((animation) => (
          <AnimatedButton
            isPaused={isPaused}
            key={animation.id}
            progress={progress}
            onClick={() => {
              if (!isLoadAnimation) animationSelectHandler(animation.id);
            }}
            active={animationIsActive(animation.id)}
          >
            {animation.name}
          </AnimatedButton>
        ))}
      </div>
    </Fade>
  );
});

export default AnimationsPanel;
