import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import Hint from '@app/components/Hint/Hint';
import Textarea, { TextareaProps } from '@app/components/Textarea/Textarea';
import Fade from '@app/components/Transition/Fade';

export interface FormProps {
  label?: string;
  hintText?: string;
  onBlur?: () => void;
  showHintMessages?: boolean;
}

export type FormTextAreaProps = Omit<TextareaProps, 'value'> & UseControllerProps<any> & FormProps;

const FormTextArea: React.FC<FormTextAreaProps> = (props) => {
  const {
    label,
    disabled = false,
    hintText = '',
    clearable,
    placeholder,
    showHintMessages = true,
    onChange = () => undefined,
    onBlur = () => undefined,
    name,
    rules,
    control,
  } = props;

  const { field } = useController({
    name, rules, control,
  });

  return (
    <div>
      <Textarea
        label={label}
        placeholder={placeholder}
        ref={field.ref}
        disabled={disabled}
        value={field.value}
        clearable={clearable}
        onBlur={() => {
          field.onBlur();
          onBlur();
        }}
        onChange={(value: string) => {
          field.onChange(value);
          onChange(value);
        }}
      />
      <div>
        <Fade enable={showHintMessages}>
          <Hint
            type="info"
            text={hintText}
          />
        </Fade>
      </div>
    </div>
  );
};

export default FormTextArea;
