import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import moment from 'moment'

function Message({user, message}) {

  //signed-in user
  const [userLoggedIn] = useAuthState(auth);

  //type of message
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;

  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>{message.timestamp ? moment(message.timestamp).format("LT") : "..."}</Timestamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;

const Container = styled.div`
  color: black;
`;


const MessageElement = styled.p`
  width: fit-content;
  padding: 1.5rem;
  border-radius: .5rem;
  margin: 1rem;
  min-width: 6rem;
  padding-bottom: 2rem;
  position: relative;
  text-align: right;
`

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #DCF8C6;
  background-color: #E8E0B4;
  background-color: #D4AF37;
  /* border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem; */
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
`

const Receiver = styled(MessageElement)`
  background-color: #FCFAF4;
  background-color: whitesmoke;
  text-align: left;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
`

const Timestamp = styled.span`
  color: #515151;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
`