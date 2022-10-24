import React, {
  ChangeEvent, FocusEvent,
  forwardRef,
  KeyboardEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from './Textarea.module.scss';
import ClearIcon from '../Icons/ClearIcon';
import Fade from '@app/components/Transition/Fade';

export interface TextareaProps {
  label?: string;
  value?: string;
  clearable?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  clearValue?: string;
  placeholder?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, PropsWithChildren<TextareaProps>>((props, ref) => {
  const {
    label,
    value = '',
    clearable = false,
    disabled = false,
    clearValue = '',
    onChange = () => undefined,
    onBlur = () => undefined,
    onFocus = () => undefined,
    onKeyPress = () => undefined,
    placeholder,
  } = props;

  const [innerValue, setInnerValue] = useState<string>(value);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInnerValue(e.target.value);
    onChange(e.target.value);
  }, [onChange, innerValue]);

  const onBlurHandler = useCallback((e: FocusEvent<HTMLTextAreaElement>) => {
    setInnerValue(e.target.value);
    onBlur();
  }, [onBlur, innerValue]);

  const showClearIcon = useMemo(() => {
    const hasValueTextArea = innerValue ? innerValue.trim().length > 0 : false;
    return clearable && hasValueTextArea && !disabled;
  }, [clearable, innerValue, disabled]);

  const clearHandler = useCallback(() => {
    setInnerValue(clearValue);
    onChange(clearValue);
  }, [onChange, clearValue]);

  const keyDownTextAreaHandler = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyPress(e);
  }, [onKeyPress]);

  return (
    <div
      className={classNames.formGroupField}
    >
      <textarea
        ref={ref}
        value={innerValue}
        className={classNames.formFieldTextArea}
        placeholder={placeholder}
        autoComplete="off"
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        onFocus={onFocus}
        onKeyDown={keyDownTextAreaHandler}
        disabled={disabled}
      />
      <label
        className={classNames.formLabel}
      >
        {label}
      </label>
      <Fade enable={showClearIcon}>
        <div
          className={classNames.clearIcon}
          onClick={clearHandler}
        >
          <ClearIcon />
        </div>
      </Fade>
    </div>
  );
});

export default Textarea;
