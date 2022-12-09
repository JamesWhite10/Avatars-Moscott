import React, { useRef, useState } from 'react';
import Button from '@app/components/Button/Button';
import { CyberfoxIcon, EmptyIcon, Web3devIcon } from '@app/components/Icons';
import Card from '@app/components/Card';
import MiraImage from '@app/assets/mira.png';
import YukiImage from '@app/assets/yuki.png';
import CharacterSelectButton from '@app/components/CharacterSelectButton';
import FormInput from '@app/components/FormInput/FormInput';
import { FieldValues, useForm } from 'react-hook-form';
import FormTextArea from '@app/components/FormTextArea/FormTextArea';
import AnimatedButton from '@app/components/AnimatedButton/AnimatedButton';
import NavButton from '@app/components/NavButton';
import AnimationIcon from '@app/components/Icons/AnimationIcon';
import ScrollArea from '@app/components/ScrollArea';
import { appConfig } from '@app/config/appConfig';

export interface FormValues extends FieldValues {
  userName: string;
  phoneNumber: string;
  email: string;
  comments: string;
}

const Components = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled] = useState<boolean>(false);
  const [active, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<NodeJS.Timer>();

  const playHandler = () => {
    if (playing) {
      if (timer.current) clearInterval(timer.current);
      setPlaying(false);
      return;
    }
    setPlaying(true);
    timer.current = setInterval(() => {
      if (progress === 100) {
        setProgress(0);
        clearInterval(timer.current);
        return;
      }
      setProgress((oldProgress) => oldProgress + 1);
    }, 1000);
  };

  const {
    control,
    handleSubmit,
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      comments: '',
    },
  });

  const submit = (data: FieldValues) => console.log(data);

  const styles = {
    presentationButtons: {
      width: '100%',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexDirection: 'row' as 'row',
    },
  };

  const stateButton = () => {
    setIsActive(!active);
    if (active) {
      setLoading(!loading);
      setIsActive(!active);
    }
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
          isLoading
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
        <Card
          video="/avatars/mira_style1.MP4"
          contentType="video"
          active
          isLoading
          contentSize="sm"
        />
        <Card
          video="/avatars/mira_style1.MP4"
          contentType="video"
          contentSize="sm"
        />
        <Card
          active
          label="Mira"
          image={MiraImage.src}
          contentType="image"
          contentSize="sm"
        />
        <Card
          image={YukiImage.src}
          label="Yuki"
          contentType="image"
          contentSize="sm"
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
      <form onSubmit={handleSubmit(submit)}>
        <div style={{ display: 'flex', gap: 4, background: '#CDCDCD' }}>
          <FormInput
            control={control}
            name="name"
            label="Name"
            placeholder="Name"
            showValidationMessages={false}
            clearable
          />
          <FormTextArea
            control={control}
            name="comments"
            label="Your comments"
            placeholder="Your comments"
            showHintMessages={false}
            clearable
          />
        </div>
        <button type="submit">Send</button>
      </form>
      <div>
        <AnimatedButton
          isPaused={false}
          progress={progress}
          active={playing}
          onClick={playHandler}
        >
          Animation
        </AnimatedButton>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <NavButton
          active={active}
          loading={loading}
          onClick={() => {
            stateButton();
          }}
          icon={<AnimationIcon />}
        />
      </div>
      <div>
        <ScrollArea
          active={active}
          contentSize="lg"
          content={appConfig.styles}
        >
          {
            appConfig.styles.map((style) => (
              <div
                key={style.id}
                style={{ width: '96px' }}
              >
                <Card
                  contentType="video"
                  video={style.videoUrl}
                />
              </div>
            ))
          }
        </ScrollArea>
      </div>
    </div>
  );
};

export default Components;
