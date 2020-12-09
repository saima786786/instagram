import React,{ useState, useEffect} from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from './Firebase';
import firebase from 'firebase';

function Post({postId, user, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        console.log(username)
        let unsubscribe;
   if (postId) {
       unsubscribe = db
         .collection("posts")
         .doc(postId)
         .collection("comments")
         .orderBy('timestamp', 'desc')
         .onSnapshot((snapshot) => {
         setComments(snapshot.docs.map((doc) => doc.data()));
         });
   }
   return () => {
       unsubscribe();
   };
}, [postId]);

   const PostComment = (event) => {
    event.preventDefault();
    console.log(user)
    db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
   }

    return (
        <div className="post">
            <div className="pheader">
            <Avatar
            className="pavatar"
            alt='saima afroz'
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ85To3VVbC6-bM6VUEEhH3na3cN17GIZoHzg&usqp=CAU"
            />
            <h3>{username}</h3>
            {/* avatar -> avatar + username */}
            </div>

            <img className="pimage"
            alt=""
            src={imageUrl}
            />
            {/*image*/}

            <h4 className="ptext">
            <strong>{username}</strong> {caption}
            </h4>
            {/*username + caption */}

            <div className="postcomments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>
            {user && (
             <form className="postcommentbox">
             <input 
             className="postinput"
             type="text"
             placeholder="Add a comment..."
             value={comment}
             onChange={(e) => setComment(e.target.value)}
             />

            <button 
            className="postbutton"
            disabled={!comment}
            type="submit"
            onClick={PostComment}
            >
            <h4>post</h4>
            </button>
            </form>   
    )}           
        </div>
    )
}

      export default Post;

