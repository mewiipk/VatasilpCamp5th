import React, { useState, useEffect } from 'react';
import './styles/index.scss';
import { Switch, Route } from 'react-router-dom';

import firebase, { db } from './Firebase';
import MainMinority from './pages/minority/Main';
import AdminMinority from './pages/minority/Admin';
import WhoIsMafia from './pages/mafia/Main';
import AdminMafia from './pages/mafia/Admin';
import DisplayMafia from './pages/mafia/Display';
import FourElements from './pages/fourelements/Main';
import AdminElements from './pages/fourelements/Admin';
import FourElementsDisplay from './pages/fourelements/Display';

function App() {
  const [user, setUser] = useState();
  const [name, setName] = useState('');

  console.log(user);
  console.log(user && user.name && user.name === true);

  const getUser = uid => {
    const userRef = db.collection('user').doc(uid);
    userRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const data = doc.data();
          console.log('Document data:', data);
          setUser(data);
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
          setUser({ uid });
        }
      })
      .catch(function(error) {
        console.log('Error getting document:', error);
      });
  };

  const updateName = () => {
    const userRef = db.collection('user').doc(user.uid);
    userRef.set({ uid: user.uid, name });
    setUser({ ...user, name });
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        const uid = user.providerData[0].uid;
        getUser(uid);
        // User is signed in.
      } else {
        // User is signed out.
        // ...
        setUser(null);
      }
    });
  }, []);

  const loginFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  };

  return (
    <div className="App">
      {(() => {
        switch (user) {
          case undefined:
            return <p>กำลังประมวลผล</p>;
          case null:
            return (
              <button onClick={() => loginFacebook()} className="login-btn">
                ล็อกอิน facebook ก่อนนะจ๊ะ
              </button>
            );
          default:
            if (user.name) {
              return (
                <Switch>
                  <Route exact path="/minority">
                    <MainMinority />
                  </Route>
                  <Route path="/minority/admin">
                    <AdminMinority />
                  </Route>

                  <Route exact path="/whoismafia">
                    <WhoIsMafia uid={user.uid} />
                  </Route>
                  <Route path="/whoismafia/admin">
                    <AdminMafia />
                  </Route>
                  <Route path="/whoismafia/display">
                    <DisplayMafia />
                  </Route>

                  <Route exact path="/fourelements">
                    <FourElements uid={user.uid} />
                  </Route>
                  <Route path="/fourelements/admin">
                    <AdminElements />
                  </Route>
                  <Route path="/fourelements/display">
                    <FourElementsDisplay />
                  </Route>

                  <Route path="/">
                    <div>ยินดีต้อนรับนะคะ คุณ {user.name}</div>
                  </Route>
                </Switch>
              );
            }
            return (
              <div>
                <p>ใส่ชื่อก่อนนะ</p>
                <input value={name} onChange={e => setName(e.target.value)} />
                <button onClick={() => updateName()}>Submit</button>
              </div>
            );
        }
      })()}
    </div>
  );
}

export default App;
