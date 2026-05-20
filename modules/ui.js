/**
 * UI Module
 * Handles general UI interactions like toast notifications.
 */

let toastTimeout;

export const showToast = (message = 'Changes saved successfully.') => {
    const toast = document.getElementById('save-toast');
    if (toast) {
        const textSpan = toast.querySelector('span');
        if (textSpan) {
            textSpan.textContent = message;
        }

        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};
