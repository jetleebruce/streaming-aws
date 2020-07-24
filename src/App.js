import React from "react";
import "./App.css";
import ReactPlayer from "react-player";
import { HashRouter, Link, Switch, Route } from "react-router-dom";
import AuthComponent from "./AuthComponent";
import { Auth } from "aws-amplify";

const streamUrl =
  "https://8a2e6418a928.eu-west-1.playback.live-video.net/api/video/v1/eu-west-1.675692464543.channel.1JDFWcjTNrpy.m3u8";

function Router() {
  return (
    <HashRouter>
      <nav>
        <Link to='/'>Stream</Link>
        <Link to='/auth'>Profile</Link>
      </nav>
      <Switch>
        <Route exact path='/'>
          <App />
        </Route>
        <Route exact path='/auth'>
          <AuthComponent />
        </Route>
      </Switch>
    </HashRouter>
  );
}

function App() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((currentUser) => setUser(currentUser))
      .catch((err) => console.log({ err }));
  }, []);

  return (
    <div className='App'>
      <div style={{ display: "flex" }}>
        <div style={{ width: 900, border: "1px solid grey" }}>
          <ReactPlayer url={streamUrl} width='100%' height='100%' playing />
        </div>
        <div style={{ width: 300, border: "1px solid grey" }}>
          {
            user && (
              <div>
                <input placeholder="comment"/>
                <button>Create a comment</button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Router;
