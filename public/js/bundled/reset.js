// import axios from './../../../node_modules';
import {showAlert} from './alerts.js';

export const reset = async (token, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm
      }
    });

    if(res.data.status === 'success'){
      showAlert('success','Password reset successful');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500); //logged in -> going to / in 1.5 secs
    };

  } catch (err) {
   showAlert('error', err.response.data.message);
  };
};
