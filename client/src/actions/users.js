export function getUsersResponse(users) {
  return {
    type: "GET_USERS_RESPONSE",
    payload: users,
  };
}

export function getUsers(page, size, filters) {

  let nationality = '';
  let plan = '';
  let lastNames = '';

  if(filters?.nationality) { nationality = `&nationality=${filters.nationality}`;}
  if(filters?.plan) { plan = `&name=${filters.plan}`;} //en el back, Liz llama 'name' a plan
  if(filters?.lastNames) { lastNames = `&lastNames=${filters.lastNames}`;}

  return function (dispatch) {
    fetch(`${process.env.REACT_APP_DEFAULT_URL}/users?page=${page}&limit=${size}${nationality}${plan}${lastNames}`)
      .then((r) => r.json())
      .then((users) => dispatch(getUsersResponse(users)))
      .catch((error) => console.log(error));
  };
}

export async function updateUsers(updatedFields, id) {
  try {
    let result = await fetch(`${process.env.REACT_APP_DEFAULT_URL}/users/update/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(updatedFields),
    }).then((r) => r.json());
    return result;
  } catch (error) {
    console.log(error.message);
    return 0;
  }
}

export function getNationalitiesResponse(nationalities) {
  return {
    type: "GET_NATIONALITIES_RESPONSE",
    payload: nationalities,
  };
}

export function getNationalities() {
  return function (dispatch) {
   fetch(`${process.env.REACT_APP_DEFAULT_URL}/users/nationalities`)
      .then( r => r.json())
      .then( nationalities => dispatch(getNationalitiesResponse(nationalities)))
      .catch((error) => console.log(error));
  };
}
