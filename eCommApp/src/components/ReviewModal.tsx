import { useEffect, useRef } from 'react';
import { Product, Review } from '../types';

interface ReviewModalProps {
    product: Product | null;
    onClose: () => void;
    onSubmit: (review: Review) => void;
}

const ReviewModal = ({ product, onClose, onSubmit }: ReviewModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (product && dialog && !dialog.open) {
            dialog.showModal();
            /* c8 ignore start -- unreachable: React unmounts dialog before effect re-runs with null product */
        } else if (!product && dialog?.open) {
            dialog.close();
        }
        /* c8 ignore stop */
        return () => {
            dialog?.close();
        };
    }, [product]);

    if (!product) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const author = (e.currentTarget.elements.namedItem('author') as HTMLInputElement).value;
        const comment = (e.currentTarget.elements.namedItem('comment') as HTMLTextAreaElement).value;
        onSubmit({ author, comment, date: new Date().toISOString() });
        e.currentTarget.reset();
    };

    return (
        <dialog ref={dialogRef} className="modal-dialog" onClose={onClose} aria-labelledby="review-modal-heading">
            <div className="modal-content">
                <h2 id="review-modal-heading">Reviews for {product.name}</h2>
                <div className="reviews-list">
                    {product.reviews.length > 0 ? (
                        product.reviews.map((review) => (
                            <div key={review.author + '-' + review.date} className="review">
                                <p><strong>{review.author}</strong> ({new Date(review.date).toLocaleDateString()}):</p>
                                <p>{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="review-form">
                    <h3>Leave a Review</h3>
                    <input type="text" name="author" placeholder="Your name" required />
                    <textarea name="comment" placeholder="Your review" required />
                    <button type="submit">Submit</button>
                </form>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </dialog>
    );
};

export default ReviewModal;
