import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PostList from './PostList';
import InputForm from '../InputForm';
import FriendStatusList from './FriendStatusList';
import MessageBoxs from '../MessageBoxs';
import styles from './home.module.scss';
import Loading from '../Loading';
import LeftSide from './LeftSide';
import { Row, Col } from 'antd';

const HomeComponent = () => {
    const loadingPost = useSelector(state => state.postReducer.loadingPost);
    return (
        <Row className={styles["home-component"]}>
            <MessageBoxs />
            <Col span={6} >
                <LeftSide />
            </Col>
            <Col offset={1} span={10}>
                {loadingPost && <Loading />}
                <InputForm />
                <PostList />
            </Col>
            <Col offset={1} span={6}>
                <FriendStatusList />
            </Col>
        </Row>
    );

}

export default HomeComponent;