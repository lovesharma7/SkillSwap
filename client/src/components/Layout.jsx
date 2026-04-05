import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();

  const storedUser = localStorage.getItem("user");
  const isLoggedIn = !!storedUser;

  // Routes where navbar should be hidden
  const hideNavbarRoutes = ["/", "/signup"];

  const shouldHideNavbar =
    !isLoggedIn || hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="bg-gray-950 text-white">

      {!shouldHideNavbar && <Navbar />}

      <div
        className={
          shouldHideNavbar
            ? "min-h-screen"
            : "h-[calc(100vh-65px)] overflow-y-auto"
        }
      >
        {children}
      </div>

    </div>
  );
}

export default Layout;
