import axios from "axios";
import { UserContextProvider } from "./UserContext";
import { MessagesProvider } from './MessageContext';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Route, Routes } from "react-router-dom"; // Import HashRouter instead of Router
import Groups from "./Groups";
import ContactPage from "./ContactPage";
import MessagePage from "./MessagePage";
import Rotes from "./Routes";  // Assuming this is the correct import
import './App.css';


function App() {
  axios.defaults.baseURL = 'http://localhost:4040';
  // axios.defaults.baseURL = 'https://vchat-backend-cs72.onrender.com';
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <MessagesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Rotes />} />
          <Route path="/contacts" element={<ContactPage />} />
            <Route path="/messages/:selectedUserId" element={<MessagePage />} />
            <Route path="/Home" element={<Rotes />} />
           <Route path="/Groups" element={<Groups />} />

        </Routes>
        </Router>
      </MessagesProvider>
    </UserContextProvider>
  );
}

export default App;
