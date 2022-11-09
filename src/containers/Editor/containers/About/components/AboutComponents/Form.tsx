import React, { FC, useEffect } from 'react';
import FormInput from '@app/components/FormInput/FormInput';
import FormTextArea from '@app/components/FormTextArea/FormTextArea';
import { useForm } from 'react-hook-form';
import { FormValues } from '../../../../../../../pages/components';
import classNames from '../../About.module.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '@app/containers/Editor/containers/About/config';
import { useAboutStore } from '@app/containers/Editor/hooks/useEditorStore';
import { observer } from 'mobx-react';
import { SendBotMessageRequest } from '@app/api/sender/sendBotMessage';
import Spin from '@app/components/Spin/Spin';
import cn from 'classnames';

const InitialData: SendBotMessageRequest = {
  userName: '',
  phoneNumber: '',
  email: '',
  comments: '',
};

const Form: FC = observer(() => {
  const { setFormResultModalIsOpen, sendForm, formIsSending } = useAboutStore();
  const {
    control,
    handleSubmit,
    reset,
    formState,
  } = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: InitialData,
  });

  const submit = async (data: SendBotMessageRequest) => {
    const { userName, phoneNumber, email, comments } = data;
    await sendForm(userName, phoneNumber, email, comments);
    setFormResultModalIsOpen(true);
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <form
      className={classNames.form}
      onSubmit={handleSubmit(submit)}
    >
      <FormInput
        control={control}
        name="userName"
        label="Name*"
        placeholder="Name*"
        showValidationMessages
        clearable
      />
      <FormInput
        control={control}
        name="phoneNumber"
        label="Phone number"
        placeholder="Phone number"
        showValidationMessages
        clearable
      />
      <FormInput
        control={control}
        name="email"
        label="Email*"
        placeholder="Email*"
        showValidationMessages
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
      <button
        className={classNames.buttonMessage}
        type="submit"
        disabled={formIsSending}
      >
        <Spin
          isActive={formIsSending}
          color="#FFFFFF"
          borderRadius={12}
          overlayBackgroundColor="initial"
          position="stretch"
        />
        <div className={cn(classNames.submitButton, { [classNames.submitButton_loading]: formIsSending })}>
          Send message
        </div>
      </button>
    </form>
  );
});

export default Form;
