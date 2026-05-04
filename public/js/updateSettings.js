/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:8000/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account settings updated.');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Error: ' + err.response.data.message);
  }
};
