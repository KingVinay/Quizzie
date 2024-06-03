import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            console.log("Token is valid");
            setIsAuthenticated(true);
          } else {
            console.log("Token is expired");
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Token validation error:", error);
          setIsAuthenticated(false);
        }
      } else {
        console.log("No token found");
        setIsAuthenticated(false);
      }

      setLoading(false); // Authentication check is complete
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
};

export default useAuth;
