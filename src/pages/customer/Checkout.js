import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Image, Button, Input, Form, Typography, PageHeader, Divider, Space, InputNumber, Select, notification } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { getProduct } from "../../services/api";
import { getAccounts, Libra } from "../../services/libra";

const { Option } = Select;
const { Paragraph, Title } = Typography;

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Checkout() {
  const query = useQuery();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountAddress, setSelectedAccountAddress] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const productId = query.get('product_id');
  if (!productId) {
    navigate('/shop');
  }
  const merchant_address = '5DCYwekH6i69DfHBDeYmQHdzzBGghVFCgdENd2tmf6JBs5kR';

  let fetchProduct = async () => {
    const result = await getProduct(productId);
    if (result) {
      setProduct(result);
    }
  };

  const connectWallet = async () => {
    const result = await getAccounts();
    if (result.length > 0) {
      setAccounts(result);
      setSelectedAccountAddress(result[0].address);
    }
  };

  const createPayment = async () => {
    let libra = await Libra.init();

    try {
      await libra.createPayment(
        selectedAccountAddress,
        merchant_address,
        product.price * quantity,
        product.currency,
        "libra_checkout_description",
        "libra_checkout_receipt",
      );
      return true;
    } catch(err) {
      notification.error({
        message: 'Transaction Failed',
        description: err.message,
      });
      return false;
    }
  }

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    const isSuccess = await createPayment();
    if (isSuccess) {
      navigate('/shop/checkout/success');
    }
    setIsPlacingOrder(false);
  };

  useEffect(() => {
    fetchProduct();
    if (accounts.length === 0) {
      connectWallet();
    }
    console.log("Fire side effects!");
  }, []);

  return (
    <>
      <PageHeader
        onBack={() => navigate('/shop')}
        title="Checkout"
      />
      <Row gutter={24}>
        <Col span={12} style={{ padding: '8px 32px', borderRight: "solid 1px #ABB6B2" }}>
          {
            product &&
            <Space direction='vertical'>
              <Image src={product.images[0].url}></Image>
              <Divider/>
              <Title level={5}>{product.title}</Title>
              <Paragraph level={5}>{product.description}</Paragraph>
              <Row>
                <Col span={6}>
                  <Paragraph strong>Price:</Paragraph>
                </Col>
                <Col span={7}>
                  <Paragraph strong>${product.price} {product.currency.symbol}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Paragraph strong>Quantity:</Paragraph>
                </Col>
                <Col span={7}>
                  <InputNumber
                    min={1}
                    defaultValue={1}
                    value={quantity}
                    onChange={(value) => setQuantity(value)}
                    controls
                  />
                </Col>
              </Row>
              <Divider/>
              <Row>
                <Col span={6}>
                  <Paragraph strong>Total:</Paragraph>
                </Col>
                <Col span={7}>
                  <Paragraph strong>${ product.price * quantity } {product.currency.symbol}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Paragraph strong>Pay by:</Paragraph>
                </Col>
                <Col span={6}>
                  { accounts.length > 0 && 
                    <Select value={selectedAccountAddress} onChange={(value) => setSelectedAccountAddress(value)}>
                      { accounts.map(account => <Option key={account.address} value={account.address}>{account.meta.name}</Option>)}
                    </Select> 
                  }
                </Col>
              </Row>
            </Space>
          }
        </Col>
        <Col span={12} style={{ padding: '8px 32px'}}>
          <Title level={4}>Delivery Information</Title>
          <Paragraph>This is work in progress </Paragraph>
          <Form layout='vertical'>
            <Form.Item label="Name">
              <Input readOnly disabled value='Andrew'/>
            </Form.Item>
            <Form.Item label="Address">
              <Input readOnly disabled value='68 Circular Road , #02-01 , Singapore'/>
            </Form.Item>
            <Form.Item label="Postal Code">
              <Input readOnly disabled value='+049422'/>
            </Form.Item>
            <Form.Item
              style={{ flex: '1 0 0' }}
              label="Email"
            >
              <Input readOnly disabled value='hello@atscale.xyz'/>
            </Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end'}} align='end'>
              <Button
                type='primary'
                size='large'
                shape='round'
                icon={<ShoppingOutlined />}
                loading={isPlacingOrder}
                onClick={onPlaceOrder}
              >Place order</Button>
            </Space>
          </Form>
        </Col>
      </Row>
    </>
  )
};
