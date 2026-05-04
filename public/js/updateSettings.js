/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

// type is either password or data
export const updateData = async (data, type) => {
  const url =
    type === 'password'
      ? 'http://localhost:8000/api/v1/users/updateMyPassword'
      : 'http://localhost:8000/api/v1/users/updateMe';
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Account ${type.toUpperCase()} updated.`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Error: ' + err.response.data.message);
  }
};
