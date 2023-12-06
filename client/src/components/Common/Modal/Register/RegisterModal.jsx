// Modal.jsx
import ReactModal from 'react-modal';
import styles from './RegisterModal.module.scss';
import PropTypes from 'prop-types';
import close from '../close.svg';

const RegisterModal = ({ isOpen, onClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.overlay}
      className={styles.modal}
      shouldCloseOnOverlayClick={true}
    >
      <button className={styles.closeButton} onClick={onClose}>
        <img src={close} alt="Close" />
      </button>
      {children}
    </ReactModal>
  );
};

RegisterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default RegisterModal;
