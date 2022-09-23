//PURPOSE: take an array, take the user logged-in, return a string value of the recipient (who we're talking to)

//NOTE: loggedInUser comes from the useAuthState hook_

// const getRecipientEmail = (users, loggedInUser) =>
//   users?.filter((userToFilter) => userToFilter !== loggedInUser?.email)[0];
// export default getRecipientEmail;

const getRecipientEmail = (users, loggedInUser) => {
  // console.log('getRecipientEmail running');
  return users?.filter(
    (userToFilter) => userToFilter !== loggedInUser?.email
  )[0];
};
export default getRecipientEmail;
