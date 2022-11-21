import { FC, MutableRefObject, useCallback, useEffect, useRef } from 'react';
import classNames from './RightControls.module.scss';
import Fade from '@app/components/Transition/Fade';
import { observer } from 'mobx-react';
import { useAnimationStore } from '@app/containers/Editor/hooks/useEditorStore';
import AnimatedButton from '@app/components/AnimatedButton';
import { useClickAway } from 'react-use';

const Animations: FC = observer(() => {
  const {
    controlElement,
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
  } = useAnimationStore();

  const areaRef = useRef<HTMLDivElement>(null);

  const animationSelectHandler = useCallback((id: string) => {
    if (activeAnimationId === id) {
      setIsPaused(!isPaused);
      return;
    }
    setActiveAnimationId(id);
    setIsPaused(false);
  }, [activeAnimationId, isPaused]);

  useClickAway(areaRef as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showAnimationSelection) return;
    if (!controlElement.contains(e.target as Node)) {
      setShowAnimationSelection(false);
      onStop();
    }
  });

  const animationIsActive = useCallback((id: string) => {
    return id === activeAnimationId;
  }, [activeAnimationId]);

  useEffect(() => {
    console.log(isLoadAnimation);
  }, [isLoadAnimation]);

  return (
    <Fade
      appear
      unmountOnExit
      enable={showAnimationSelection}
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

export default Animations;
