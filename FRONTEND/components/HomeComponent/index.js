import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PostList from './PostList';
import InputForm from '../InputForm';
import FriendStatusList from './FriendStatusList';
import MessageBoxs from '../MessageBoxs';
import styles from './home.module.scss';
import Loading from '../Loading';
const HomeComponent = () => {
    const loadingPost = useSelector(state => state.postReducer.loadingPost);
    return (
        <div className={styles["home-component"]}>
            <div className="home-message">
                <MessageBoxs />
                <FriendStatusList />
            </div>
            <div className={styles["home-middle"]}>
                {loadingPost && <Loading />}
                <div className={styles["post-article"]}>
                    <InputForm />
                    <PostList />
                </div>
            </div>

        </div>
    );

}

export default HomeComponent;