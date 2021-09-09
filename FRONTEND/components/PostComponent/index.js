import { Button, Divider, Row, Col, Dropdown, Menu, message, Input, Tooltip, Avatar } from 'antd';
import Link from 'next/link';
import styles from './post.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deletePost, reactPost, addComment, hiddenPost } from '../../store/reducers/post.reducer';
import { DeleteOutlined, EllipsisOutlined, LikeOutlined, ShareAltOutlined, CommentOutlined, LikeFilled, CloseCircleOutlined } from '@ant-design/icons';
import AvatarProfile from '../AvatarProfile';
import CommentComponent from '../Comment';
import { baseURL } from '../../utils/axios.util';
import LazyLoad from 'react-lazyload';

const PostComponent = (props) => {
    const dispatch = useDispatch();
    const [postReacted, setPostReacted] = useState(false);
    const [postCommented, setPostCommented] = useState(false);
    const [numberOfReact, setNumberOfReact] = useState(0);
    const reactList = props.post.reactList;


    useEffect(() => {

        const userReactPost = reactList.find(react => {
            return react.user._id == props.user._id
        });

        if (userReactPost) setPostReacted(true);

        setNumberOfReact(reactList.length);

    }, [])

    // const base64URL = props.post.image && "data:" + props.post.image.contentType
    //     + ";base64, " + Buffer.from(props.post.image.data.data).toString('base64');
    const base64URL = null;
    const userId = props.user._id;
    const postId = props.post._id;
    const reactType = "LIKE";

    const handleReact = () => {
        !postReacted ? setNumberOfReact(numberOfReact + 1) : setNumberOfReact(numberOfReact - 1);
        dispatch(reactPost({ userId, postId, reactType }));
        setPostReacted(!postReacted);
    }

    const handleComment = () => {

        setPostCommented(true);
    }

    const handleMenuClick = (item) => {

        if (item.key === "delete") {
            dispatch(deletePost({ userId, postId }));
        } else if (item.key === "hidden") {
            dispatch(hiddenPost({ postId }));
        } else {
            message.info('Click on menu item.');
        }

    }

    const postTimeFormatted = (time) => {
        let timeDiff = Date.now() - Date.parse(time);
        timeDiff /= 1000;

        let seconds = Math.round(timeDiff % 60);

        timeDiff = Math.floor(timeDiff / 60);

        let minutes = Math.round(timeDiff % 60);

        timeDiff = Math.floor(timeDiff / 60);

        let hours = Math.round(timeDiff % 24);

        timeDiff = Math.floor(timeDiff / 24);
        let days = timeDiff;


        if (days) return days + 'd';
        else if (hours) return hours + 'h';
        else if (minutes) return minutes + 'm';
        else return 'Just now';

    }

    const ShowPeopleReacted = () => {
        if (numberOfReact > 1 && postReacted) {
            return (
                <div><span ><LikeFilled style={{ color: "#119af6" }} /></span>   You and {numberOfReact - 1} others </div>
            )
        } else if (numberOfReact === 1 && postReacted) {
            return (
                <div><span ><LikeFilled style={{ color: "#119af6" }} /></span>   {props.user.name}</div>
            )
        } else if (numberOfReact > 0 && !postReacted) {
            return (
                <div><span ><LikeFilled style={{ color: "#119af6" }} /></span>   {numberOfReact}</div>
            )
        } else {
            return null;
        }
    }

    const ShowComment = (props) => {
        const [comment, setComment] = useState('');
        const commentList = props.post.comments.map(cmt => {
            return <CommentComponent key={cmt._id} post={props.post} user={props.user} comment={cmt} timeFormatter={postTimeFormatted} />
        });

        const handlePostChange = (event) => {

            setComment(event.target.value);

        }

        const handlePostComment = (event) => {

            if (comment) {
                dispatch(addComment({ userId, postId, comment }));
                setComment('');
            }
        }
        return (
            <>
                <Row>
                    <Col flex="15px">
                        <AvatarProfile user={props.user} showName={false} />
                    </Col>
                    <Col flex="auto">
                        <Input style={{ borderRadius: "15px", width: "95%", backgroundColor: "#f0f2f5" }}
                            maxLength={10000}
                            onPressEnter={handlePostComment} onChange={handlePostChange}
                            placeholder="Write an answer..." value={comment}
                            bordered={false}
                            size="large" />
                    </Col>
                </Row>
                {commentList}

            </>
        )
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            {
                props.user._id == props.post.user._id &&
                <Menu.Item key="delete" icon={<DeleteOutlined />}>
                    Delete this post
                </Menu.Item>
            }
            <Menu.Item key="hidden" icon={<CloseCircleOutlined />}>
                Hide post
            </Menu.Item>

        </Menu>
    );

    const Loading = () => (
        <div className="post-loading">
            <h5>Loading...</h5>
        </div>
    )


    return (
        <div className={styles["post-component"]} >
            <Row className={styles["post-header"]}>
                <Col span={2} >
                    <Avatar
                        style={{ marginRight: '5px', marginBottom: '5px' }}
                        src={`${baseURL}/api/user/avatar/${props.post.user._id}`} />
                </Col>


                <Col span={4}>
                    <Link href={`/profile/${props.post.user._id}`}>
                        <a>
                            <div style={{ fontSize: "15px", fontWeight: "600", color: '#050505' }}>{props.post.user.name}</div>
                            <div style={{ fontSize: "13px", fontWeight: "300", color: '#050505' }}>
                                {postTimeFormatted(props.post.createdAt)} . <i style={{ fontSize: '12px' }} className="fas fa-globe-asia"></i>

                            </div>
                        </a>
                    </Link>
                </Col>




                <Col offset={16} span={2}>
                    <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
                        <Button className={styles["btn-dropdown"]}
                            shape="circle"
                            size="medium"
                            icon={<EllipsisOutlined style={{ zIndex: 0, color: "black", fontSize: '24px', fontWeight: "bold" }} />}
                        />

                    </Dropdown>
                </Col>
            </Row>
            <Row>
                <div style={{ fontSize: "30px" }}>{props.post.article}</div>
            </Row>
            <Row>
                {
                    props.post.images.map(img => {
                        return (
                            <LazyLoad key={img._id} placeholder={<Loading />}>
                                <img key={img._id} src={img.url} width="100%" height="500px" />
                            </LazyLoad>
                        )
                    })
                }
            </Row>
            <Row >
                {
                    props.post.videos.map(vid => (
                        <LazyLoad key={vid._id} placeholder={<Loading />}>
                            <video key={vid._id} controls width="100%" height="500px" style={{ backgroundColor: 'black' }}>
                                <source src={vid.url} />
                            </video>
                        </LazyLoad>
                    ))
                }
            </Row>

            <Row>
                <Col >
                    <Tooltip title={reactList.map(react => <p key={react.user._id}>{react.user.name}</p>)}>
                        <span> <ShowPeopleReacted /></span>
                    </Tooltip>

                </Col>
            </Row>
            <Divider style={{ marginBottom: "2px", marginTop: "10px", borderColor: '#ced0d4' }} />
            <Row>
                <Col span={8}>
                    {
                        !postReacted ?
                            <Button className={styles["btn-react"]}
                                onClick={handleReact}
                                icon={<LikeOutlined />}>
                                <span>Like</span>
                            </Button>
                            :
                            <Button
                                className={styles["btn-react-active"]}
                                onClick={handleReact}
                                icon={<LikeFilled />}>
                                <span>Like</span>
                            </Button>
                    }
                </Col>
                <Col span={8}>
                    <Button className={styles["btn-react"]}
                        onClick={handleComment}
                        icon={<CommentOutlined />}>
                        <span>  Comment  </span>
                    </Button>
                </Col>
                <Col span={8}>
                    <Button className={styles["btn-react"]}
                        icon={<ShareAltOutlined />}>
                        <span>share</span>
                    </Button>
                </Col>
            </Row>

            {postCommented &&
                <>
                    <Divider style={{ marginBottom: "10px", marginTop: "2px", borderColor: '#ced0d4' }} />
                    <ShowComment post={props.post} user={props.user} />
                </>
            }
        </div>
    );
}

export default PostComponent;