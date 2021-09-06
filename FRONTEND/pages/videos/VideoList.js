
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

    const videoPosts = posts.map(post => {
        let video = {
            _id: post._id,
            article: post.article,
            videoId: post.videoId,
            user: post.user,
            reactList: post.reactList,
            comments: post.comments,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }

        return !post.videoId ? null : video
    })
    console.log(videoPosts);
    return (
        <div className={styles["video-list"]}>
            {videoPosts.map(video => {
                return video && <PostComponent key={video._id} post={video} user={user} />
            })
            }
        </div>
    );
}
