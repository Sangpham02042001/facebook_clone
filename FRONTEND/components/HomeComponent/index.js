import { useState } from 'react';
import PostComponent from '../PostComponent';
import { Input, Button } from 'antd';
import { addStatus } from '../../store/reducers/posts.reducer';
import { useDispatch, useSelector } from 'react-redux';

const InputForm = () => {
    const { TextArea } = Input;
    const dispatch = useDispatch();
    const [isShow, setIsShow] = useState(false);
    const [placeholder] = useState("What do u think?");
    const handleShowPost = () => {
        setIsShow(!isShow);
    }

    const PostUpload = (props) => {
        const [title, setTitle] = useState('');
        const [bt_disable, setBt_disable] = useState(true);
        const [textPlaceHolder, setTextPlaceHolder] = useState(props.placeholder);
        const userId = useSelector(state => state.userReducer.user._id);

        const handleChange = (event) => {
            setTitle(event.target.value);
            if (event.target.value) {
                setBt_disable(false);
                setTextPlaceHolder(event.target.value);
            } else {
                setBt_disable(true);
                setTextPlaceHolder(props.placeholder);
            }
        }

        const handleSubmit = (event) => {
            event.preventDefault();
            dispatch(addStatus({title, userId}));
            setTitle('');
            setBt_disable(true);
            setTextPlaceHolder(props.placeholder);

        }
        return (
            <div>
                <TextArea rows={4} style={{ width: 500 }} placeholder={textPlaceHolder} onChange={handleChange} value={title} />
                <div>
                    <Button type="primary" onClick={handleSubmit} disabled={bt_disable} >Post</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="input-form">
            <Button onClick={handleShowPost}>{placeholder}</Button>
            {isShow && <PostUpload placeholder={placeholder} />}


        </div>
    );
}


const HomeComponent = () => {

    return (
        <div className="home-component">
            <div className="post-form">
                <InputForm />
            </div>
            <div className="post-article">
                <PostComponent />
            </div>
        </div>
    );

}

export default HomeComponent;
