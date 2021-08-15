import { Button, Avatar } from 'antd';
import Link from 'next/link';
import styles from './post.module.scss';
import { baseURL } from '../../utils/axios.util'

const PostComponent = (props) => {
    let base64URL = props.post.image && "data:" + props.post.image.contentType
        + ";base64, " + props.post.image.data;
    let numberOfLike = 10;

    const handleLike = () => {

    }

    return (
        <div className={styles["post-component"]} >
            <div className="post-header">
                {
                    props.post.userId && <Link href={`/profile/${props.post.userId._id}`}>
                        <a>
                            <Avatar
                                style={{ marginRight: '5px', marginBottom: '5px' }}
                                src={`${baseURL}/api/user/avatar/${props.post.userId._id}`} />
                            <div style={{ fontSize: "20px", fontWeight: "bold" }}>{props.post.userId.name}</div>
                        </a>
                    </Link>
                }
            </div>
            <div className="post-main">
                <div style={{ fontSize: "30px" }}>{props.post.article}</div>
                <img src={base64URL} />
            </div>
            <div className="post-footer">
                <div>Like {numberOfLike}</div>
                <Button onClick={handleLike}>Like</Button>
                <Button>Comment</Button>
                <Button>Share</Button>
            </div>
        </div>
    );
}

export default PostComponent;