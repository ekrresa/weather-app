import { ReactNode, SyntheticEvent } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import styled from 'styled-components';

type ModalProps = {
  children: ReactNode;
  handleClose: () => void;
  modalOpen: boolean;
  onClick: () => void;
};

export function Modal({ children, handleClose, modalOpen, onClick }: ModalProps) {
  return (
    <AnimatePresence initial={false} onExitComplete={() => null} exitBeforeEnter>
      {modalOpen && (
        <Backdrop
          as={motion.div}
          onClick={onClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <StyledModal
            as={motion.div}
            onClick={(e: SyntheticEvent) => e.stopPropagation()}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
            <button className="close__btn" onClick={handleClose}>
              <IoClose />
            </button>
          </StyledModal>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

const dropIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 3,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 30,
      stiffness: 400,
    },
  },
  exit: {
    scale: 0,
  },
};

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #000000e1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledModal = styled.div`
  position: relative;
  max-width: 30rem;
  min-width: 13rem;
  margin: auto;
  padding: 2rem;
  border-radius: 6px;
  background: #fffff0;
  color: #333;
  display: flex;
  flex-direction: column;

  .close__btn {
    border: 1px solid #fffff0;
    background: inherit;
    position: absolute;
    padding: 0.2rem;
    border-radius: 50%;
    cursor: pointer;
    top: 3%;
    right: 2%;

    svg {
      font-size: 1.5rem;
    }
  }

  .modal__content {
    font-weight: 500;

    p {
      margin-block: 0.5rem;
    }
  }
`;
