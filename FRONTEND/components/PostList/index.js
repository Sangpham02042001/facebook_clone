import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../../store/reducers/post.reducer';
import PostComponent from '../PostComponent/index';



const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.postReducer.posts);

  const postList = posts.map(post => {
    if (post._id) return <PostComponent key={post._id} post={post} />

    return null;
  })

  useEffect(() => {
    dispatch(getPosts());

  }, [dispatch]);

  return (
    <div className="post-list">
      <div>{postList}</div>
    </div>
  );
}

export default PostList;