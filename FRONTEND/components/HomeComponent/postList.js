import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../../store/reducers/post.reducer';
import PostComponent from '../PostComponent';
import styles from './home.module.scss';


const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.postReducer.posts);
  const user = useSelector(state => state.userReducer.user);


  useEffect(() => {

    dispatch(getPosts());

  }, [dispatch]);



  return (

    <div className={styles["post-list"]}>
      {posts.map(post => {
        return <PostComponent key={post._id} post={post} user={user} />
      })
      }
    </div>

  );
}

export default PostList;