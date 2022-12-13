import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { animateScroll } from "react-scroll";
import { v4 } from "uuid";
import styled from "styled-components";
import cogoToast from "cogo-toast";
import AppContext from "../AppContext";
import HttpClient from "../services/HttpClient";
import PrimaryButton from "../components/UI/PrimaryButton";

const Wrapper = styled.section`
  position: fixed;
  right: 50px;
  bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
  z-index: 99;

  > button {
    height: 60px;
    width: 60px;
    cursor: pointer;
    font-size: 25px;
  }
`;

const RightFrame = styled.article`
  display: flex;
  flex-direction: column;
  background-color: white;

  height: 400px;
  width: 300px;
  border: 1px solid black;

  @media screen and (max-width: 640px) {
    margin-left: 0;
  }
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const HelpDesk = () => {
  const { socket, user } = useContext(AppContext);
  const [newMessage, setNewMessage] = useState("");
  const [newMessageReady, setNewMessageReady] = useState("");
  const [messages, setMessages] = useState([]);
  const [numberInQueue, setNumberInQueue] = useState(null);
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    socket.on("connection-successful", () => {
      socket.emit("join-user", { userId: user._id });
    });

    socket.on("help-queue-joined", (numberInQueue) => {
      setNumberInQueue(numberInQueue);
    });

    socket.on("start-new-help-desk-conversation", ({ admin }) => {
      setNumberInQueue(0);
      setAdmin(admin);
      setMessages([]);
      socket.emit("join-help-desk-messages", {
        userId: user._id,
        userName: user.name,
      });
    });

    socket.on("end-help-desk-conversation", () => {
      setAdmin(null);
      setNumberInQueue(null);
      socket.emit("leave-help-desk-messages");
    });

    socket.on("number-in-queue", (numberInQueue) => {
      setNumberInQueue(numberInQueue);
    });

    socket.on("help-desk-messages", (messages) => {
      setMessages(messages);
    });
  }, []);

  useEffect(() => {
    const handler = (message) => {
      setMessages([...messages, { ...message }]);
      scrollToBottom();
    };
    socket.on("message", handler);

    return () => {
      socket.off("message", handler);
    };
  }, [messages]);

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "messages-container",
      duration: 200,
    });
  };

  const scrollToBottomDelayed = () => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const prepareMessage = async ({ currentUser, text }) => {
    const message = {
      text,
      uuid: v4(),
    };

    socket.emit("message", {
      message: {
        ...message,
        userId: user._id,
        userName: user.name,
      },
    });
  };

  const sendMessage = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (numberInQueue > 0) {
      cogoToast.error("Det er ikke din tur endnu");
      return;
    }

    if (user) {
      await prepareMessage({
        currentUser: user,
        text: newMessage,
      });

      setNewMessage("");
    }
  };

  const isOwnMessage = (message) => {
    return message.userId === user?._id;
  };

  const joinHelpDeskQueue = () => {
    socket.emit("join-help-queue", { userId: user._id, userName: user.name });
  };

  return (
    <Wrapper>
      {/*<PrimaryButton onClick={joinHelpDeskQueue}>Snak med en medarbejder</PrimaryButton>*/}

      {open && (
        <RightFrame>
          {numberInQueue > 0 && <p>Nummer i køen: {numberInQueue}</p>}
          {numberInQueue === null && (
            <PrimaryButton onClick={joinHelpDeskQueue}>
              Snak med en medarbejder
            </PrimaryButton>
          )}
          {admin && <p>Nu taler du med {admin.adminName}</p>}
          <MessagesContainer id="messages-container">
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  id={message.uuid}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem",
                    justifyContent: isOwnMessage(message)
                      ? "flex-end"
                      : "flex-start",
                  }}
                >
                  <div
                    style={{
                      minWidth: 150,
                      maxWidth: "50%",
                      wordBreak: "break-word",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      background: "var(--primary)",
                    }}
                  >
                    <p style={{ marginBottom: "0.25rem", fontWeight: "bold" }}>
                      {message.userName}
                    </p>
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            </>
          </MessagesContainer>

          <form
            style={{
              height: "3rem",
              display: "flex",
              borderTop: "1px solid black",
            }}
            onSubmit={sendMessage}
          >
            <input
              style={{
                flexGrow: 1,
                padding: "0.5rem",
                border: "none",
                outline: "none",
              }}
              value={newMessage}
              onClick={scrollToBottomDelayed}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              style={{
                border: "none",
                borderLeft: "1px solid black",
                padding: "0.25rem",
              }}
            >
              Send
            </button>
          </form>
        </RightFrame>
      )}
      <button
        onClick={() => setOpen(!open)}
        style={{
          border: "none",
          background: "var(--primary)",
          padding: "1rem 1.5rem",
          borderRadius: "50%",
        }}
      >
        ?
      </button>
    </Wrapper>
  );
};

export default HelpDesk;
