import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Router from 'next/router'
import { Row, Col, Form, Input, Button } from 'antd'
import { showError, showSuccess } from '../../utils/utils'
import { axiosInstance } from '../../utils/axios.util'

export default function Signin() {
  const onFinish = async ({ email, password }) => {
    try {
      const response = await axiosInstance.post('/api/auth/signin', {
        email, password
      });
      if (response.status === 200) {
        console.log(response.data)
        showSuccess('Sign in successfully')
        Router.push('/')
      }
    } catch (error) {
      let { data } = error.response
      if (data && data.error) {
        showError(data.error)
      }
    }
  };

  const onFinishFailed = () => {
    console.log('Failed:');
  };

  return (
    <>
      <Head>
        <title>Signin</title>
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
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{
                required: true,
                type: "email",
                message: "The input is not valid E-mail!"
              }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <p style={{ textAlign: 'right' }}>Don't have account ? {' '} <Link href="/signup">Register here.</Link></p>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  )
}
