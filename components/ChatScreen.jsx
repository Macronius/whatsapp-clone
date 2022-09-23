//style
import styled from 'styled-components';
//framework routing
import { useRouter } from 'next/router';
//firebase file stuff
import { auth, db } from '../firebase';
//firebase hooks
import { useAuthState } from 'react-firebase-hooks/auth';
//material ui
import { Avatar } from '@material-ui/core';

function ChatScreen({ messages, chat }) {
  //signed-in user
  const [user, loading, error] = useAuthState(auth);
  //next router
  const router = useRouter();
  return (
    <Container>
      <Header>
        <UserAvatar />
        <HeaderInformation>
          <h3>Recipient's Email:</h3>
          <p>Last seen...</p>
        </HeaderInformation>
        <HeaderIcons></HeaderIcons>
      </Header>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
  padding: 0.75rem;
  h1 {
    padding: 1rem;
  }
`;

//STYLED COMPONENTS
const Header = styled.div``;

const UserAvatar = styled(Avatar)``;

const HeaderInformation = styled.div``;

const HeaderIcons = styled.div``;
