
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './videos.module.scss';
import { getPosts } from '../../store/reducers/post.reducer';
import PostComponent from '../../components/PostComponent';

export default function VideoList() {
    const dispatch = useDispatch();
    const posts = useSelector(state => state.postReducer.posts);
    const user = useSelector(state => state.userReducer.user);

    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch]);

    let videoPosts = JSON.parse(JSON.stringify(posts));
    videoPosts = videoPosts.map(post => {
        post.images = [];
        return post;
    })

    return (
        <div className={styles["video-list"]}>
            {
                videoPosts.map(post => {
                    return post.videos.length > 0 && <PostComponent key={post._id} post={post} user={user} />
                })
            }
        </div>
    );
}
