import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../../store/reducers/posts.reducer';



const PostChild = (params) => {

    const postStyle = {
        color: "black",
        backgroundColor: "#fff6ff",
        display: "center",
        width: "60%",
        margin: "20px auto",
        padding: "10px",
        fontFamily: "Arial"
      };
    return (
        <div className="child-post" style={postStyle}>
            <h1>{params.post.status}</h1>
        </div>
    );
}

const PostComponent = () => {
    const dispatch = useDispatch();

    const posts = useSelector(state => state.postsReducer.posts);


    const allPosts = posts.map(post => {
        if (post._id) return <PostChild key={post._id} post={post} />

        return null;
    })

    useEffect(() => {
        dispatch(getPosts());

    }, [dispatch]);

    return (
        <div className="post-component">
            <div>{allPosts}</div>
        </div>
    );
}

export default PostComponent;
