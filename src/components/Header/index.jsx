/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
import "./style.scss";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

import logoImg from "../../assets/images/logoImg.png";
import { toast } from "react-toastify";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

const Header = (props) => {
  const [hideHeader, setHideHeader] = useState(false);
  const { logout, user } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    navigate("/");

    toast.success("Log out success");
  };

  useEffect(() => {
    if (window.location.pathname === "/login") {
      setHideHeader(true);
    }
  }, []);

  return (
    <>
      <Navbar bg="light" expand="lg" className="nav-bar">
        <Container>
          <Navbar.Brand href="/">
            {/* <span>Management</span> */}
            <img
              src={logoImg}
              alt="logo image"
              width={50}
              height={50}
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            {(user || user.auth || window.location.pathname === '/') && (
              <>
                <Nav className="me-auto">
                  <NavLink to="/" className="nav-link">
                    Home
                  </NavLink>
                  <NavLink to="/users" className="nav-link">
                    UserManage
                  </NavLink>
                </Nav>

                <Nav>
                  {user && user.email && (
                    <p className="nav-link user-login">{user.email}</p>
                  )}
                  <NavDropdown title="Setting" id="basic-nav-dropdown">
                    {user && user.auth === true ? (
                      <NavDropdown.Item onClick={() => handleLogOut()}>
                        Log out
                      </NavDropdown.Item>
                    ) : (
                      <NavLink to="/login" className="dropdown-item">
                        Log in
                      </NavLink>
                    )}
                  </NavDropdown>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
