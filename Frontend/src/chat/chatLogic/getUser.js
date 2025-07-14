export const getOtherUser = (chat, loggedUser) => {
  // Find the user object in the array that doesn't belong to the logged-in user
  const otherUserWrapper = chat.users.find(u => u.user._id !== loggedUser._id);
  
  // For debugging, correctly log the first name
  if (otherUserWrapper) {
      console.log("Other user's name:", otherUserWrapper.user.firstName);
  }

  // Return the nested user object directly
  return otherUserWrapper?.user;
};