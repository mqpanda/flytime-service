import ReactModal from 'react-modal';
import styles from './NewPostModal.module.scss';
import PropTypes from 'prop-types';
import close from '../../../../images/close.svg';

const NewPostModal = ({ isOpen, onClose, onSubmit, children }) => {
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
      <div className={styles.content}>
        {children}
        <button className={styles.submitButton} onClick={onSubmit}>
          Create Post
        </button>
      </div>
    </ReactModal>
  );
};

NewPostModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default NewPostModal;
