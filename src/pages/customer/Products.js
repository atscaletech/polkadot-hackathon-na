import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Row, Col, Image, Button, Typography, PageHeader } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import Loading from '../../components/Loading';
import { getProducts } from "../../services/api";

const { Meta } = Card;
const { Paragraph } = Typography;

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Products() {
  const navigate = useNavigate();
  const query = useQuery();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const merchant = query.get('merchant_address');

  let fetchProducts = async () => {
    setIsLoading(true);
    const result = await getProducts();
    setProducts(result);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const checkoutProduct = (productId) => {
    navigate(`/shop/checkout?product_id=${productId}&merchant_address=${merchant}`)
  }

  return (
    <div>
      <Loading isLoading={isLoading}></Loading>
      <PageHeader
        title="Products"
      />
      <Row gutter={24} style={{ paddingLeft: '32px', paddingRight: '32px' }}>
        {
          products.map((product) => <Col key={product.id} span={8}>
            <Card
              cover={
                <>
                  <Image src={product.images[0].url}/>
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
                    <Paragraph strong>{product.price} {product.currency.symbol}</Paragraph>
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
