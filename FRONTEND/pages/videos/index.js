import React, { useEffect } from 'react';
import Layout from '../../components/layout';
import Head from 'next/head';
import MessageBoxs from '../../components/MessageBoxs';
import VideoList from './VideoList';


export default function videosPage() {
    return (
        <Layout>
            <Head>
                <title>Videos Page</title>
            </Head>
            <MessageBoxs />
            <VideoList />
        </Layout>
    )
}
