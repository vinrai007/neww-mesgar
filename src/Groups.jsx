// JoinAsWriterPage.js
import React from 'react';
import {useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Logo from './Logo';
import { UserContext } from './UserContext';
import { Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

const JoinAsWriterPage = () => {
  const { username, id, setId, setUsername } = useContext(UserContext);


  return (
      <div className='Group-page'>
                    <Logo username={username} />
      {/* <div className="join-as-writer">
      <h1>Join Matters That Matter as a Writer</h1>
      <p className='para-head'>
        Are you passionate about making a difference? Do you believe in the power of words to inspire change?
        If so, we invite you to join "Matters That Matter," a dynamic newsletter dedicated to exploring
        and shedding light on issues that truly make a difference in our world.
      </p>
      <p>
        <strong>Why Write for Matters That Matter?</strong>
      </p>
      <ul>
        <li>
          <strong>Passion for Impact:</strong> We are on the lookout for writers who are deeply passionate
          about issues that truly matter – be it social justice, environmental sustainability, mental health,
          or any topic that has the potential to spark positive change.
        </li>
        <li>
          <strong>Diverse Perspectives:</strong> Our world is rich with diverse experiences and perspectives.
          We welcome writers from all walks of life to share their unique insights and contribute to a more
          inclusive and empathetic discourse.
        </li>
        <li>
          <strong>Engaging Storytelling:</strong> The ability to tell a captivating story is at the heart of our mission.
          We seek writers who can weave narratives that captivate, inform, and inspire our readers to take action.
        </li>
        <li>
          <strong>Research and Insight:</strong> Writers at Matters That Matter are dedicated to presenting well-researched,
          fact-based articles. We value insightful analysis and a commitment to accuracy in our pursuit of informing and
          educating our audience.
        </li>
      </ul>
      <p>
        <strong>Benefits of Joining Matters That Matter:</strong>
      </p>
      <ul>
        <li>
          <strong>Amplify Your Voice:</strong> Your words have the power to reach a global audience. Joining Matters That Matter
          gives you a platform to share your ideas and contribute to meaningful conversations.
        </li>
        <li>
          <strong>Community and Collaboration:</strong> Writing for Matters That Matter means becoming part of a supportive community
          of like-minded individuals. Collaborate with fellow writers, share ideas, and learn from diverse perspectives.
        </li>
        <li>
          <strong>Professional Development:</strong> Whether you are a seasoned writer or just starting, our platform offers
          opportunities for growth and development. Receive constructive feedback, refine your skills, and enhance your portfolio.
        </li>
        <li>
          <strong>Positive Impact:</strong> Every article published in Matters That Matter contributes to a collective effort
          to raise awareness and drive positive change. Be a part of something bigger than yourself.
        </li>
      </ul>
      <p>
        <strong>How to Join:</strong>
      </p>
      <p>
        Ready to be a part of Matters That Matter? Simply Click the button below to join!. We are excited to welcome passionate writers who are ready to make a difference through the
        power of their words.
      </p>
      <p>
        Don't just write; write for a purpose. Join Matters That Matter today and let your voice be the catalyst for change!
      </p>
    </div> */}
      {/* <p>Are you interested in becoming a writer? Click the button below to join!</p> */}
          <div>
              <h1 >
                  "Groups" is GOING THROUGH APLPHA TESTING AS OF NOW,
                  STAY TUNED TO KNOW MORE !!
              </h1>
                                  <Button className='bg-blue-800'
                      variant="primary" >
                      <Link to="/" className="dropdown">
                        Home
                      </Link>                    </Button>
    </div>
    </div>
  );
};

export default JoinAsWriterPage;
