import React, { useState, Fragment } from 'react';
import { Button, Input, message } from 'antd';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
import Axios from 'axios';

const { TextArea } = Input;

function Comments(props) {
  const user = useSelector((state) => state.user);
  const [Comment, setComment] = useState('');

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: Comment,
      writer: user.userData._id,
      postId: props.postId,
    };

    Axios.post('/api/comment/saveComment', variables).then((response) => {
      if (response.data.success) {
        message.success('Commented succesfully!');
        setComment('');
        props.refreshFunction(response.data.result);
      } else {
        message.error('Unable to comment!Please try again.');
      }
    });
  };
  return (
    <div>
      <br />
      <p>replies</p>
      <hr />
      {/*  Comment Lists */}
      {/* {console.log(props.CommentLists)} */}

      {props.CommentLists &&
        props.CommentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <Fragment key={index}>
                <SingleComment
                  comment={comment}
                  postId={props.postId}
                  refreshFunction={props.refreshFunction}
                />
                <ReplyComment
                  CommentLists={props.CommentLists}
                  postId={props.postId}
                  parentCommentId={comment._id}
                  refreshFunction={props.refreshFunction}
                />
              </Fragment>
            )
        )}

      {/* Root Comment Form */}
      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <TextArea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleChange}
          value={Comment}
          placeholder='write some comments'
        />
        <br />
        <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
          Comment
        </Button>
      </form>
    </div>
  );
}

export default Comments;
