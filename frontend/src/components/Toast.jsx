import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={clsx(
            "fixed top-4 right-4 z-50 flex items-center p-4 rounded-xl shadow-lg border animate-slide-in",
            type === 'success' ? "bg-white border-green-100 text-green-800" : "bg-white border-red-100 text-red-800"
        )}>
            {type === 'success' ? <CheckCircle className="w-5 h-5 mr-3 text-green-500" /> : <AlertCircle className="w-5 h-5 mr-3 text-red-500" />}
            <span className="text-sm font-medium mr-4">{message}</span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
