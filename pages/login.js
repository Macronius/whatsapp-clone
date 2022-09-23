import Head from 'next/head'
import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { auth, provider } from '../firebase'

function Login() {

  const signinHelper = () => {
    auth
      .signInWithPopup(provider)
      .catch(alert)
  }
  return (
    <Container>
        <Head>
            <title>login-page</title>
        </Head>
        
        <LoginContainer>
          <Logo src="https://filescnc.net/wp-content/uploads/2021/01/WhatsApp-Logo-Free-Vector-480x485.png" />
          <Button 
            variant="outlined"
            onClick={signinHelper}
          >
            Sign in with Google
          </Button>
        </LoginContainer>
    </Container>
  )
}
export default Login


const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke
`

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  background-color: white;
  border-radius: 7px;
  box-shadow: 0 0 16px -5px gray;
`

const Logo = styled.img`
  width: 170px;
  height: 170px;
  margin-bottom: 64px;
  border-radius: 50%;
`