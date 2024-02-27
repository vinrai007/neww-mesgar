import {useContext, useState} from "react";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";
import Logo from "./Logo";
// import {button } from 'react-bootstrap';


// import 'bootstrap/dist/css/bootstrap.min.css';

export default function RegisterAndLoginForm() {
  const base_url  = 'http://localhost:4040';
  // const base_url = `https://vchat-backend-cs72.onrender.com`;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
  const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);
  async function handleSubmit(ev) {
    ev.preventDefault();
    // const url = isLoginOrRegister === 'register' ? /*'register' : 'login' */ 'http://localhost:4040/register' : 'http://localhost:4040/login';
    const url = isLoginOrRegister === 'register' ? /*'register' : 'login' */ `${base_url}/register` : `${base_url}/login`;
    const {data} = await axios.post(url, {username,password});
    setLoggedInUsername(username);
    setId(data.id);
  }
  return (
        <>
    <div className="w-full absolute top-0 " >
                <Logo username={username} />

    </div>
      <div className="bg-blue-50 h-screen flex items-center">
        
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input value={username}
               onChange={ev => setUsername(ev.target.value)}
               type="text" placeholder="username"
               className="block w-full rounded-sm p-2 mb-2 border" />
        <input value={password}
               onChange={ev => setPassword(ev.target.value)}
               type="password"
               placeholder="password"
               className="block w-full rounded-sm p-2 mb-2 border" />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2 hover:bg-sky-700">
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </button>
        <div className="text-center mt-2">
          {isLoginOrRegister === 'register' && (
            <div>
              Already a member?
              <button className="ml-1 bg-blue-500 text-white  rounded-sm p-1 hover:bg-sky-700" onClick={() => setIsLoginOrRegister('login')}>
                Login here
              </button>
            </div>
          )}
          {isLoginOrRegister === 'login' && (
            <div>
              Dont have an account?
              <button className="ml-1 bg-blue-500 text-white  rounded-sm p-1 hover:bg-sky-700" onClick={() => setIsLoginOrRegister('register')}>
                Register
              </button>
            </div>
          )}
        </div>
      </form>
      </div>
      </>
  );
}