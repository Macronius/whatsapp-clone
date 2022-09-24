//react style
import styled from 'styled-components';
//ui framework
import { Avatar, Button, IconButton } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
//email validation
import * as EmailValidator from 'email-validator';
//react firebase hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
//components
import Chat from '../components/Chat';

import { auth, db } from '../firebase';

function Sidebar() {
  //hooks
  const [user] = useAuthState(auth);
  // console.log(user.photoURL);

  //query the database users array for signed-in user's email reference value
  //then, map reference value to a real-time listener
  const userChatRef = db
    .collection('chats')
    .where('users', 'array-contains', user.email);
  const [chatsSnapshot, loading, error] = useCollection(userChatRef); //TODO: look up useCollection(), snapshot, listener
  // console.log('chatsSnapshot: ', chatsSnapshot);

  const createChat = () => {
    const input = prompt(
      'Please enter the email address of the person you wish to chat with'
    );
    if (!input) return null;

    //validate email
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      // We add the chat into the DB 'chats' collection if it doesn't already exist and is valid
      db.collection('chats').add({
        users: [user.email, input],
      });
    }
  };

  //   real-time connection to the chats collection to see if a particular chat already exists
  //   const chatAlreadyExists = (recipientEmail) =>
  //     !!chatsSnapshot?.docs.find((chat) => {
  //       console.log(chat);
  //       chat.data().users.find((user) => user === recipientEmail)?.length > 0;
  //     });
  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <Container>

      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats..." />
      </Search>

      <SidebarButton onClick={createChat}>
        Start a new chat
      </SidebarButton>

      {
        /* list of chats */
        chatsSnapshot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))
      }
    </Container>
  );
}

export default Sidebar;

//===styled components
const Container = styled.div`
  padding: 1.75rem;
  background-color: #fefcf3;

  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  // MS IE and Edge
  scrollbar-width: none;  //Firefox
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1; //should stay on top through overflow

  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 80px;
  padding: 15px;
  /* border-bottom: 1px solid #bb8bb822; */
  border-bottom: 1px solid var(--clr-gray-lt);

  background-color: var(--clr-yellow-mdm);
  /* border-radius: 1rem; */
  border-top-left-radius: 1rem;
`;

const UserAvatar = styled(Avatar)`
  margin: 1rem;
  cursor: pointer;

  :hover {
    opacity: 0.75;
  }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
  font-size: 14px;
`;

const SearchInput = styled.input`
  flex: 1;
  outline-width: 0;
  border: none;
  padding: 4px;
  /* background-color: #bb8bb811; */
`;

const SidebarButton = styled(Button)`
  width: 100%;
  background-color: blue;

  &&& {
    border-top: 0.5px solid #bb8bb833;
    border-bottom: 0.5px solid #bb8bb833;
    padding: 2rem 0;
    /* background-color: #bb8bb811; */
    background-color: #fefcf3;
    box-shadow: 0.5px 0.5px 2px inset #888;
  }
`;

const ChatComponent = styled(Chat)`
  background-color: orange;
`
