// import axios from './../../../node_modules';
import {showAlert} from './alerts.js';

export const forgot = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email
      }
    });

    if(res.data.status === 'success'){
      showAlert('success','An email was sent to your email. Check your email.');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500); //logged in -> going to / in 1.5 secs
    };

  } catch (err) {
   showAlert('error', err.response.data.message);
  };
};
