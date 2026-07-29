import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function GoogleOAuthRedirect() {
  const { completeGoogleLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handledToken = useRef(null);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const params = new URLSearchParams(location.search);
    const googleToken = params.get("googleToken");
    const authError = params.get("authError");

    if (authError) {
      navigate(`/login?authError=${encodeURIComponent(authError)}`, { replace: true });
      return;
    }

    if (!googleToken || handledToken.current === googleToken) return;

    handledToken.current = googleToken;
    completeGoogleLogin(googleToken)
      .then(() => navigate("/library", { replace: true }))
      .catch(() => navigate("/login?authError=%D7%94%D7%94%D7%AA%D7%97%D7%91%D7%A8%D7%95%D7%AA%20%D7%A2%D7%9D%20Google%20%D7%A0%D7%9B%D7%A9%D7%9C%D7%94", { replace: true }));
  }, [completeGoogleLogin, location.pathname, location.search, navigate]);

  return null;
}

export default GoogleOAuthRedirect;
