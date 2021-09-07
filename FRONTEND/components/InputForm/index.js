import React, { useState, useEffect } from 'react';
import { Input, Button, Upload, message, Modal, Row, Col, Avatar } from 'antd';
import { addPost } from '../../store/reducers/post.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import styles from './InputForm.module.scss';
import AvatarProfile from '../AvatarProfile';
import { VideoCameraFilled, FileImageFilled } from '@ant-design/icons'

const InputForm = () => {

  const dispatch = useDispatch();
  const placeholderDefault = "What do u think?";
  const [placeHolder, setPlaceHolder] = useState(placeholderDefault);
  const [title, setTitle] = useState('');
  const [bt_disable, setBt_disable] = useState(true);
  const user = useSelector(state => state.userReducer.user);
  const [fileListImg, setFileListImg] = useState([]);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [fileListVideo, setFileListVideo] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onChangeImg = ({ fileList }) => {

    for (let file of fileList) {
      if (file.status == "done") {
        console.log(JSON.stringify(file))
        setImage(file.originFileObj);
        setBt_disable(false);
      }
    }

    if (!fileList.length) {
      setImage(null);
      if (!video) {
        setBt_disable(true);
      }
    }

    setFileListImg(fileList);
  };

  function checkTypeFileUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isLt2M) {
      message.error('Image must smaller than 4MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const onChangeTextArea = (event) => {
    setTitle(event.target.value);
    if (event.target.value) {
      setBt_disable(false);
      setPlaceHolder(event.target.value);
    } else {
      if (!image && !video) {
        setBt_disable(true);
      }
      setPlaceHolder(placeholderDefault);
    }
  }

  const handlePost = (event) => {
    let userId = user._id;
    event.preventDefault();
    console.log(video)
    dispatch(addPost({ title, userId, image, video }));

    //text area
    setTitle('');
    setBt_disable(true);
    setPlaceHolder(placeholderDefault);
    //image
    setFileListImg([]);
    setImage(null);
    //video
    setFileListVideo([]);
    setVideo(null);
    setIsModalVisible(false);
  }

  const onChangeVideo = ({ fileList }) => {
    for (let file of fileList) {
      if (file.status == "done") {
        setVideo(file.originFileObj);
        console.log(file);
        setBt_disable(false);
      }
    }

    if (!fileList.length) {
      setVideo(null);
      if (!image) {
        setBt_disable(true);
      }
    }

    setFileListVideo(fileList);
  }


  const showModal = () => {
    setIsModalVisible(true);
  };



  const cancelModal = () => {
    setIsModalVisible(false);
  };



  return (
    <div className={styles["input-component"]}>
      <Row >
        <Col flex="15px">
          <AvatarProfile user={user} showName={false} />
        </Col>
        <Col flex="auto">
          <Button className={styles["btn-inputForm"]} shape="round" onClick={showModal} >{placeholderDefault}</Button>
        </Col>

      </Row>

      <Modal title="Create post" visible={isModalVisible} onCancel={cancelModal} footer={null}>
        <Row>
          <Col>
            <AvatarProfile user={user} showName={true} />
          </Col>
        </Row>
        <Row justify="space-around" align="top" gutter={[16, 48]}>
          <Col span={24}>
            <Input.TextArea style={{ width: "100%" }}
              autoSize={{ minRows: 5, maxRows: 8 }}
              maxLength={10000} showCount={true}
              bordered={false} placeholder={placeHolder}
              onChange={onChangeTextArea} value={title} />
          </Col>
        </Row>
        <Row justify="end" align="middle" gutter={[16, 48]}>
          <Col >
            <Upload
              listType="picture"
              fileList={fileListImg}
              onChange={onChangeImg}
              beforeUpload={checkTypeFileUpload}
              accept="image/*,video/*"
            >
              {fileListImg.length < 1 &&
                <Button shape="circle" size="large" ghost={true} icon={<FileImageFilled style={{ color: "green" }} icon={faImages} />} />
              }
            </Upload>

          </Col>
          <Col>
            <Upload
              fileList={fileListVideo}
              onChange={onChangeVideo}
              accept="video/*"
            >
              {fileListVideo.length < 1 &&
                <Button shape="circle" size="large" ghost={true} icon={<VideoCameraFilled style={{ color: "red" }} />} />
              }

            </Upload>

          </Col>
        </Row>
        <Row justify="space-around" align="bottom" gutter={[16, 48]}>
          <Col span={24}>
            <Button type="primary" shape="round" size="medium" style={{ width: "100%" }} onClick={handlePost} disabled={bt_disable} >Post</Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default InputForm;