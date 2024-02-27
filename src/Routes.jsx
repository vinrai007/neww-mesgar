// import RegisterAndLoginForm from "./RegisterAndLoginForm.jsx";
// import {useContext} from "react";
// import {UserContext} from "./UserContext.jsx";
// import Chat from "./Chat1.jsx";

// export default function Routes() {
//   const {username, id} = useContext(UserContext);

//   if (username) {
//     return <Chat />;
//   }

//   return (
//     <RegisterAndLoginForm />
//   );
// }



import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext.jsx";
import RegisterAndLoginForm from "./RegisterAndLoginForm.jsx";
import Chat from "./Chat";
import Chat1 from "./ContactPage.jsx";

export default function Routes() {
  const { username, id } = useContext(UserContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (username) {
    return windowWidth < 600 ? <Chat1 /> : <Chat />;
  }

  return <RegisterAndLoginForm />;
}
