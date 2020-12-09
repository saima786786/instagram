import React,{useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import{ Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setopenSignIn] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  
    //runs a piece of code based on aspecific condn = useEffect
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
         if (authUser) {
             //has user logged in
             setUser(authUser);

             if (authUser.displayName){
                // dont update user name
             }else{
                //if we just created someone
                return authUser.updateProfile({
                  displayName: username
                })
             }
         }
         else{
            //has user logged out
            setUser(null);
         }
       })
    }, [username]);

    useEffect(() => {
     // here code run

     db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
       //here evry tym new post added

       setPosts(snapshot.docs.map(doc => ({
         id: doc.id,
         post: doc.data()
        })));
     })
    }, []);

    const signUp = (event) => {
       event.preventDefault();

       auth
       .createUserWithEmailAndPassword(email, password)
       .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
       })
       .catch((error) => alert(error.message));
       setOpen(false);
    }
      
       const signIn =  (event) => {
       event.preventDefault();

       auth
       .signInWithEmailAndPassword(email, password)
       .catch((error) => alert(error.message))

       setopenSignIn(false);
    }
    console.log(posts)
    return (
    <div className="App">

    <Modal
        open={open}
        onClose={() => setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="appsignup">
         <center>
           <img className="appheaderimage"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTYVsBMwE45E6rXsJHWO5p-C95h6sH4FRk7IA&usqp=CAU"
        alt=""
           />
          </center>
      
           <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
           <Button type="submit" onClick={signUp}> Sign Up</Button>
            
         
         </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setopenSignIn(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="appsignup">
         <center>
           <img className="appheaderimage"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTYVsBMwE45E6rXsJHWO5p-C95h6sH4FRk7IA&usqp=CAU"
        alt=""
           />
          </center>
          
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
           <Button type="submit" onClick={signIn}> Sign In</Button>
            
         
         </form>
        </div>
      </Modal>
         
         <div className="appheader">
        <img className="appheaderimage"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTYVsBMwE45E6rXsJHWO5p-C95h6sH4FRk7IA&usqp=CAU"
        alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}><b>LOGOUT</b></Button>
          ): (
            <div className="applogincontainer">
          <Button onClick={() => setopenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
          )}
        </div>
        
        <div className="appposts">
          <div className="apppostleft">
           { 
        posts.map(({id, post}) => (
          <Post key ={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
        </div>
        <div className="apppostright">
        <InstagramEmbed
        url='https://www.instagr.com/p/B_uf9dmAGPw/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
       />
       </div>
        </div>

        {user?.email ? (
          <ImageUpload username={user.displayName} />
           ): (
           <h3>sry u need 2 login upload...</h3>
           )}

    </div>
  );
}

export default App;
