import { useState, createContext, useContext } from 'react';
import CreateTeamModal from './CreateTeamModal';
import CreateProjectModal from './CreateProjectModal';
import CreateListModal from './CreateListModal';

export type ModalTypes = '' | 'createTeam' | 'createProject' | 'createList';

export interface ModalContextType {
  modalKey: string;
  showModal: (key: ModalTypes) => void;
  hideModal: () => void;
}

export const ModalContext = createContext<ModalContextType>({
  modalKey: '',
  showModal: () => null,
  hideModal: () => null
});

export const useModal = () => {
  const { showModal, hideModal } = useContext(ModalContext);

  return { showModal, hideModal };
};

export const ModalProvider: React.FC = ({ children }) => {
  const [modalKey, setModalKey] = useState<ModalTypes>('');

  const showModal = () => (key: ModalTypes) => {
    setModalKey(key);
  };

  const hideModal = () => () => {
    setModalKey('');
  };

  const mountModal = () => {
    switch (modalKey) {
      case 'createTeam':
        return <CreateTeamModal />;
      case 'createProject':
        return <CreateProjectModal />;
      case 'createList':
        return <CreateListModal />;
      default:
        return null;
    }
  };

  return (
    <ModalContext.Provider
      value={{
        modalKey,
        showModal: showModal(),
        hideModal: hideModal()
      }}
    >
      {children}
      {mountModal()}
    </ModalContext.Provider>
  );
};
