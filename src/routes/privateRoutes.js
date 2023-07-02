import { useContext } from "react";
import { UserContext } from "../context/UserContext";

import { Alert } from "react-bootstrap";

const PrivateRoutes = (props) => {
  const { user } = useContext(UserContext);

  if (user && !user.auth) {
    return (
      <Alert variant="danger" dismissible >
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>
            You are not logged in.
        </p>
      </Alert>
    );
  }
  return (
    <>
      {props.children}
    </>
  );
};

export default PrivateRoutes;
