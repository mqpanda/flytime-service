// Modal.jsx
import styles from './RegisterModal.module.scss';
import PropTypes from 'prop-types';
import close from './close.svg';

const RegisterModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={close} alt="Close" />
        </button>
        {children}
      </div>
    </div>
  );
};

RegisterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default RegisterModal;
