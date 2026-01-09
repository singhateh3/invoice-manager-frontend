const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default Modal;
