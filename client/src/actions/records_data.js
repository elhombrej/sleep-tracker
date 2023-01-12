import axios from "axios";
export const GET_RECORDS_USER_DATE = "GET_RECORDS_USER_DATE";
export const GET_RECORDS_RANGE = "GET_RECORDS_RANGE"

export const getRecordsQuery = (id, date) => {
    return async function (dispatch) {
      try {
        const response = await axios.get(
          `http://localhost:3001/newrecord?id=${id}&date=${date}`
        );
        dispatch({
          type: GET_RECORDS_USER_DATE,
          payload: response.data,
        });
      } catch (err) {
        console.log(`${err} try again`);
      }
    };
  };
  
  export const getRecordsRange = (id, date, endDate) => {
    return async function (dispatch) {
      try {
        const response = await axios.get(
          `http://localhost:3001/recordrange/?id=${id}&date=${date}&endDate=${endDate}`
        );
        dispatch({
          type: GET_RECORDS_RANGE,
          payload: response.data,
        });
      } catch (err) {
        console.log(`${err} try again`);
      }
    };
  };
  
  
 