import { Button } from '@material-ui/core';
import React, {useState} from 'react';
import firebase from "firebase";
import { storage, db} from './Firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
console.log(username)
const [image, setImage] = useState(null);
const [progress, setProgress] = useState(0);
const [caption, setCaption] = useState('');

const handleChange = (e) => {
    if(e.target.files[0]) {
        setImage(e.target.files[0]);
    }
};

const handleUpload = () => {
    console.log(image)
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
           //progress function...
           const progress =Math.round(
             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
           );
           setProgress(progress);
        },
        (error) => {
            // error function...
            console.log(error);
            alert(error.message);
        },
        () => {
            //complete function...
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
                console.log(url)
                //post img inside db
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: url,
                    username: username || 'Admin'

                });
                setProgress(0);
                setCaption("");
                setImage(null);
            });
        }
    )
};
    return (
        <div className="imageupload">
            {/*i want to have */}
            {/* caption input */}
            {/* file picker*/}
            {/* post button */}

            <progress className="imageuploadprogress" value={progress} max= "100" />
            <input type="text" placeholder='Enter a caption' onChange={event => setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick= {handleUpload}>
               <strong>UPLOAD</strong> 
            </Button>
        </div>
    )
}

export default ImageUpload;
