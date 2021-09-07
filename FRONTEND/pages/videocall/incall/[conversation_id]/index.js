

import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import Peer from 'simple-peer';
import socketClient from '../../../../socketClient';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head'

export default function VideoCall() {
    const userLogin = useSelector(state => state.userReducer.user);
    const conversations = useSelector(state => state.conversationReducer.conversations);
    const [stream, setStream] = useState();
    const [callerSignal, setCallerSignal] = useState();
    const [isCalling, setIsCalling] = useState(false);
    const [callerId, setCallerId] = useState('');
    const [callAccepted, setCallAccepted] = useState(false);
    const router = useRouter();
    let { conversationId } = router.query;
    const userVideo = useRef();
    const partnerVideo = useRef();

    const conversation = conversations.find(c => c._id === conversationId);
    const participantId = conversation && conversation.participant._id;

    useEffect(() => {
        socketClient.on("hey", ({ from, signalData }) => {
            setCallerSignal(signalData);
            setIsCalling(true);
            setCallerId(from);
        })

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        })

    }, [])


    const startCall = (event) => {
        event.preventDefault();
        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {

                iceServers: [
                    {
                        urls: "stun:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683"
                    },
                    {
                        urls: "turn:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683"
                    }
                ]
            },
            stream: stream,
        });

        console.log('start ccall')

        peer.on("signal", data => {
            console.log('emit signal start', userLogin._id, participantId)
            socketClient.emit("user-call", { from: userLogin._id, to: participantId, signalData: data })
        })

        peer.on("stream", stream => {
            console.log('stream start')
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = stream;
            }
        });

        socketClient.on("accepted-call", ({ signalData }) => {
            console.log('call accept')
            setCallAccepted(true);
            peer.signal(signalData);
        })

    }

    const acceptCall = (event) => {
        event.preventDefault();
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });
        peer.on("signal", data => {
            socketClient.emit("accept-call", { to: callerId, signal: data })
        })

        peer.on("stream", stream => {
            partnerVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal);
    }



    return (
        <>
            <Head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Video Call</title>
            </Head>
            <div>
                <h1>ROOM CHAT</h1>
                {stream && <video muted ref={userVideo} autoPlay />}
                {callAccepted && <video playsInline ref={partnerVideo} autoPlay />}
                <Button onClick={startCall}>Start Call</Button>
                {
                    isCalling && <Button onClick={acceptCall}>Accept</Button>
                }
            </div>
        </>
    )
}

