import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import styled from 'styled-components';
import { auth, db } from '../../firebase';
import getRecipientEmail from '../../utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';

// SERVER-SIDE
export async function getServerSideProps(context) {
  //NOTE: context is server-side for get parameters from the url
  const ref = db.collection('chats').doc(context.query.id);
  //PREP THE MESSAGES ON THE SERVER
  const messagesRes = await ref
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get();
  //PREP THE DATA ON THE SERVER-SIDE
  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));
  //PREP THE CHATS
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  //   console.log(messages, chat);   //troubleshoot: this console.log from server never worked

  //return props from server to client
  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

// CLIENT-SIDE
function Chat({ messages, chat }) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen messages={messages} chat={chat} />
      </ChatContainer>
    </Container>
  );
}

export default Chat;

// STYLED COMPONENTS
const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  height: 100vh;
  overflow: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; //MS IE and MS Edge
  scrollbar-width: none; //firefox
`;