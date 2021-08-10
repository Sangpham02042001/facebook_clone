import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Row, Col, Form, Input, Button, Modal } from 'antd'
import { showError, showSuccess } from '../../utils/utils'
import { axiosInstance } from '../../utils/axios.util'

export default function Signup() {
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const onFinish = async ({ username, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      showError('Password not match')
      return;
    }
    try {
      const response = await axiosInstance.post('/api/users', {
        name: username,
        email,
        password
      });
      let { message } = response.data
      if (message) {
        showSuccess(message)
        form.resetFields()
        setModalVisible(true)
      }
    } catch (err) {
      let { data } = err.response
      if (data.error.keyValue && data.error.keyValue['email']) {
        showError('Email already exist')
      } else {
        showError('Something wrong')
      }
    }
    console.log('Success:', username, email, password, confirmPassword);
  };

  const onFinishFailed = (error) => {
    console.log('Failed:', error);
  };

  const handleModalClose = () => {
    setModalVisible(false)
  }

  const handleChange = type => e => {
    let value = e.target.value
    switch (type) {
      case "email":
        setEmail(value)
        break;
      case "password":
        setPassowrd(value);
        break;
    }
  }
  return (
    <>
      <Head>
        <title>Signup</title>
        <link rel="icon" href="/images/facebook.ico" />
      </Head>
      <Row type="flex" justify="center" align="top"
        style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Col span={8} style={{ marginTop: '80px', padding: '15px', background: '#fff', borderRadius: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <Image src='/images/facebook_logo.svg' alt="Facebook Logo"
              width={300} height={100} />
          </div>
          <Form
            name="Sign Up"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{
                required: true,
                type: "email",
                message: "The input is not valid E-mail!"
              }]}
            >
              <Input autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Username must be minimum 5 characters.' }]}
            >
              <Input.Password autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[{ required: true, message: 'Please input your confirm password!' }]}
            >
              <Input.Password autoComplete="off" />
            </Form.Item>

            <p style={{ textAlign: 'right' }}>Have account ? {' '} <Link href="/signin">Log in here.</Link></p>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Modal title="Welcome to Facebook" visible={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key='Close' onClick={handleModalClose}>
            Close
          </Button>,
          <Button role='link' type="primary">
            <Link href="/signin">Sign in now</Link>
          </Button>
        ]}>
        <Image src="/images/facebook_community.jpg" alt="Facebook Community"
          width={500} height={300} />
      </Modal>
    </>
  )
}
