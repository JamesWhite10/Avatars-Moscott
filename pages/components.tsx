import React, { useState } from 'react';
import Button from '@app/components/Button/Button';
import { CyberfoxIcon, EmptyIcon, Web3devIcon } from '@app/components/Icons';
import Card from '@app/components/Card';
import MiraImage from '@app/assets/mira.png';
import YukiImage from '@app/assets/yuki.png';
import CharacterSelectButton from '@app/components/CharacterSelectButton';

const Components = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled] = useState<boolean>(false);
  const [active, setIsActive] = useState(false);

  const styles = {
    presentationButtons: {
      width: '100%',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexDirection: 'row' as 'row',
    },
  };

  return (
    <div style={{ background: '#CDCDCD', width: '100%', height: '100vh' }}>
      <div style={styles.presentationButtons}>
        <Button
          loading={loading}
          onClick={() => setLoading(!loading)}
          colorScheme="primary"
          size="lg"
          disabled={disabled}
          startIcon={<EmptyIcon />}
          endIcon={<EmptyIcon />}
        >
          Style
        </Button>
        <Button
          loading={loading}
          onClick={() => setLoading(!loading)}
          colorScheme="secondary"
          disabled={disabled}
          startIcon={<EmptyIcon />}
          endIcon={<EmptyIcon />}
        >
          Style
        </Button>
        <Button
          loading={loading}
          onClick={() => setLoading(!loading)}
          colorScheme="ghost"
          size="sm"
          disabled={disabled}
          startIcon={<EmptyIcon />}
          endIcon={<EmptyIcon />}
        >
          Style
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 4, background: '#CDCDCD' }}>
        <Card
          video="/avatars/mira_style1.MP4"
          contentType="video"
          active
        />
        <Card
          video="/avatars/mira_style1.MP4"
          contentType="video"
        />
        <Card
          active
          label="Mira"
          image={MiraImage.src}
          contentType="image"
        />
        <Card
          image={YukiImage.src}
          label="Yuki"
          contentType="image"
        />
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <CharacterSelectButton
          loading={loading}
          size="lg"
          onClick={() => {
            setIsActive(!active);
            setLoading(!loading);
          }}
          active={active}
          name="Yuki"
          description="web3dev"
          icon={<Web3devIcon />}
        />
        <CharacterSelectButton
          loading={loading}
          size="lg"
          onClick={() => {
            setIsActive(!active);
            setLoading(!loading);
          }}
          active={active}
          name="Mira"
          description="Cyberfox"
          icon={<CyberfoxIcon />}
          disabled
        />
        <CharacterSelectButton
          loading={loading}
          size="md"
          onClick={() => {
            setIsActive(!active);
            setLoading(!loading);
          }}
          active={active}
          name="Mira"
          description="Cyberfox"
          icon={<CyberfoxIcon />}
        />
      </div>
    </div>
  );
};

export default Components;
