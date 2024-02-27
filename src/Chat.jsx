import {useContext, useEffect, useRef, useState} from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import {UserContext} from "./UserContext.jsx";
import {uniqBy} from "lodash";
import axios from "axios";
import Contact from "./Contact";
import UserSearch from './UserSearch';
import { debounce } from 'lodash';
import Spinner from 'react-bootstrap/Spinner';
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {Link} from "react-router-dom";



export default function Chat() {
  const [ws,setWs] = useState(null);
  const [onlinePeople,setOnlinePeople] = useState({});
  const [onflinePeople,setOnflinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId,setSelectedUserId] = useState(null);
  const [newMessageText,setNewMessageText] = useState('');
  const [messages,setMessages] = useState([]);
  const {username,id,setId,setUsername} = useContext(UserContext);
  const divUnderMessages = useRef();
  const [offlinePeopleConversations, setOfflinePeopleConversations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [modalVisibility, setModalVisibility] = useState({});

const handleShow = (messageId) => {
  setModalVisibility(prev => ({ ...prev, [messageId]: true }));
};

const handleClose = (messageId) => {
  setModalVisibility(prev => ({ ...prev, [messageId]: false }));
};
  
const CHATBOT_USER = {
  _id: 'chatbot',
  username: 'VAN (Chatbot)',
};
  
  useEffect(() => {
    connectToWs();
  }, [selectedUserId]);
  function connectToWs() {
    // const ws = new WebSocket('ws://localhost:4040');
    const ws = new WebSocket('wss://vchat-back-007.onrender.com');
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
  // function handleMessage(ev) {
  //   const messageData = JSON.parse(ev.data);
  //   console.log({ev,messageData});
  //   if ('online' in messageData) {
  //     showOnlinePeople(messageData.online);
  //   } else if ('text' in messageData) {
  //     if (messageData.sender === selectedUserId) {
  //       setMessages(prev => ([...prev, {...messageData}]));
  //     }
  //   }
  // }

function handleMessage(ev) {
  const messageData = JSON.parse(ev.data);

  if ('online' in messageData) {
    showOnlinePeople(messageData.online);
  } else if ('text' in messageData) {
    if (messageData.sender === selectedUserId) {
      setMessages(prev => [...prev, { ...messageData }]);
    } else if (messageData.sender === 'chatbot') {
      // Handle chatbot messages
      setMessages(prev => [...prev, { ...messageData }]);
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

  // Check if there's no text and no file, then return early
  if (!newMessageText && !file) {
    return;
  }

  ws.send(
    JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
      file,
    })
  );

  if (file) {
    axios.get('/messages/' + selectedUserId).then((res) => {
      setMessages(res.data);
    });
  } else {
    setNewMessageText('');
    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
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

      function breakText(text) {
  const maxLength = 200;
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
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

// useEffect(() => {
//   axios.get('/people').then(res => {
//     const offlinePeopleArr = res.data.filter(p => p._id !== id);
    
//     // Fetch users with whom the current user has had a conversation (text is not zero)
//     const offlinePeopleConversations = res.data
//       .filter(p => p._id !== id && p.text !== "")
//       .map(p => p._id);

//     const offlinePeople = {};
//     offlinePeopleArr.forEach(p => {
//       offlinePeople[p._id] = p;
//     });

//     setOfflinePeopleConversations(offlinePeopleConversations);
//     setOfflinePeople(offlinePeople);
//   });
// }, []);


  const debouncedSearch = debounce((query) => {
    if (query.trim() === '') {
      // Reset the search results to an empty array when the query is empty
      setSearchResults([]);
    } else {
      axios.get(`/search?query=${query}`).then(res => {
        setSearchResults(res.data);
      });
    }
  }, 300); // Debounce for 300 milliseconds

  // const debouncedSearch = debounce((query) => {
  //   if (query.trim() === '') {
  //     // Reset the search results to an empty array when the query is empty
  //     setSearchResults([]);
  //   } else {
  //     axios.get(`/search?query=${query}`).then(res => {
  //             const searchPeopleArr = res.data
  //       // setSearchResults(res.data);
  //               .filter(p => p._id !== id)
  //             const searchResults = {};
  //     searchPeopleArr.forEach(p => {
  //       searchResults[p._id] = p;
  //     });
  //     setSearchResults(searchResults);
        
  
  //     });
  //   }
  // }, 300);

  const handleSearch = (query) => {
    debouncedSearch(query);
  };


  // useEffect(() => {
  //   if (selectedUserId) {
  //     axios.get('/messages/'+selectedUserId).then(res => {
  //       setMessages(res.data);
  //     });
  //   }
  // }, [selectedUserId]);

useEffect(() => {
  if (selectedUserId === CHATBOT_USER._id) {
    // Fetch chatbot messages
    axios.get('/chatbot/messages').then(res => {
      setMessages(res.data);
    });
  } else {
    // Fetch messages for other users
    axios.get(`/messages/${selectedUserId}`).then(res => {
      setMessages(res.data);
    });
  }
}, [selectedUserId]);  

  const onlinePeopleExclOurUser = {...onlinePeople};
  delete onlinePeopleExclOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, '_id');

  //   if (loading) {
  //   return (
  //     <div className="app d-flex align-items-center justify-content-center" style={{ marginTop: '100px' }}>
  //       <Spinner animation="border" role="status" className="mt-9" style={{ width: '5rem', height: '5rem' }}>
  //         <span className="visually-hidden">Loading...</span>
  //       </Spinner>
  //     </div>
  //   );
  // }

  return (
    <div className="body">
    <div className="w-full absolute top-0 " >
                <Logo username={username} />

    </div>
    <div className="flex h-screen pt-14 mt-0 ">
      <div className="bg-white w-1/3 flex flex-col">
          <div className="flex-grow">
            <div className="searchuser" >
            <UserSearch className="searchbar" onSearch={handleSearch} />
              <div className="searchresults" >
              {searchResults.map(result => (
              <Contact
                key={result._id}
                id={result._id}
                online={Object.keys(onflinePeople).includes(result._id)}
                username={result.username}
                onClick={() => setSelectedUserId(result._id)}
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
                    onClick={() => setSelectedUserId(userId)}
                    selected={userId === selectedUserId} />
                ))} */}
                {Object.keys(offlinePeople).map(userId => (
                  <Contact
                    key={userId}
                    id={userId}
                    online={false}
                    username={offlinePeople[userId].username}
                    onClick={() => setSelectedUserId(userId)}
                    selected={userId === selectedUserId} />
                ))}
              </div>
            )}
           {/* {Object.keys(onflinePeople).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onflinePeople[userId].username}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId} />
          ))}            
          {Object.keys(offlinePeople).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].username}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId} />
          ))} */}
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
            {/* Display the chatbot contact */} 
                  {/* <Contact
                  key={CHATBOT_USER._id}
                  id={CHATBOT_USER._id}
                  online={true}  // Assuming the chatbot is always considered offline
                  username={CHATBOT_USER.username}
                  // onClick={() => setSelectedUserId(CHATBOT_USER._id)}
                  selected={CHATBOT_USER._id === selectedUserId}
                />         */}
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2 pt-0">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-300">&larr; Select a person from the sidebar</div>
            </div>
            )}
            {!!selectedUserId &&  selectedUserId === id &&(
            <div className="relative h-full msg">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2  ">
                {messagesWithoutDupes.map(message => (
                  <div key={message._id} className={(message.sender === id ? 'text-right pl-10': 'text-left pr-10 ')}>
                    {/* <div className={"text-left inline-block p-1 my-2 rounded-md text-sm max-w-96  " +(message.sender === id ? 'bg-blue-500 text-white':'bg-white text-gray-500')} style={{ maxWidth: '200px', overflowWrap: 'break-word' }}> */}
                <div className={`text-left inline-block p-1 my-2 rounded-md text-sm max-w-96 ${message.sender === selectedUserId ? 'bg-white text-gray-500' : 'bg-blue-500 text-white'}` }  >

                    <div className="msg p-1 whitespace-normal break-words" style={{ maxWidth: '250px', overflowWrap: 'break-word' }} >
                        {/* {message.text} */}
                    {breakText(message.text)}
                      </div>  
                      {message.file && (
                        <div className="">
                          <a target="_blank" className="flex items-center gap-1 " href={axios.defaults.baseURL + '/uploads/' + message.file}>
                            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                            </svg>
                            {message.file} */}
                            <div className="image  pt-1">
                              <img src={`${axios.defaults.baseURL + '/uploads/' + message.file}`} alt=""/>
                            </div>      
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}            
          {!!selectedUserId && selectedUserId  !== id && (
            <div className="relative h-full msg">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2  ">
{messagesWithoutDupes.map(message => (
  <div key={message._id} className={(message.sender === id ? 'text-right pl-10' : 'text-left pr-10 ')}>
    <div className={"text-left inline-block p-1 my-2 rounded-md text-sm max-w-96  " +(message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500')}>
      <div className="msg p-1 whitespace-normal break-words " style={{ maxWidth: '250px', overflowWrap: 'break-word' }}>
        {message.text}
      </div>
      {message.file && (
        <div className="">
          <a
            target="_blank"
            className="flex items-center gap-1 "
            onClick={() => handleShow(message._id)} // Pass the message ID to handleShow
          >
            <div className="image cursor-pointer pt-1">
              <img src={`${axios.defaults.baseURL + '/uploads/' + message.file}`} alt="" />
            </div>
          </a>
          <Modal
            show={modalVisibility[message._id]} // Use the corresponding modal visibility state
            onHide={() => handleClose(message._id)} // Pass the message ID to handleClose
            className="modal"
          >
            <Modal.Body>
              {/* Display the image inside the modal */}
              <img src={`${axios.defaults.baseURL+ '/uploads/' + message.file}`} alt="" />
            </Modal.Body>
          </Modal>
        </div>
      )}
    </div>
  </div>
))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
            )}
          {!!selectedUserId && selectedUserId === CHATBOT_USER._id && (
            <div className="relative h-full msg">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2  ">
                {messagesWithoutDupes.map(message => (
                  <div key={message._id} className={(message.sender === id ? 'text-right pl-10': 'text-left pr-10 ')}>
                    <div className={"text-left inline-block p-1 my-2 rounded-md text-sm max-w-96  " +(message.sender === id ? 'bg-blue-500 text-white':'bg-white text-gray-500')}>
                      <div className="msg p-1 whitespace-normal break-words ">
                        {message.text}
                      </div>  
                      {message.file && (
                        <div className="">
                          <a target="_blank" className="flex items-center gap-1 "
                            // href={axios.defaults.baseURL + '/uploads/' + message.file}
                            onClick={handleShow}
                          >
                                                <Modal show={show} onHide={handleClose} className="modal">
                     <a  href={axios.defaults.baseURL + '/uploads/' + message.file}></a>
                                     </Modal>
                            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                            </svg>
                            {message.file} */}
                            <div className="image  pt-1">
                              <img src={`${axios.defaults.baseURL + '/uploads/' + message.file}`} alt=""/>
                            </div>      
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}            
          </div>
                    {/* <Modal show={show} onHide={handleClose} className="modal">
                     <a  href={axios.defaults.baseURL + '/uploads/' + message.file}></a>
                                     </Modal>           */}
        {!!selectedUserId && (
          <form className="flex gap-2 " onSubmit={sendMessage}>
            <input type="text"
                   value={newMessageText}
                   onChange={ev => setNewMessageText(ev.target.value)}
                   placeholder="Type your message here"
                   className="bg-white flex-grow border rounded-sm p-2"/>
            <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200">
              <input type="file" className="hidden" onChange={sendFile} />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
              </svg>
            </label>
            <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        )}
      </div>
      </div>
      </div>
  );
}