import React, { useState } from 'react';
import { Input, Button, Upload, message, Modal, Row, Col, Avatar } from 'antd';
import { addPost } from '../../store/reducers/post.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import styles from './InputForm.module.scss';
import ImgCrop from 'antd-img-crop';
import { baseURL } from '../../utils/axios.util';
import Link from 'next/link';


const InputForm = () => {
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const placeholderDefault = "What do u think?"
  const [placeHolder, setPlaceHolder] = useState(placeholderDefault);
  const [title, setTitle] = useState('');
  const [bt_disable, setBt_disable] = useState(true);
  const user = useSelector(state => state.userReducer.user);
  const userId = user._id;
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
    setImage(null);
    setIsModalVisible(false);
  }

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const AvatarProfile = (props) => {
    return (
      <Link href={`/profile/${user._id}`}>
        <a>
          <Avatar
            style={{ marginRight: '5px', marginBottom: '5px' }}
            src={`${baseURL}/api/user/avatar/${user._id}`} />
          {props.showName && <span style={{ fontSize: "20px", fontWeight: "bold" }}>{user.name}</span>}
        </a>
      </Link>
    )
  }

  return (
    <div className={styles["input-component"]}>
      <div className={styles["input-form"]}>
        <AvatarProfile showName={false} /> <span>
          <Button className={styles["btn-inputForm"]} shape="round" onClick={showModal} >{placeHolder}</Button>
        </span>

        <Modal title="Create post" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={[]}>
          <Row>
            <Col>
              <AvatarProfile showName={true} />
            </Col>
          </Row>
          <Row justify="space-around" align="top" gutter={[16, 48]}>
            <Col span={24}>
              <TextArea rows={4} col={10} style={{ width: "100%" }} bordered={false} placeholder={placeHolder} onChange={handleChange} value={title} />
            </Col>
          </Row>
          <Row justify="end" align="middle" gutter={[16, 48]}>
            <Col >
              <ImgCrop rotate>
                <Upload
                  listType="picture"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={beforeUpload}
                >
                  {fileList.length < 1 &&
                    <Button shape="circle" size="large" ghost={true} icon={<FontAwesomeIcon style={{ color: "green" }} className={styles["icon-image"]} icon={faImages} />} />
                  }
                </Upload>
              </ImgCrop>
            </Col>
          </Row>
          <Row justify="space-around" align="bottom" gutter={[16, 48]}>
            <Col span={4}>
              <Button type="primary" onClick={handleSubmit} disabled={bt_disable} >Post</Button>
            </Col>
          </Row>
        </Modal>
      </div>
    </div>
  );
}

export default InputForm;