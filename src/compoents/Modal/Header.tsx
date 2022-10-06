import { FC, PropsWithChildren } from 'react';
import classNames from './Modal.module.scss';
import { CloseIcon } from '@app/compoents/Icons';

export interface HeaderProps {
  onCloseClick: () => void;
}

const Header: FC<PropsWithChildren<HeaderProps>> = (props) => {
  const {
    onCloseClick,
    children,
  } = props;
  return (
    <div className={classNames.header}>
      { children }
      <div className={classNames.closeContainer}>
        <button
          type="button"
          className={classNames.closeButton}
          onClick={onCloseClick}
        >
          <CloseIcon className={classNames.closeIcon} />
        </button>
      </div>
    </div>
  );
};

export default Header;
