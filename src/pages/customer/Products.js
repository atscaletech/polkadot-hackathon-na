import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Image, Button, Typography, PageHeader } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { getProducts } from "../../services/api";

const { Meta } = Card;
const { Paragraph } = Typography;

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);

  let fetchProducts = async () => {
    const result = await getProducts();
    setProducts(result);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const checkoutProduct = (productId) => {
    navigate(`/shop/checkout?product_id=${productId}`)
  }

  return (
    <div>
      <PageHeader
        title="Products"
      />
      <Row gutter={24}>
        {
          products.map((product) => <Col span={8}>
            <Card
              cover={
                <>
                  <Image
                    preview={{ visible: false }}
                    src={product.images[0].url}
                    onClick={() => setVisible(true)}
                  />
                  <div style={{ display: 'none' }}>
                    <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
                      { product.images.map(image => <Image key={image.url} src={image.url}/>)}
                    </Image.PreviewGroup>
                  </div>
                </>
              }
              actions={[
                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", paddingRight: "24px" }}>
                  <Button
                    type='primary'
                    size='large'
                    shape='round'
                    icon={<ShoppingOutlined />}
                    onClick={() => checkoutProduct(product.id)}
                  >
                    Buy now
                  </Button>
                </div>
              ]}
            >
              <Meta
                title={product.title} 
                description={
                  <>
                    <Paragraph strong>${product.price} {product.currency.symbol}</Paragraph>
                    <Paragraph>{product.description}</Paragraph>
                  </>
                }
              />
            </Card>
          </Col>)
        }
      </Row>
    </div>
  )
};
