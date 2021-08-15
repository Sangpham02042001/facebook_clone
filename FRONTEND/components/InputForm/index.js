import React, { useState } from 'react';
import { Input, Button, Upload, message } from 'antd';
import { addPost } from '../../store/reducers/post.reducer';
import { useDispatch, useSelector } from 'react-redux';
import styles from './InputForm.module.scss';
import ImgCrop from 'antd-img-crop';



const InputForm = () => {
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);
  const placeholderDefault = "What do u think?"
  const [placeHolder, setPlaceHolder] = useState(placeholderDefault);
  const handleShowPost = () => {
    setIsShow(!isShow);
  }
  const [title, setTitle] = useState('');
  const [bt_disable, setBt_disable] = useState(true);
  const userId = useSelector(state => state.userReducer.user._id);
  const [fileList, setFileList] = useState([]);
  const [image, setImage] = useState(null);

  const onChange = ({ fileList: newFileList }) => {

    for (let file of newFileList) {
      if (file.status == "done") {
        setImage(file.originFileObj);
        setBt_disable(false);
      }
    }

    if (!newFileList.length) setBt_disable(true);

    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (event) => {
    setTitle(event.target.value);
    if (event.target.value) {
      setBt_disable(false);
      setPlaceHolder(event.target.value);
    } else {
      if (!image) {
        setBt_disable(true);
      }
      setPlaceHolder(placeholderDefault);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addPost({ title, userId, image }));
    setTitle('');
    setBt_disable(true);
    setPlaceHolder(placeholderDefault);
    setFileList([]);

  }


  return (
    <div className={styles["input-form"]}>
      <Button className={styles["btn-inputForm"]} onClick={handleShowPost} >{placeHolder}</Button>
      {isShow &&
        <div>
          <div>
            <TextArea rows={4} style={{ width: "40%" }} placeholder={placeHolder} onChange={handleChange} value={title} />
            <ImgCrop rotate>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                beforeUpload={beforeUpload}
              >
                {fileList.length < 1 && '+ Upload'}
              </Upload>
            </ImgCrop>
          </div>
          <div>
            <Button type="primary" onClick={handleSubmit} disabled={bt_disable} >Post</Button>
          </div>
        </div>}
    </div>
  );
}

export default InputForm;