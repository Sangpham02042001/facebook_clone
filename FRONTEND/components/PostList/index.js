import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../../store/reducers/post.reducer';
import PostComponent from '../PostComponent/index';
import Loading from '../Loading';
import styles from './postList.module.scss';

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.postReducer.posts);
  const user = useSelector(state => state.userReducer.user);
  const loadingPost = useSelector(state => state.postReducer.loadingPost);
  const postList = posts.map(post => {
    return <PostComponent key={post._id} post={post} user={user} />
  })
 

  useEffect(() => {
    
    dispatch(getPosts());

  }, [dispatch]);

  

  return (
    <div >
      {loadingPost && <Loading />}
      <div className={styles["post-list"]}>{postList}</div>
    </div>
  );
}

export default PostList;