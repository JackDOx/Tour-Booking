

import { showAlert } from './alerts.js';

export const bookTour = async tourId => {
  const stripe = Stripe('pk_test_51N1lEJHSiOz7BD5IolfXrF7iKFdYDeWL9gIm5fIFcLvUuNBUZcSJ7yVXilrONW5qeWHGqtAIyJHoAqF2C2PK2ZhD004N6WAnQv');
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
