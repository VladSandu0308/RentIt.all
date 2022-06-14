import { useState } from 'react';

export default function useUser() {
  const getUser = () => {
    const tokenString = sessionStorage.getItem('user');
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const [user, setUser] = useState(getUser());

  const saveUser = userToken => {
    sessionStorage.setItem('user', JSON.stringify(userToken));
    setUser(userToken);
  };

  return {
    setUser: saveUser,
    user
  }

}