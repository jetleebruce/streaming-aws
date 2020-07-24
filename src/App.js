import React from "react";
import "./App.css";
import ReactPlayer from "react-player";
import { HashRouter, Link, Switch, Route } from "react-router-dom";
import AuthComponent from "./AuthComponent";

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
  return (
    <div className='App'>
      <header className='App-header'>
        <div style={{ width: 900 }}>
          <ReactPlayer url={streamUrl} width='100%' height='100%' playing />
        </div>
      </header>
    </div>
  );
}

export default Router;
