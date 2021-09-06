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
            <Col span={6} >
                <LeftSide />
            </Col>
            {loadingPost && <Loading />}
            <Col offset={2} span={8}>
                <InputForm />
                <PostList />
            </Col>
            <Col offset={3} span={5}>
                <FriendStatusList />
            </Col>
            <MessageBoxs />
        </Row>
    );

}

export default HomeComponent;