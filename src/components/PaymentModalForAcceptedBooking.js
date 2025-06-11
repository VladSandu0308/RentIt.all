// components/PaymentModalForAcceptedBooking.js
import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../services/stripe';
import { server } from '../services/axios';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

const PaymentForm = ({ booking, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const alert = useAlert();
    const { t } = useTranslation();
    
    const [clientSecret, setClientSecret] = useState('');
    const [paymentData, setPaymentData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        initiatePayment();
    }, []);

    const initiatePayment = async () => {
        try {
            setIsInitializing(true);
            const response = await server.post('/initiate-payment-for-booking', {
                connection_id: booking.connection_id
            });
            
            setClientSecret(response.data.client_secret);
            setPaymentData(response.data);
            
        } catch (error) {
            console.error('Error initiating payment:', error);
            alert.error('Error initializing payment');
        } finally {
            setIsInitializing(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!stripe || !elements) {
            setIsLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: `${booking.user.first_name} ${booking.user.last_name}`,
                    email: booking.user.email,
                },
            },
        });

        if (error) {
            console.error('Payment failed:', error);
            alert.error(`Payment failed: ${error.message}`);
            
            // Notify backend of failure
            await server.post('/complete-payment-for-booking', {
                payment_intent_id: paymentIntent?.id || clientSecret.split('_secret')[0],
                status: 'failed'
            });
        } else {
            console.log('Payment succeeded:', paymentIntent);
            alert.success('Payment successful! Your booking is now confirmed.');
            
            // Notify backend of success
            await server.post('/complete-payment-for-booking', {
                payment_intent_id: paymentIntent.id,
                status: 'succeeded'
            });

            onSuccess(paymentIntent);
        }

        setIsLoading(false);
    };

    if (isInitializing) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <span>Initializing payment...</span>
            </div>
        );
    }

    if (!paymentData) {
        return (
            <div className="text-center p-8">
                <p className="text-red-600">Failed to initialize payment. Please try again.</p>
                <button 
                    onClick={initiatePayment}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-textMain mb-3 flex items-center">
                    <Icon icon="material-symbols:confirmation-number" className="mr-2" height="20" />
                    Booking Confirmation
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Property:</span>
                        <span className="font-medium">{paymentData.booking_details.location_title}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Address:</span>
                        <span>{paymentData.booking_details.location_address}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span>{new Date(paymentData.booking_details.check_in).toLocaleDateString('ro-RO')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span>{new Date(paymentData.booking_details.check_out).toLocaleDateString('ro-RO')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Nights:</span>
                        <span>{paymentData.booking_details.nights}</span>
                    </div>
                </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-primary/20 p-4 rounded-lg">
                <h3 className="font-semibold text-textMain mb-3 flex items-center">
                    <Icon icon="material-symbols:receipt" className="mr-2" height="20" />
                    Payment Details
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Accommodation ({paymentData.booking_details.nights} nights):</span>
                        <span>{paymentData.cost_breakdown.host_amount} RON</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Platform service fee (10%):</span>
                        <span>{paymentData.cost_breakdown.platform_commission} RON</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Government tourism tax (5%):</span>
                        <span>{paymentData.cost_breakdown.government_tax} RON</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total Amount:</span>
                        <span className="text-green-600">{paymentData.cost_breakdown.total} RON</span>
                    </div>
                </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-textMain text-sm font-bold mb-2 flex items-center">
                        <Icon icon="material-symbols:credit-card" className="mr-2" height="16" />
                        Card Details
                    </label>
                    <div className="p-3 border border-gray-300 rounded-lg bg-white">
                        <CardElement options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': { color: '#aab7c4' },
                                },
                                invalid: { color: '#9e2146' },
                            },
                        }} />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!stripe || isLoading}
                        className={`flex-1 py-3 px-4 rounded-lg text-white font-semibold transition-colors duration-300 ${
                            isLoading || !stripe
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Processing Payment...
                            </div>
                        ) : (
                            <>
                                <Icon icon="material-symbols:lock" className="inline mr-2" height="16" />
                                Pay {paymentData.cost_breakdown.total} RON
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="text-center text-xs text-gray-600 flex items-center justify-center">
                <Icon icon="material-symbols:security" className="mr-1" height="16" />
                Secured by Stripe • Your payment information is encrypted and secure
            </div>
        </div>
    );
};

const PaymentModalForAcceptedBooking = ({ booking, onClose, onSuccess }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-textMain flex items-center">
                        <Icon icon="material-symbols:payment" className="mr-2" height="28" />
                        Complete Your Booking
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <Icon icon="material-symbols:close" height="24" />
                    </button>
                </div>
                
                <Elements stripe={stripePromise}>
                    <PaymentForm 
                        booking={booking}
                        onSuccess={onSuccess}
                        onClose={onClose}
                    />
                </Elements>
            </div>
        </div>
    );
};

export default PaymentModalForAcceptedBooking;