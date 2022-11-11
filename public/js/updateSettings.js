/* eslint-disable */
const axios = require('axios').default;
const { showAlert } = require('./alerts');

// type is either 'password' or 'data'
const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:8000/api/v1/users/updateMyPassword'
        : 'http://localhost:8000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${
          type[0].toUpperCase() + type.substr(1).toLowerCase()
        } updated successfully!`
      );

      // setTimeout(() => location.reload(), 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

module.exports = { updateSettings };
