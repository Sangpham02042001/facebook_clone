import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../../store/reducers/post.reducer';
import PostComponent from '../PostComponent';
import Loading from '../Loading';
import styles from './home.module.scss';
import InputForm from '../InputForm';

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.postReducer.posts);
  const user = useSelector(state => state.userReducer.user);
  const loadingPost = useSelector(state => state.postReducer.loadingPost);

    useEffect(() => {

      dispatch(getPosts());

    }, [dispatch]);



  return (
    <div >
      {loadingPost && <Loading />}

      <div className={styles["post-list"]}>
        <InputForm />
        {posts.map(post => {
          return <PostComponent key={post._id} post={post} user={user} />
        })
        }
      </div>
    </div>
  );
}

export default PostList;