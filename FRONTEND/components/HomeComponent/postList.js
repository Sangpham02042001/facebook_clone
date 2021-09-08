import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PostComponent from '../PostComponent';
import styles from './home.module.scss';


export default function PostList() {
  const posts = useSelector(state => state.postReducer.posts);
  const user = useSelector(state => state.userReducer.user);

  

  return (

    <div className={styles["post-list"]}>
      {
        posts.map(post => (
            <PostComponent key={post._id} post={post} user={user} />
        ))
      }
    </div>

  );
}