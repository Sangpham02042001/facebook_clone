import React, { useState } from 'react';
import PostList from './PostList';
import InputForm from '../InputForm';
import FriendStatusList from './FriendStatusList';
import MessageBoxs from '../MessageBoxs';
import styles from './home.module.scss';
const HomeComponent = () => {
    return (
        <div className={styles["home-component"]}>
            <div className="home-message">
                <MessageBoxs />
                <FriendStatusList />
            </div>
            <div className={styles["home-middle"]}>

                <div className={styles["post-article"]}>
                    <InputForm />
                    <PostList />
                </div>
            </div>

        </div>
    );

}

export default HomeComponent;