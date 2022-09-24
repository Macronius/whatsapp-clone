//javascript library
import { useRef, useState } from 'react';
//style
import styled from 'styled-components';
//framework routing
import { useRouter } from 'next/router';
//firebase file stuff
import firebase from 'firebase';
import { auth, db } from '../firebase';
//firebase hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
//material ui
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoodIcon from '@material-ui/icons/Mood';
import MicIcon from '@material-ui/icons/Mic';
//components
import Message from './Message';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';

function ChatScreen({ messages, chat }) {

  //ref
  const endOfMessageRef = useRef(null)

  //signed-in user
  const [user, loading, error] = useAuthState(auth);

  //state
  const [input, setInput] = useState("");

  //next router
  const router = useRouter();

  //messages snapshot
  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id) //go into a specific chat based on the route //NOTE: client -> server?
      .collection('messages')
      .orderBy('timestamp', 'asc')
  );

  //recipientSnapshot
  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  )

  //show messages helper  3:35:00
  //show data that comes through a SSR (chat_initial = true)
  //make a real-time connection of client to firestore for real-time feedback
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
        return JSON.parse(messages).map( message => (
            <Message 
                key={message.id}
                user={message.user}
                message={message}
            />
        ))
    }
  };

  //scroll to bottom function
  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  //submit message handler function
  const sendMessage = e => {
    e.preventDefault();

    //update "last seen..."
    db.collection("users").doc(user.uid).set(
        {
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },
        {merge: true}
    );
    //update the chat in firestore
    db
        .collection('chats').doc(router.query.id)
        .collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        });
    //reset input state
    setInput('');
    scrollToBottom();
  }

  //recipient
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  console.log(recipient);

  //get recipient's email - helper function
  const recipientEmail = getRecipientEmail(chat.users, user)

  return (
    <Container>
      <Header>
        <AvatarContainer>
          {
            recipient ? (
              <Avatar src={recipient?.photoURL} />
            ) : (
              <UserAvatar>{recipientEmail[0]}</UserAvatar>
            )
          }
        </AvatarContainer>

        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {
            recipientSnapshot ? (
              <p>Last active: {' '}
                {
                  recipient?.lastSeen?.toDate() ? (
                    <TimeAgo datetime={recipient.lastSeen.toDate()} />
                  ) : (
                    "unavailable"
                  )
                }
              </p>
            ) : (
              <p>Loading last active...</p>
            )
          }
        </HeaderInformation>

        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer>
        <MoodIcon />
        <Input value={input} onChange={e => setInput(e.target.value)}/>
        <button type="submit" hidden disable={!input} onClick={sendMessage} />
        <MicIcon />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
  padding: 1.75rem;
  background-color: #fefcf3;
  h1 {
    padding: 1rem;
  }
  display: flex;
  flex-direction: column;
`;

//STYLED COMPONENTS
const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
  /* background-color: white; */
  background-color: var(--clr-yellow-mdm);
  display: flex;
  align-items: center;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  border-top-right-radius: 1rem;
`;

const AvatarContainer = styled.div`
  width: 100px;
  display: flex;
  justify-content: center;
  /* background-color: #d5b60a; */
  margin-left: 0.5rem;
  /* border-radius: 50%; */
  /* padding: 2.5px; */
`;

const UserAvatar = styled(Avatar)`
  /* margin: 0 1.5rem; */
  transform: scale(1.5);
  box-shadow: 0 0 0.5px blue;
  cursor: pointer;
`;

const HeaderInformation = styled.div`
  flex: 1;
  margin: 0;
  margin-left: 0.5rem;

  > h3 {
    /* margin-bottom: 3px; */
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div`
  padding-right: 5rem;
  padding-left: 2.5rem;
`;

const MessageContainer = styled.div`
    background-color: var(--clr-yellow-mdmdrk);
    background-color: #FEFCF3;
    flex: 1;
    padding: 30px;
    background-color: #645215;
    min-height: 90vh;
    margin: .5rem 0;
`;

const EndOfMessage = styled.div`
  margin-bottom: 1rem;
`;


const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 1rem;
    position: sticky;
    bottom: 0;
    background-color: #fefcf3;
    /* background-color: var(--clr-yellow-mdm); */
    z-index: 100;
`;


const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 0.5rem;
    background-color: white;
    padding: 2rem;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
`;