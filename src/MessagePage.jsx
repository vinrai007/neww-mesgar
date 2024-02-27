import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import { MessagesContext } from './MessageContext';

import { uniqBy } from "lodash";
import Logo from "./Logo";
import Contact from "./Contact";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";


const MessagePage = () => {
  const { setMessages, messages } = useContext(MessagesContext);
  const divUnderMessages = useRef();
  const { selectedUserId } = useParams();

  const [onlinePeople, setOnlinePeople] = useState({});
  const { username, id, setId, setUsername } = useContext(UserContext);
  const [ws, setWs] = useState(null);
  const [offlinePeople, setOfflinePeople] = useState({});
  const [newMessageText, setNewMessageText] = useState('');
  const [show, setShow] = useState(false);
  const [modalVisibility, setModalVisibility] = useState({});

  const handleShow = (messageId) => {
    setModalVisibility(prev => ({ ...prev, [messageId]: true }));
  };

  const handleClose = (messageId) => {
    setModalVisibility(prev => ({ ...prev, [messageId]: false }));
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
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log({ ev, messageData });
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages(prev => ([...prev, { ...messageData }]));
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
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    axios.get('/peoples').then(res => {
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
    if (selectedUserId) {
      axios.get('/messages/' + selectedUserId).then(res => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, '_id');

  return (
    <div className='flex flex-col bg-blue-50'>
      <div className='relative h-screen'>
        <div className="flex-grow">
          <Logo username={username} />
          {/* {Object.keys(onlinePeopleExclOurUser)
            .filter(userId => userId === selectedUserId)
            .map(userId => (
              <Contact
                key={userId}
                id={userId}
                online={true}
                username={onlinePeopleExclOurUser[userId]}
                selected={userId === selectedUserId}
                onClick={() => { setSelectedUserId(userId); console.log({ userId }) }}
              />
            ))} */}
          {Object.keys(offlinePeople)
            .filter(userId => userId === selectedUserId)
            .map(userId => (
              <Contact
                key={userId}
                id={userId}
                online={false}
                username={offlinePeople[userId].username}
                onClick={() => setSelectedUserId(userId)}
                selected={userId === selectedUserId}
              />
            ))}
        </div>
        <div className='z-{-1}'>
          <div className="overflow-y-scroll absolute top-10 left-3 right-0 bottom-14 mt-16">
            {messagesWithoutDupes.map((message, index) => (
              <div key={index} className={message.sender === selectedUserId ? 'text-left pr-10' : 'text-right pl-10 pr-2'}>
                <div className={`text-left inline-block p-1 my-2 rounded-md text-sm max-w-72 ${message.sender === selectedUserId ? 'bg-white text-gray-500' : 'bg-blue-500 text-white'}`}>
                  <div className="msg p-1 whitespace-normal break-words" style={{ maxWidth: '250px', overflowWrap: 'break-word' }}>
                    {message.text}
                          {/* {breakText(message.text)} */}
                  </div>
                  {message.file && (
                    <div className="">
                      <a target="_blank" className="flex items-center gap-1" onClick={() => handleShow(message._id)}>
                        <div className="image cursor-pointer ">
                          <img src={`${axios.defaults.baseURL + '/uploads/' + message.file}`} alt="" />
                        </div>
                      </a>
                      <Modal
                        show={modalVisibility[message._id]}
                        onHide={() => handleClose(message._id)}
                        className="modals "
                      >
                        <Modal.Body>
                          <img src={`${axios.defaults.baseURL + '/uploads/' + message.file}`} alt="" />
                        </Modal.Body>
                      </Modal>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={divUnderMessages}></div>
          </div>
          <div className='absolute bottom-0 pl-3 pr-4 pb-2 pt-1 mt-5 w-full '>
            {!!selectedUserId && (
              <form className="flex gap-2 " onSubmit={sendMessage}>
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(ev) => setNewMessageText(ev.target.value)}
                  placeholder="Type your message here"
                  className="flex-grow border rounded-sm p-2 focus:outline-none focus:ring focus:border-blue-300"
                />
                <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200">
                  <input type="file" className="hidden" onChange={sendFile} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
                <button
                  type="submit"
                  className="bg-blue-500 p-2 text-white rounded-sm hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
