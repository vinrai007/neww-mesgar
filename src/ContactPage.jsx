import {useContext, useEffect, useRef, useState} from "react";
import Avatar from "./Avatar.jsx";
import Logo from "./Logo.jsx";
import {UserContext} from "./UserContext.jsx";
import {uniqBy} from "lodash";
import axios from "axios";
import Contact from "./Contact.jsx";
import { Navigate } from "react-router-dom";
import UserSearch from './UserSearch';
import { debounce } from 'lodash';
import Spinner from 'react-bootstrap/Spinner';
import "bootstrap/dist/css/bootstrap.min.css";

// import { useHistory } from 'react-router-dom';


export default function Chat() {
  const [redirect, setRedirect] = useState(false);
  const [ws,setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [onflinePeople,setOnflinePeople] = useState({});
  const [offlinePeople,setOfflinePeople] = useState({});
  const [selectedUserId,setSelectedUserId] = useState(null);
  const [newMessageText,setNewMessageText] = useState('');
  const [messages,setMessages] = useState([]);
  const {username,id,setId,setUsername} = useContext(UserContext);
  const divUnderMessages = useRef();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const CHATBOT_USER = {
  _id: 'chatbot',
  username: 'VAN (Chatbot)',
  }; 
  
  useEffect(() => {
    connectToWs();
  }, [selectedUserId]);
  function connectToWs() {
    // const ws = new WebSocket('ws://localhost:4040');
    const ws = new WebSocket('wss://neww-mesgar10.onrender.com');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log('Disconnected. Trying to reconnect.');
        connectToWs();
      }, 1000);
    });
  }
  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({userId,username}) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log({ev,messageData});
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages(prev => ([...prev, {...messageData}]));
      }
    }
  }
  function logout() {
    axios.post('/logout').then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }
  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
      file,
    }));
    if (file) {
      axios.get('/messages/'+selectedUserId).then(res => {
        setMessages(res.data);
      });
    } else {
      setNewMessageText('');
      setMessages(prev => ([...prev,{
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      }]));
    }
  }
  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({behavior:'smooth', block:'end'});
    }
  }, [messages]);

  useEffect(() => {
    axios.get('/people').then(res => {
      const offlinePeopleArr = res.data
        .filter(p => p._id !== id)
        // .filter(p => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach(p => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

   useEffect(() => {
    axios.get('/people').then(res => {
      const onflinePeopleArr = res.data
        .filter(p => p._id !== id)
        .filter(p => !Object.keys(offlinePeople).includes(p._id));
      const onflinePeople = {};
      onflinePeopleArr.forEach(p => {
        onflinePeople[p._id] = p;
      });
      setOnflinePeople(onflinePeople);
      // setLoading(false);
      setTimeout(() => {
        // After 5 seconds, set loading to false
        setLoading(false);
      }, 5000);      
    });
   }, [offlinePeople]);   
  
    const debouncedSearch = debounce((query) => {
    if (query.trim() === '') {
      // Reset the search results to an empty array when the query is empty
      setSearchResults([]);
    } else {
      axios.get(`/search?query=${query}`).then(res => {
        setSearchResults(res.data);
      });
    }
    }, 300);

  const handleSearch = (query) => {
    debouncedSearch(query);
  };  


  useEffect(() => {
    if (selectedUserId) {
      axios.get('/messages/'+selectedUserId).then(res => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  const onlinePeopleExclOurUser = {...onlinePeople};
  delete onlinePeopleExclOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, '_id');

  const handleContactClick = (userId) => {
    setSelectedUserId(userId);
    setRedirect(true);
    // history.push(`/messages/${userId}`);
  };
  if (redirect) {
    return <Navigate to={`/messages/${selectedUserId}`} />;
  }  
  return (
    <div className="flex h-screen">
      <div className="bg-white w-full flex flex-col">
        <div className="flex-grow">
          <Logo username={username} />
            <div className="searchuser" >
            <UserSearch className="searchbar" onSearch={handleSearch} />
              <div className="searchresults" >
              {searchResults.map(result => (
              <Contact
                key={result._id}
                id={result._id}
                online={Object.keys(onflinePeople).includes(result._id)}
                username={result.username}
                onClick={() => handleContactClick(result._id)}
                selected={result._id === selectedUserId}
              />
            ))}                
            </div>
   
            </div>
         
          {/* <Logo /> */}
          {/* {Object.keys(onlinePeopleExclOurUser).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleExclOurUser[userId]}
              onClick={() => {setSelectedUserId(userId);console.log({userId})}}
              selected={userId === selectedUserId} />
          ))} */}
            {loading ? (
              // Render a loading spinner or message while data is being fetched
              // <Spinner animation="border" variant="primary" />
                  <div className="app d-flex align-items-center justify-content-center" style={{ marginTop: '100px' }}>
        <Spinner animation="border" role="status" className="mt-9" style={{ width: '5rem', height: '5rem' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
            ) : (
              <div>
                {/* {Object.keys(onflinePeople).map(userId => (
                  <Contact
                    key={userId}
                    id={userId}
                    online={true}
                    username={onflinePeople[userId].username}
                    onClick={() => handleContactClick(userId)}
                    selected={userId === selectedUserId} />
                ))} */}
                {Object.keys(offlinePeople).map(userId => (
                  <Contact
                    key={userId}
                    id={userId}
                    online={false}
                    username={offlinePeople[userId].username}
                    onClick={() => handleContactClick(userId)}
                    selected={userId === selectedUserId} />
                ))}
              </div>
          )}
                            {/* <Contact
                  key={CHATBOT_USER._id}
                  id={CHATBOT_USER._id}
                  online={true}  // Assuming the chatbot is always considered offline
                  username={CHATBOT_USER.username}
                  // onClick={() => setSelectedUserId(CHATBOT_USER._id)}
                  selected={CHATBOT_USER._id === selectedUserId}
                />    */}
        </div>
        {/* <div className="p-2 text-center flex items-center justify-center">
          <span className="mr-2 text-sm text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            {username}
          </span>
          <button
            onClick={logout}
            className="text-sm bg-blue-100 py-1 px-2 text-gray-500 border rounded-sm">logout</button>
        </div> */}
      </div>
    </div>
  );
}