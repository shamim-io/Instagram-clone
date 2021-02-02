import './App.css';
import Post from './Post'
import React, { useState, useEffect } from 'react'
import { db, auth } from  './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from "react-instagram-embed";
import FlipMove from "react-flip-move";

// copied from material ui
function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

// copied from material ui
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  
  //copied from material ui
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  // any time any changes happens with the user. this useeffect changes
  useEffect(() => {
    const unsubscribe  = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //user has logged in...
        console.log(authUser)
        setUser(authUser)
          if(authUser.displayName) {
            // dont update username
          }
          else {
            return authUser.updateProfile ({
              displayName: username
            })
          }
      }
      else {
        //user has logged out...
        setUser(null)
      }
    })

    // this snippet means whenever the user changes return the previous listener before firing the new useEffect listener.
    return () => {
      unsubscribe()
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, 
        post:doc.data()
      }) ));
    })
  }, [])

  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error) => alert(error.message))
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }

  return (
    <div className="App">

    <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style = {modalStyle} className = {classes.paper}>
        <form Name = '' className = "app__signup">
          <center>
            <img
              className = 'app__headerImage'
              src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt = "" 
            />

            <Input 
              placeholder = "username"
              type = "text"
              value = {username}
              onChange = {(e) => setUsername(e.target.value)}/>


            <Input 
              placeholder = "email"
              type = "text"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}/>

            <Input 
              placeholder = "password"
              type = "password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)} />
            <Button type = "submit" onClick = {signUp}> Signup </Button>
          </center>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
      <div style = {modalStyle} className = {classes.paper}>
        <form className = "form__signup">
          <center>
            <img
              className = 'app__headerImage'
              src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt = "" 
            />
            <Input 
              placeholder = "email"
              type = "text"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}/>

            <Input 
              placeholder = "password"
              type = "password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)} />
            <Button type = "submit" onClick = {signIn}> SignIn </Button>
          </center>
          </form>
        </div>
      </Modal>

      <div className = "app__header">
          <img src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt = "" 
            className = 'app__headerImage'/> 

        {user ? (
          <Button onClick = {() => auth.signOut()}>Logout</Button>
        ) : (

          <div className = "app__loginContainer">
            <Button onClick = {() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick = {() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
        </div>

        <div className="app__posts">
        <div className="app__postsLeft">
          <FlipMove>
            {posts.map(({ id, post }) => (
              <Post
                user={user}
                key={id}
                postId={id}
                username={post.username}
                caption={post.caption}
                imageurl={post.imageurl}
              />
            ))}
          </FlipMove>
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/B2G3iwRDc1c/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
        
          {user?.displayName ? (
            <ImageUpload username = {user.displayName}/>
              ) : (
          <h3>Login to upload</h3>
       )}
        </div>
  );
}

export default App;
