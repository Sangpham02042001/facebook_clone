import React, { useState } from 'react';
import PostList from '../PostList';
import InputForm from '../InputForm';

const HomeComponent = () => {

    return (
        <div className="home-component">
            <div className="post-form">
                <InputForm />
            </div>
            <div className="post-article">
                <PostList />
            </div>
        </div>
    );

}

export default HomeComponent;