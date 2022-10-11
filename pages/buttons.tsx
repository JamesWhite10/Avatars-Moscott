import React, { useState } from 'react';
import Button from '@app/components/Button/Button';
import { ButtonSize, ButtonType } from '@app/components/Button';
import styles from './../src/components/Button/Button.module.scss';

const Buttons = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled] = useState<boolean>(false);

  return (
    <div className={styles.presentationButtons}>
      <Button
        isLoading={isLoading}
        onClick={() => setIsLoading(!isLoading)}
        type={ButtonType.PRIMARY}
        size={ButtonSize.LG}
        disabled={disabled}
      >
        Style
      </Button>
      <Button
        isLoading={isLoading}
        onClick={() => setIsLoading(!isLoading)}
        type={ButtonType.SECONDARY}
        disabled={disabled}
      >
        Style
      </Button>
      <Button
        isLoading={isLoading}
        onClick={() => setIsLoading(!isLoading)}
        type={ButtonType.GHOST}
        size={ButtonSize.SM}
        disabled={disabled}
      >
        Style
      </Button>
    </div>
  );
};

export default Buttons;
