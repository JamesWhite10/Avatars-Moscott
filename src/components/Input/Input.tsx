import React, {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  forwardRef,
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import classNames from './Input.module.scss';
import cn from 'classnames';
import ClearIcon from '../Icons/ClearIcon';
import { FieldError } from 'react-hook-form';
import Fade from '@app/components/Transition/Fade';

export interface InputProps {
  label?: string;
  value?: string;
  clearable?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void;
  clearValue?: string;
  placeholder?: string;
  error?: FieldError;
}

const Input = forwardRef<HTMLInputElement, PropsWithChildren<InputProps>>((props, ref) => {
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
    error,
  } = props;

  const [innerValue, setInnerValue] = useState<string>(value);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value);
    onChange(e.target.value);
  }, [onChange, innerValue]);

  const onBlurHandler = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value);
    onBlur();
  }, [onBlur, innerValue]);

  const errorName = error ? classNames.input_error : '';

  const showClearIcon = useMemo(() => {
    const hasValueInput = innerValue ? innerValue.trim().length > 0 : false;
    return clearable && hasValueInput && !disabled;
  }, [clearable, innerValue, disabled]);

  const clearHandler = useCallback(() => {
    setInnerValue(clearValue);
    onChange(clearValue);
  }, [onChange, clearValue]);

  const keyDownInputHandler = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    onKeyPress(e);
  }, [onKeyPress]);

  return (
    <div className={classNames.formGroupField}>
      <input
        ref={ref}
        value={innerValue}
        type="text"
        className={cn(classNames.formFieldInput, errorName)}
        placeholder={placeholder}
        autoComplete="off"
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        onFocus={onFocus}
        onKeyDown={keyDownInputHandler}
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

export default Input;
