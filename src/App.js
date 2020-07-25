import React from "react";
import "./App.css";
import ReactPlayer from "react-player";
import { HashRouter, Link, Switch, Route } from "react-router-dom";
import AuthComponent from "./AuthComponent";
import { Auth, API } from "aws-amplify";
import { createComment as CreateComment } from "./graphql/mutations";
import { listComments as ListComments } from "./graphql/queries";
import {
  onCreateComment as OnCreateComment,
  onCreateComment,
} from "./graphql/subscriptions";

const streamUrl =
  "https://8a2e6418a928.eu-west-1.playback.live-video.net/api/video/v1/eu-west-1.675692464543.channel.1JDFWcjTNrpy.m3u8";

function Router() {
  return (
    <HashRouter>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-around",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <Link
          to='/'
          style={{
            border: "1px solid black",
            textDecoration: "none",
            borderRadius: "8px ",
            padding: "0.5rem",
          }}
        >
          Stream
        </Link>
        <Link
          style={{
            border: "1px solid black",
            textDecoration: "none",
            borderRadius: "8px ",
            padding: "0.5rem",
          }}
          to='/auth'
        >
          Profile
        </Link>
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

const initialState = {
  comments: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_COMMENTS":
      return { ...state, comments: action.comments };

    case "ADD_COMMENT":
      return { ...state, comments: [...state.comments, action.comment] };

    default:
      return state;
  }
}

function App() {
  const [user, setUser] = React.useState(null);
  const [inputValue, setInput] = React.useState("");
  const [state, dispatch] = React.useReducer(reducer, initialState);
  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((currentUser) => setUser(currentUser))
      .catch((err) => console.log({ err }));
    fetchComments();
    subscribe();
  }, []);

  async function subscribe() {
    API.graphql({
      query: onCreateComment,
    }).subscribe({
      next: async (commentData) => {
        console.log(commentData);
        const {
          value: { data },
        } = commentData;
        try {
          const user = await Auth.currentAuthenticatedUser();
          if (user.username === data.onCreateComment.owner) {
            return;
          }
          dispatch({ type: "ADD_COMMENT", comment: data.onCreateComment });
        } catch (err) {
          dispatch({ type: "ADD_COMMENT", comment: data.onCreateComment });
        }
      },
    });
  }
  async function fetchComments() {
    const commentData = await API.graphql({
      query: ListComments,
    });
    dispatch({
      type: "SET_COMMENTS",
      comments: commentData.data.listComments.items,
    });
  }

  async function createComment() {
    if (!inputValue) return;
    const message = inputValue;
    setInput("");
    dispatch({
      type: "ADD_COMMENT",
      comment: { message, owner: user.username },
    });
    await API.graphql({
      query: CreateComment,
      variables: {
        input: { message },
      },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
  }
  function onChange(e) {
    e.persist();
    setInput(e.target.value);
  }
  return (
    <div className='App'>
      <div style={{ display: "flex" }}>
        <div style={{ width: 900, border: "1px solid grey" }}>
          <ReactPlayer url={streamUrl} width='100%' height='100%' playing />
        </div>
        <div style={{ width: 300, border: "1px solid grey" }}>
          {user && (
            <div>
              <input
                value={inputValue}
                onChange={onChange}
                placeholder='comment'
              />
              <button onClick={createComment}>Create a comment</button>
            </div>
          )}
          {state.comments.map((comment, index) => (
            <div key={index}>
              <p>{comment.message}</p>
              <span>From: {comment.owner}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Router;
