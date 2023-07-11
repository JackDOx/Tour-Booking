

import { showAlert } from './alerts.js';

export const bookTour = async tourId => {
  const stripe = Stripe('pk_test_51NCAQOFQZuy2dcaHp0V18YhchNNqFoPMblQnZpTw0XcvNcFcVKiqH1ADAOE5RABjz0OuocvkANwdujt3Ht0DpMrI00YdVH8ERC');
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};
