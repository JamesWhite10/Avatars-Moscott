import React, {
  useEffect,
  useState,
} from 'react';
import Hint from '@app/components/Hint/Hint';
import { useController, UseControllerProps } from 'react-hook-form';
import Input, { InputProps } from '@app/components/Input/Input';

export interface FormProps {
  label?: string;
  hintText?: string;
  showValidationMessages?: boolean;
  onBlur?: () => void;
}

export type FormInputProps = Omit<InputProps, 'value'> & UseControllerProps<any> & FormProps;

const FormInput: React.FC<FormInputProps> = (props) => {
  const {
    label,
    disabled = false,
    hintText = '',
    clearable,
    placeholder,
    showValidationMessages = true,
    onChange = () => undefined,
    onBlur = () => undefined,
    name,
    rules,
    control,
  } = props;

  const [infoHintMessage, setInfoHintMessage] = useState<string>('');

  const { field, fieldState } = useController({
    name, rules, control,
  });

  const hintType = (fieldState.error && showValidationMessages) ? 'error' : 'info';

  const hintMessage = (fieldState.error && showValidationMessages) ? fieldState.error?.message : infoHintMessage;

  useEffect(() => {
    if (fieldState.error && fieldState.isDirty) {
      setInfoHintMessage(hintText);
    }
  }, [fieldState.error, fieldState.isDirty, hintText]);

  return (
    <div>
      <Input
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
        error={fieldState.error}
        name={field.name}
      />
      <div>
        <Hint
          type={hintType}
          text={hintMessage}
        />
      </div>
    </div>
  );
};

export default FormInput;
