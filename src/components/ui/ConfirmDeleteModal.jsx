import Modal from './Modal';
import Spinner from './Spinner';
import { HiOutlineExclamation } from 'react-icons/hi';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, loading, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="mt-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <HiOutlineExclamation className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="mt-3">
                <p className="text-sm text-gray-500">{message}</p>
            </div>
        </div>
        <div className="mt-5 sm:mt-6 flex justify-center gap-3">
            <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
                onClick={onClose}
                disabled={loading}
            >
                Cancel
            </button>
            <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto disabled:bg-red-300"
                onClick={onConfirm}
                disabled={loading}
            >
                {loading ? <Spinner /> : 'Delete'}
            </button>
        </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;