import React, { useState, useEffect } from 'react';
import './styles/index.scss';
import { Switch, Route } from 'react-router-dom';

import firebase, { db } from './Firebase';
import MainMinority from './pages/minority/Main';
import DisplayMinority from './pages/minority/Display';
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
            return <div className = "loading"><p>กำลังประมวลผล... </p></div>;
          case null:
            return (
              <div className="connect-to-facebook">
                <h1>ล็อกอิน facebook ก่อนนะจ๊ะ</h1>
                <button onClick={() => loginFacebook()} className="login-btn">
                <p className="font-montserrat">Continue with Facebook</p>
                </button>
              </div>
            );
          default:
            if (user.name) {
              return (
                <Switch>
                  <Route exact path="/minority">
                    <MainMinority uid={user.uid} />
                  </Route>
                  <Route path="/minority/admin">
                    <AdminMinority />
                  </Route>
                  <Route path="/minority/display">
                    <DisplayMinority />
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
                  <Route path="/terms">
                    <p>Terms</p>
                  </Route>
                  <Route path="/policy">
                    <p>Policy</p>
                  </Route>
                  <Route path="/">
                    <div className = "welcome"><p>ยินดีต้อนรับ <span>{user.name}</span> เข้าสู่ค่ายวาทศิลป์ครั้งที่ 5 ติดตามรอกิจกรรมในค่ายได้ในอีกไม่กี่ชั่วโมงข้างหน้าน้า</p></div>
                  </Route>
                </Switch>
              );
            }
            return (
              <div className = "enter-name">
                <p className = "label-name">ใส่ชื่อก่อนนะ</p>
                <input className = "input" value={name} onChange={e => setName(e.target.value)} />
                <button className = "submit-button" onClick={() => updateName()}>Submit</button>
              </div>
            );
        }
      })()}
    </div>
  );
}

export default App;
