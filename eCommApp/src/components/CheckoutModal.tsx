import { useEffect, useRef } from 'react';

interface CheckoutModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const CheckoutModal = ({ onConfirm, onCancel }: CheckoutModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) {
            dialog.showModal();
        }
        return () => {
            dialog?.close();
        };
    }, []);

    return (
        <dialog ref={dialogRef} className="modal-dialog" onClose={onCancel} aria-labelledby="checkout-modal-heading">
            <div className="modal-content">
                <h2 id="checkout-modal-heading">Are you sure?</h2>
                <p>Do you want to proceed with the checkout?</p>
                <div className="checkout-modal-actions">
                    <button onClick={onConfirm}>Continue Checkout</button>
                    <button onClick={onCancel} className="cancel-btn">Return to cart</button>
                </div>
            </div>
        </dialog>
    );
};

export default CheckoutModal;
