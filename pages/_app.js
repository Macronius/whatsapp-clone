import { useEffect } from 'react';
import '../styles/globals.css';
import firebase from 'firebase';
import {auth, db} from '../firebase';
//firebase hooks 3rd-party
import { useAuthState } from 'react-firebase-hooks/auth';
//pages
import Login from './login';
//components
import Loading from '../components/Loading'

function MyApp({ Component, pageProps }) {

  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoUrl: user.photoURL,
        },
        {merge: true}
      );
    }
  }, [user]);
  

  if (loading) return <Loading />
  if (!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
