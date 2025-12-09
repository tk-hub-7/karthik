import { X } from 'lucide-react';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 transition-opacity bg-black bg-opacity-75 backdrop-blur-sm"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-dark-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full border border-dark-700 animate-slide-up"
                    style={{ maxWidth: sizeClasses[size] }}
                >
                    <div className="bg-dark-900 px-6 py-4 border-b border-dark-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-dark-800 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="bg-dark-900 px-6 py-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
