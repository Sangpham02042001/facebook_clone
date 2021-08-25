import React, { useState } from 'react';
import PostList from './PostList';
import FriendStatusList from './FriendStatusList';
import MessageBoxs from '../MessageBoxs';
import styles from './home.module.scss';
const HomeComponent = () => {
    return (
        <div className={styles["home-component"]}>
            <div className={styles["home-middle"]}>
                <MessageBoxs />
                <FriendStatusList />
                {/* <div className="post-form">
                    <InputForm />
                </div> */}

                <div className="post-article">
                    <PostList />
                </div>
            </div>

        </div>
    );

}

export default HomeComponent;