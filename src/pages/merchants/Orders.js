import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, PageHeader, Table, Space, Tag } from 'antd';
import { getOrders } from "../../services/api";
import { Libra, getAccounts } from '../../services/libra';

const tableData = (orders, products) => orders.map((order) => ({
  key: order.id,
  order_id: `#000${order.id}`,
  customer_name: order.customer.name,
  product_title: order.items[0].product_title,
  quantity: order.items[0].quantity,
  amount: `${order.total_amount} ${order.currency.symbol}`,
  status: order.status,
}));

const actions = (_, record) => (
  <Space size="middle">
    {
      record.status === 'Pending' && 
      <>
      <a>Accept</a>
      <a>Reject</a>
      </> 
    }

    {
      record.status === 'Accepted' && 
      <>
        <a>Cancel</a>
        <a>Fulfill</a>
      </> 
    }
  </Space>
);

const status = (_, record) => (
  <Space size="middle">
    { record.status === 'Pending' && <Tag color='#BDE909'>{record.status}</Tag> }
    { record.status === 'Accepted' && <Tag color='#BCA9F1'>{record.status}</Tag> }
    { record.status === 'Rejected' && <Tag color='#FA554D'>{record.status}</Tag> }
    { record.status === 'Cancelled' && <Tag color='#ABB6B2'>{record.status}</Tag> }
    { record.status === 'Fulfilled' && <Tag color='#BCA9F1'>{record.status}</Tag> }
    { record.status === 'Completed' && <Tag color='#32C25E'>{record.status}</Tag> }
  </Space>
);

const columns = [
  {
    title: 'Order',
    dataIndex: 'order_id',
    key: 'order_id',
  },
  {
    title: 'Customer',
    dataIndex: 'customer_name',
    key: 'customer_name',
  },
  {
    title: 'Product',
    dataIndex: 'product_title',
    key: 'product_title',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Status',
    key: 'status',
    render: status,
  },
  {
    title: 'Action',
    key: 'action',
    render: actions,
  }
];

export default function AccountInfo() {
  const [orders, setOrders] = useState([]);

  let fetchOrders = async () => {
    const result = await getOrders();
    setOrders(result);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <PageHeader
        title="Orders"
      />
      <Table columns={columns} dataSource={tableData(orders)}/>
    </div>
  )
};
