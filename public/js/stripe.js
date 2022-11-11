const axios = require('axios').default;
const { showAlert } = require('./alerts');

/* eslint-disable */
const stripe = require('stripe')(
  'pk_test_51M2YKZKDRTp9okuWtDXpuJ3UXwuHKjx8peUPOJdScmaUNUKuPEiFC2xrw3Cc7wCdDrQjoi5WKPHAfNXQYqIOmZrR00Ca9VQhrW'
);

const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API (End Point)
    const session = await axios(
      // `http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + charge credit card
    window.location.replace(session.data.session.url);
  } catch (error) {
    console.log(error);
    showAlert('error', error.message);
  }
};

module.exports = { bookTour };
