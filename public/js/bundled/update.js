
import { showAlert } from './alerts.js';

// type is either 'password' or 'data'

export const updateSettings = async (data,type) => {
  try {
    const url = 
    type === 'password'
      ? '/api/v1/users/updateMyPassword'
      : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
      },
      {
      new: true,
      runValidators: true
      });


    if(res.data.status === 'success'){
      showAlert('success',`${type.toUpperCase()} Updated successfully`);
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500); //logged in -> going to / in 1.5 secs
    };
  
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};