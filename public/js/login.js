/* eslint-disable */
const axios = require('axios').default;
const { showAlert } = require('./alerts');

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://localhost:8000/api/v1/users/login`,
      data: {
        email,
        password,
      },
      withCredentials: true,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://localhost:8000/api/v1/users/logout`,
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'logged out successfully!');
      location.reload(true);
    }
  } catch (error) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

module.exports = { login, logout };
