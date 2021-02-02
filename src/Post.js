import React from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'

function Post({ username, caption, imageurl }) {
     const [comments, setComments] = useState([]);
     
    return (
        <div className = 'post'>
            <div className = "post__header">
            <Avatar
                className = "post__avatar"
                alt = {username}
                src = ""
            />
            <h3> {username}</h3>
            </div>
            {/*head -> avatar*/}

            <img className = "post__image" src = {imageurl} alt = "post"/>
            <h4 className = "post__text"><strong> {username} </strong>{caption} </h4>
            {/*username + caption*/}
            
        </div>
    )
}

export default Post
