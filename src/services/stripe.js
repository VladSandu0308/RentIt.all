// services/stripe.js
import { loadStripe } from '@stripe/stripe-js';

// Folosește cheia publică de test
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RWjoj4e62nl5o98Xa2QVaTIQmUELVkqi17cICZN8s9WSiM9IPDoewjGxusaQm7PudkpXflz0JWCrSQog0zXatLN00zhCGo0Vo');

export default stripePromise;