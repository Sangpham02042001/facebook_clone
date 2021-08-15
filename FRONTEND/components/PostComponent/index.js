import { Button } from 'antd';
import { useSelector } from 'react-redux';
import styles from './post.module.scss';


const PostComponent = (params) => {
    const user = useSelector(state => state.userReducer)
    let base64URL = params.post.image && "data:" + params.post.image.contentType
        + ";base64, " + params.post.image.data;
    let numberOfLike = 10;

    const handleLike = () => {

    }

    return (
        <div className={styles["post-component"]} >
            <div className="post-header">
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>{user.user.name}</div>
            </div>
            <div className="post-main">
                <div style={{ fontSize: "30px" }}>{params.post.article}</div>
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