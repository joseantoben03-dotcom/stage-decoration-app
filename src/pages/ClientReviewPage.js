import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Import the signOut function

const ClientReviewPage = () => {
    // This component now ONLY handles submitting a review
    const [review, setReview] = useState('');
    const [name, setName] = useState('');
    const [event, setEvent] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!auth.currentUser) {
            setError('You must be logged in to leave a review.');
            return;
        }

        try {
            await addDoc(collection(db, "reviews"), {
                name: name,
                event: event,
                quote: review,
                createdAt: serverTimestamp(),
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email
            });
            setSuccess('Thank you for your review! It has been submitted.');
            setName('');
            setEvent('');
            setReview('');
            setTimeout(() => navigate('/'), 2000); // Go home after 2 seconds
        } catch (err) {
            setError('Failed to submit review. Please try again.');
            console.error(err);
        }
    };

    // THIS IS THE GLOW-UP: A function to handle logging out
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error("Failed to log out", error);
            setError("Failed to log out. Please try again.");
        }
    };

    return (
        <Container className="my-5">
            <div className="glass-card">
                <h2 className="text-center mb-4">Leave a Review</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmitReview}>
                    <Form.Group className="mb-3">
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control type="text" placeholder="e.g., Priya & Rohan" value={name} onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Event Type</Form.Label>
                        <Form.Control type="text" placeholder="e.g., Wedding" value={event} onChange={(e) => setEvent(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Your Review</Form.Label>
                        <Form.Control as="textarea" rows={5} value={review} onChange={(e) => setReview(e.target.value)} required />
                    </Form.Group>

                    <div className="d-grid">
                        <Button className="btn-custom" type="submit">
                            Submit Review
                        </Button>
                    </div>
                </Form>
                {/* ADDED A LOGOUT BUTTON */}
                <div className="text-center mt-3">
                    <Button variant="link" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default ClientReviewPage;

