import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Image, Button, Input, Form, Typography, PageHeader, Divider, Space, InputNumber, Alert, Select, notification } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import Loading from '../../components/Loading';
import { getProduct, createOrder } from "../../services/api";
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
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('Your Name');
  const [address, setAddress] = useState('Your Address');
  const [postalCode, setPostalCode] = useState('Your Postal Code');
  const [email, setEmail] = useState('hello@atscale.xyz');

  const productId = query.get('product_id');
  const merchant_address = query.get('merchant_address');
  if (!productId) {
    navigate(`/shop?merchant_address=${merchant_address}`);
  }

  let fetchProduct = async () => {
    setIsLoading(true);
    const result = await getProduct(productId);
    if (result) {
      setProduct(result);
    }
    setIsLoading(false);
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
      return await libra.createPayment(
        selectedAccountAddress,
        merchant_address,
        product.price * quantity,
        product.currency,
        "libra_checkout_description",
        "libra_checkout_receipt",
      );
    } catch(err) {
      throw err;
    }
  }

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    try {
      const payment_hash = await createPayment();
    
      await createOrder(merchant_address, {
        customer: {
          name,
          address,
          postalCode,
          email,
          wallet: selectedAccountAddress,
        },
        items: [
          {
            product_title: product.title,
            price: product.price,
            currency: product.currency,
            quantity,
            amount: quantity * product.price,
          }
        ],
        total_amount: quantity * product.price,
        currency: product.currency,
        status: "Pending",
        payment_hash,
      });

      navigate('/shop/checkout/success');
    } catch (err) {
      notification.error({
        message: 'Transaction Failed',
        description: err.message,
      });
    }

    setIsPlacingOrder(false);
  };

  useEffect(() => {
    fetchProduct();
    if (accounts.length === 0) {
      connectWallet();
    }
    // eslint-disable-next-line
  }, []);

  console.log('Foo');

  const errorMessage = (() => {
    if (accounts.length === 0) {
      return 'There is no PolkadotJs Extension in your browser.'
    }
    return null;
  })();

  return (
    <>
      <Loading isLoading={isLoading}/>
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
          <Form layout='vertical'>
            <Form.Item label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)}/>
            </Form.Item>
            <Form.Item label="Address">
              <Input value={address} onChange={(e) => setAddress(e.target.value)}/>
            </Form.Item>
            <Form.Item label="Postal Code">
              <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)}/>
            </Form.Item>
            <Form.Item label="Email">
              <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
            </Form.Item>
            {
              errorMessage &&  
              <Alert
                style={{ marginTop: '16px', marginBottom: '16px' }}
                description={errorMessage}
                type="error"
              />
            }
            <Space style={{ width: '100%', justifyContent: 'flex-end'}} align='end'>
              <Button
                type='primary'
                size='large'
                shape='round'
                icon={<ShoppingOutlined />}
                loading={isPlacingOrder}
                onClick={onPlaceOrder}
                disabled={!!errorMessage}
              >{ isPlacingOrder ? 'Placing order' : 'Place order'}</Button>
            </Space>
          </Form>
        </Col>
      </Row>
    </>
  )
};
