import { useState, useContext } from "react";
import "./style.scss";
import { toast } from "react-toastify";

import { loginApi } from "../../services/userService";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  //go to home when success
  const navigate = useNavigate();

  const {loginContext} = useContext(UserContext)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //show, hide password
  const [showPassword, setShowPassword] = useState(false);

  //show lodding icon
  const [loadingIcon, setLoadingIcon] = useState(false);

  // useEffect(() => {
  //   let token = localStorage.getItem('token');

  //   if(token) {
  //     navigate('/')
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])


  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //submit
  const handleSubmit = async () => {
    if(!email || !password){
      toast.error('Email or Password is empty');
    }

    setLoadingIcon(true)

    let res = await loginApi( email.trim(), password);

    if(res && res.token) {
      loginContext(email, res.token)
      navigate('/')
    } else {
      //error
      if(res && res.status === 400){
        toast.error(res.data.error)
      }
    }

    setLoadingIcon(false)
  };

  const handleKeyPress = async (e) => {
    if(e && e.key === 'Enter'){
      await handleSubmit();
    }
  }
  return (
    <div className="login-container col-12 col-sm-4">
      <div className="title">Log In</div>

      <div className="text">Email or Username ('eve.holt@reqres.in')</div>

      <input
        type="text"
        placeholder="Email or Username ..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="input-password">
        <input
          className="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password ..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown = {(e) => handleKeyPress(e)}
        />
        <i
          className={
            showPassword ? "fa-solid fa-eye-slash eye" : "fa-solid fa-eye eye"
          }
          onClick={() => handleShowPassword()}
        ></i>
        {/* <i class=""></i> */}
      </div>

      <button
        className={email && password ? "active" : ""}
        onClick={() => handleSubmit()}
        disabled = {email && password ? false : true}
      >
        {loadingIcon && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
        
        &nbsp;Login
      </button>

      <div className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <Link to='/' className="nav-link">Go Back</Link>
      </div>
    </div>
  );
};

export default Login;
