import { FC } from 'react';
import classNames from './SceneLoad.module.scss';
import { observer } from 'mobx-react';
import Modal from '@app/components/Modal';
import useEditorStore from '@app/containers/Editor/hooks/useEditorStore';

const ErrorModal: FC = observer(() => {
  const { isLoadErrorModalOpen, setIsLoadErrorModalOpen } = useEditorStore();
  return (
    <Modal
      isOpen={isLoadErrorModalOpen}
      onChangeIsOpen={setIsLoadErrorModalOpen}
    >
      <Modal.Header onCloseClick={() => setIsLoadErrorModalOpen(false)} />
      <Modal.Content>
        <div className={classNames.errorText_container}>
          <div className={classNames.errorText_text}>
            <div>🤷‍♂</div>
            Unfortunately, something went wrong.
          </div>
          <div className={classNames.errorText_text}>Try later</div>
        </div>
      </Modal.Content>
      <Modal.Footer>
        Footer
      </Modal.Footer>
    </Modal>
  );
});

export default ErrorModal;
