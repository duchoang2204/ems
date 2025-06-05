import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useInactivityLogout = (timeout = 10 * 60 * 1000) => {
  const { logout } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => logout(), timeout);
    };

    ['mousemove', 'keydown', 'click'].forEach(event =>
      window.addEventListener(event, reset)
    );

    reset();

    return () => {
      ['mousemove', 'keydown', 'click'].forEach(event =>
        window.removeEventListener(event, reset)
      );
      clearTimeout(timer);
    };
  }, [logout]);
};

export default useInactivityLogout;
