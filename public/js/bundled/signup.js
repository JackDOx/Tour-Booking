// import axios from './../../../node_modules';
import {showAlert} from './alerts.js';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });
    
    if(res.data.status === 'success'){
      showAlert('success','Sign up successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500); //signed up -> going to / in 1.5 secs
    };

  } catch (err) {
   showAlert('error', err.response.data.message);
  };
};


