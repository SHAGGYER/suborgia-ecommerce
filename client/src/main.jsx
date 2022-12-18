import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import "./index.css";
import App from "./App";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axios from "axios";

window.Pusher = Pusher;

/* window.Echo = new Echo({
  broadcaster: "pusher",
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  encrypted: true,
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  auth: {
    withCredentials: true,
  },
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        axios
          .post(
            "/api/broadcasting/auth",
            {
              socket_id: socketId,
              channel_name: channel.name,
            },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            callback(false, response.data);
          })
          .catch((error) => {
            callback(true, error);
          });
      },
    };
  },
});

window.Echo.private(`message`).listen("Message", (e) => {
  console.log(e);
}); */

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
