  import React, { useState, useContext } from 'react';
import { Navbar, Container, Nav, NavDropdown, Offcanvas, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios";
import {UserContext} from "./UserContext.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Logo({username}) {

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [ws, setWs] = useState(null);
    const {id,setId,setUsername} = useContext(UserContext);


  function logout() {
    axios.post('/logout').then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }
  
  return (
    <div className="text-blue-600  font-bold flex gap-2 p-3 mb-0 bg-black">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
      </svg>
      MSGAR
      <>
        
  {[0].map((expand) => (
    <Navbar
      bg="#F05941"
      data-bs-theme="dark"
      key={expand}
      expand={expand}
      className="bg-body-tertiary-dark absolute right-0 top-2 pt-0 mb-5 "
    >
      <Container fluid>
        <Navbar.Toggle
          aria-controls={`offcanvasNavbar-expand-${expand}`}
          className="custom-toggle-icon"
          style={{ border: '2px solid white' }}
        />
        <div className="offcanvas">
          <Navbar.Offcanvas
            className="offcanvass"
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className="offhead">
                MSGAR
              </Offcanvas.Title>
            </Offcanvas.Header>
            {username && (
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <h6 className='font-bold'>Personal</h6>
                <Nav className="user-info">
                    <>
                      <div className="toggleitems pt-2 pb-1 hover:bg-blue-50">
                      <p>
                        <span>
{/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
  <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
</svg> */}
                        </span>

                          &nbsp;Signed in as: 
                          <span className='name'>
                                                      {username}
                        </span>
                          {/* {username} */}
                        </p>
                      </div>
                      <div className="toggleitems pb-2 pt-1 hover:bg-blue-50 cursor-pointer">
                        <a onClick={handleShow} className=''>
                          &nbsp;Sign out
                          {/* ({username}) */}
                        </a>
                      </div>
                    </>
                   {/* )}  */}
                </Nav>
                <Modal show={show} onHide={handleClose} className="modal">
                  <Modal.Header closeButton>
                    <Modal.Title>Hey there,</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Do you want to Sign out?</Modal.Body>
                  <Modal.Footer>
                    <Button onClick={logout} className='bg-black p-0'
                      variant="secondary">
                      <Link to="/">
                        <Button variant="secondary">
                          Yes, I do.
                        </Button>
                      </Link>
                    </Button>
                    <Button className='bg-blue-800'
                      variant="primary" onClick={handleClose}>
                      No, I want to stay.
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Nav>
                  <>
                    <h6 className='font-bold' >MSGAR</h6>
                    <div className="toggleitems p-1 hover:bg-blue-50">
                      <Link to="/" className="dropdown">
                        Home
                      </Link>
                    </div>
                    <div className="toggleitems p-1 hover:bg-blue-50">
                      <Link to="/Groups" className="dropdown">
                        Groups
                      </Link>
                    </div>
                    {/* <div className="toggleitems p-1 hover:bg-blue-50">
                      <Link to="/About" className="dropdown">
                        Community
                      </Link>
                    </div> */}
                  </>
                </Nav>
                <NavDropdown
                  title="Contact Us"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >

                  <NavDropdown.Item href="https://www.linkedin.com/in/vinayak-rai-2416jy/">
                      <div className="toggleitems">
                        {/* <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
  <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
</svg>
                        </span> */}
                        <div>
                                                  &nbsp;Senior Developer

                       </div>
                    </div>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="https://vinayak-rai.onrender.com/">
                    <div className="toggleitems">
                      &nbsp;Senior Developer
                    </div>
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              </Offcanvas.Body>
                                 )} 
            {!username && (
              <p className='p-2 text-center flex items-center justify-center'>
              Please Sign in to use MSGAR
              </p>
            )}
      <div className="footer-block">
        <p className='webar'>Developed by <a href='https://wbar.onrender.com/'  >WEBAR</a></p>
      </div>
          </Navbar.Offcanvas>
        </div>
        
      </Container>
    </Navbar>
  ))}
</>

    </div>
  );
}