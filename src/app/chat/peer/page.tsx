"use client";

import React, { Component, useEffect, useRef, useState } from "react";
import type Peer from "peerjs";
import NoSSR from "@/components/NoSSR";
import useLocalStorage from "@/hooks/useLocalStorage";

// 生成uuid
const genUuid = () => {
  let s: any[] = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  // bits 12-15 of the time_hi_and_version field to 0010
  s[14] = "4";
  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  let uuid = s.join("");
  return uuid;
};

function Chat() {
  const [myId, setMyId] = useState("");
  const myIdRef = useRef(myId);
  const [userId, setUserId] = useLocalStorage("userId", genUuid());
  const [userList, setUserList] = useState<string[]>([]);
  const [peer, setPeer] = useState({} as Peer);
  const [mesType, setMesType] = useState(0);
  const [message, setMessage] = useState<string>("");
  const [messageFile, setMessageFile] = useState<File | ArrayBuffer>();
  const [messages, setMessages] = useState<
    {
      sender: string;
      message: {
        type: number;
        content: any;
        // content: string | File | ArrayBuffer;
      };
    }[]
  >([]);

  useEffect(() => {
    setMessageFile(new File([], ""));
  }, []);

  // 检查userId是否可用
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function checkUserIdAvalible() {
    if (userId == undefined || userId == null || userId.length < 5) {
      setUserId(genUuid());
      // 刷新页面
      if (typeof window !== "undefined") {
        window.location.reload();
        return false;
      }
    }
    return true;
  }

  // 检查peer是否连接
  function checkPeer() {
    if (
      peer == undefined ||
      peer == null ||
      myIdRef.current == undefined ||
      myIdRef.current == null ||
      myIdRef.current === ""
    ) {
      init();
      return false;
    }
    return true;
  }

  // 设置定时拉去信息
  useEffect(() => {
    checkPeer();
    checkUserIdAvalible();
    let timer = setInterval(() => {
      console.log(`userId: ${userId}`);
      checkPeer();
      checkUserIdAvalible();

      try {
        fetch("/api/chat/peer", {
          // Post
          method: "post",
          body: myIdRef.current,
        }).then((res) => {
          res.json().then((data) => {
            setUserList(data);
            console.log(data);
          });
        });
      } catch (error) {
        console.log(error);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [checkUserIdAvalible, userId]);

  function init() {
    import("peerjs").then(({ default: Peer }) => {
      const peer = new Peer("");
      peer.on("open", (id) => {
        setMyId(id);
        myIdRef.current = id;
        setPeer(peer);
        console.log("My ID: " + id);
      });
      peer.on("connection", (conn) => {
        conn.on("data", (data: any) => {
          setMessages([...messages, data]);
          // console.log(data);
          // setTestMes([...testMes, data]);
        });
      });
    });
  }
  // init();

  const send = () => {
    function _send(friendId: string) {
      const conn = peer.connect(friendId);

      conn.on("open", () => {
        const msgObj = {
          sender: myId,
          message:
            mesType === 0
              ? {
                  type: 0,
                  content: message,
                }
              : { type: 1, content: messageFile },
        };

        conn.send(msgObj);

        setMessages([...messages, msgObj]);
        setMesType(0);
        setMessage("");
        setMessageFile(new File([], ""));
      });
    }

    userList.forEach((friendId) => {
      _send(friendId);
    });
  };

  // const sendTest = () => {
  //   const conn = peer.connect(friendId);
  //   conn.on("open", () => {
  //     const msgObj = {
  //       sender: myId,
  //       message: testF,
  //     };
  //     conn.send(msgObj);
  //     setTestMes([...testMes, msgObj]);
  //     setTestF(new File([], ""));
  //   });
  // };

  return (
    <>
      <div className="flex flex-col pt-24">
        <h1>My ID: {myId}</h1>

        <label>Friend List:</label>
        <ul className="list">
          {userList.map((user, i) => (
            <li key={i}>{user}</li>
          ))}
        </ul>
        <br />
        <br />

        <label>Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMesType(0);
            setMessage(e.target.value);
          }}
          className="input w-full max-w-xs"
        />
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              const file = e.target.files[0];
              setMesType(1);
              setMessageFile(file);
            }
          }}
          className="file-input file-input-bordered w-full max-w-xs"
        />
        <button className="btn" onClick={send}>
          Send
        </button>

        {/* <button onClick={sendTest}>Send Test</button> */}

        {messages.map((message, i) => {
          let fu;
          if (message.message.type === 1) {
            fu = URL.createObjectURL(
              new Blob([message.message.content as unknown as ArrayBuffer], {
                type: "arraybuffer",
              })
            );
          }
          return (
            <div key={i}>
              <h3>
                {message.sender}:({message.message.type})
              </h3>
              <p>
                {message.message.type === 0 &&
                typeof message.message.content === "string"
                  ? message.message.content
                  : fu}
              </p>
            </div>
          );
        })}
        {/* {testMes.map((message, i) => {
          console.log(message);
          const fu = URL.createObjectURL(
            new Blob([message.message as unknown as ArrayBuffer], {
              type: "arraybuffer",
            })
          );
          return (
            <div key={i}>
              <h3>{message.sender}:</h3>
              <p>
                {message.message.name}:{fu}
              </p>
            </div>
          );
        })} */}
      </div>
    </>
  );
}

export default Chat;
