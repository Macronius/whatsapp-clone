//reactjs framework
import { useRouter } from 'next/router';
//firebase stuff
import { auth } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
//ui/ux
import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
//utility functions
import getRecipientEmail from '../utils/getRecipientEmail';
import { db } from '../firebase';

//
// STYLED COMPONENTS
const Container = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 1.25rem;
  word-break: break-word;
  margin: 0.5rem 0;
  /* color: black; */

  /* border-radius: 0.5rem; */
  border-top-right-radius: 1rem;
  border-bottom-right-radius:1rem;
  background-color: white;
  outline: .5px solid var(--clr-gray-lt);

  :hover {
    background-color: var(--clr-yellow-mdm);
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 0.5rem;
  margin-right: 1.5rem;
`;

//
function Chat({ id, users }) {
  //next routing
  const router = useRouter();
  //signed-in user auth data
  const [user] = useAuthState(auth);

  // use react firebase hook to filter
  const [recipientSnapshot] = useCollection(
    db.collection('users').where('email', '==', getRecipientEmail(users, user))
  );

  //unwrap the first element to get all the data from it
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const recipientEmail = getRecipientEmail(users, user);

  //enter one-on-one chat
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
}
export default Chat;
