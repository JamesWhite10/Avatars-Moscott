import React, { useState } from 'react';
import Button, { ButtonSize, ButtonScheme } from '@app/components/Button/Button';
import { EmptyIcon } from '@app/components/Icons';

const Components = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled] = useState<boolean>(false);

  const styles = {
    presentationButtons: {
      width: '100%',
      height: '100vh',
      background: '#CDCDCD',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'column' as 'column',
    },
  };

  return (
    <div style={styles.presentationButtons}>
      <Button
        loading={loading}
        onClick={() => setLoading(!loading)}
        colorScheme={ButtonScheme.PRIMARY}
        size={ButtonSize.LG}
        disabled={disabled}
        startIcon={<EmptyIcon />}
        endIcon={<EmptyIcon />}
      >
        Style
      </Button>
      <Button
        loading={loading}
        onClick={() => setLoading(!loading)}
        colorScheme={ButtonScheme.SECONDARY}
        disabled={disabled}
        startIcon={<EmptyIcon />}
        endIcon={<EmptyIcon />}
      >
        Style
      </Button>
      <Button
        loading={loading}
        onClick={() => setLoading(!loading)}
        colorScheme={ButtonScheme.GHOST}
        size={ButtonSize.SM}
        disabled={disabled}
        startIcon={<EmptyIcon />}
        endIcon={<EmptyIcon />}
      >
        Style
      </Button>
    </div>
  );
};

export default Components;
