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

export interface UserData {
  name: string;
  phone: string;
  email: string;
  comments: string;
}

const InitialData: UserData = {
  name: '',
  phone: '',
  email: '',
  comments: '',
};

const Form: FC = observer(() => {
  const { setFormResultModalIsOpen } = useAboutStore();
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

  const submit = async (data: UserData) => {
    console.log(data);
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
        name="name"
        label="Name*"
        placeholder="Name*"
        showValidationMessages
        clearable
      />
      <FormInput
        control={control}
        name="phone"
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
      >
        Send message
      </button>
    </form>
  );
});

export default Form;
