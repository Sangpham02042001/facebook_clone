import AvatarProfile from "../AvatarProfile"
import { Row, Col, Dropdown, Menu, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import styles from './comment.module.scss';
import { useDispatch } from "react-redux";
import { deleteComment, hiddenComment } from "../../store/reducers/post.reducer";

const CommentComponent = (props) => {
    const dispatch = useDispatch();
    const handleMenuClick = (item) => {
        let userId = props.user._id;
        let postId = props.post._id;
        let commentId = props.comment._id;
        if (item.key === "delete") {
            dispatch(deleteComment({ userId, postId, commentId }));
        } else if (item.key === "hidden") {
            dispatch(hiddenComment({ postId, commentId }))
        } else {
            message.info('Click on menu item.');
        }

    }
    const menu = (
        <Menu onClick={handleMenuClick}>
            {
                props.user._id == props.comment.user._id &&
                <Menu.Item key="delete" >
                    Delete
                </Menu.Item>
            }
            <Menu.Item key="hidden" >
                Hidden
            </Menu.Item>


        </Menu>
    );
    return (
        <>
            <Row style={{ marginTop: "15px" }}>
                <Col flex="15px">
                    <AvatarProfile user={props.comment.user} showName={false} />
                </Col>
                <Col  style={{ maxWidth: "80%" }}>
                    <Col style={{ backgroundColor: "#f0f2f5", borderRadius: "15px", padding: "10px", textAlign: "left" }} >
                        <div style={{ fontWeight: "bold" }}>{props.comment.user.name}</div>
                        {props.comment.comment}
                    </Col>

                    <div style={{ fontSize: "12px", paddingLeft:"15px" }}>{props.timeFormatter(props.comment.createdAt)}</div>
                </Col>
                <Col >
                    <Dropdown className={styles["btn-dropdown"]} overlay={menu} placement="bottomCenter" trigger={["click"]}>
                        <Button 
                            shape="circle"
                            size="medium"
                            icon={<EllipsisOutlined style={{ fontSize: '24px' }} />}
                            
                        />
                    </Dropdown>
                </Col>


            </Row>



        </>
    )
}

export default CommentComponent;