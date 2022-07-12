import React, { useEffect, useState } from 'react';
import { PageHeader, Table, Space, Tag, Modal, Button, notification } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";
import { getOrders } from "../../services/api";
import { Libra, getAccounts } from '../../services/libra';

const tableData = (orders) => orders.map((order, accountAddress) => ({
  key: order.id,
  order_id: `#000${order.id}`,
  customer_name: order.customer.name,
  product_title: order.items[0].product_title,
  quantity: order.items[0].quantity,
  amount: `${order.total_amount} ${order.currency.symbol}`,
  status: order.status,
  accountAddress: accountAddress,
}));

const ACCEPT_PAYMENT = 'accept_payment';
const REJECT_PAYMENT = 'accept_payment';
const FULFILL_PAYMENT = 'fulfill_payment';
const CANCEL_PAYMENT = 'cancel_payment';

const modalText = (action, orderId) => {
  switch (action) {
    case ACCEPT_PAYMENT: return `Are you sure that you want to accept order ${orderId}?`;
    case REJECT_PAYMENT: return `Are you sure that you want to reject order ${orderId}?`;
    case FULFILL_PAYMENT: return `Are you sure that you fulfilled the order ${orderId}?`;
    case CANCEL_PAYMENT: return `Are you sure that you want to cancel order ${orderId}?`;
    default: return '';
  }
}

function OrderActions({ record }) {
  const [action, setAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);

    const libra = await Libra.init();

    try {
      if (action === ACCEPT_PAYMENT) {
        await libra.acceptPayment(
          record.accountAddress,
          record.payment_hash,
        );
        notification.success({
          message: 'Transaction Success',
          description: 'Order has been accepted. Please deliver and fulfill the order.',
        });
      }

      if (action === REJECT_PAYMENT) {
        await libra.acceptPayment(
          record.accountAddress,
          record.payment_hash,
        );
        notification.success({
          message: 'Transaction Success',
          description: `Order ${record.order_id} has been rejected.`,
        });
      }

      if (action === FULFILL_PAYMENT) {
        await libra.fulfillPayment(
          record.accountAddress,
          record.payment_hash,
        );
        notification.success({
          message: 'Transaction Success',
          description: `Order ${record.order_id} has been fulfilled.`,
        });
      }

      if (action === CANCEL_PAYMENT) {
        await libra.cancelPayment(
          record.accountAddress,
          record.payment_hash,
        );
        notification.success({
          message: 'Transaction Success',
          description: `Order ${record.order_id} is cancelled.`,
        });
      }

    } catch (err) {
      notification.error({
        message: 'Transaction Failed',
        description: err.message,
      });
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    setAction(null);
  };

  return (
    <Space size="middle">
      {
        record.status === 'Pending' && 
        <>
          <Button type='link' onClick={() => setAction(ACCEPT_PAYMENT)}>Accept</Button>
          <Button type='link' onClick={() => setAction(REJECT_PAYMENT)}>Reject</Button>
        </> 
      }

      {
        record.status === 'Accepted' && 
        <>
          <Button type='link' onClick={() => setAction(FULFILL_PAYMENT)}>Cancel</Button>
          <Button type='link' onClick={() => setAction(CANCEL_PAYMENT)}>Fulfill</Button>
        </>
      }
      <Modal
        title="Confirmation"
        visible={!!action}
        onOk={handleAction}
        onCancel={handleCancel}
        confirmLoading={isLoading}
      >
        <p>{modalText(action, record.order_id)}</p>
      </Modal>
    </Space>
  )
}

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
    render: (_, record) => (
      <OrderActions record={record}></OrderActions>
    ),
  }
];

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const query = useQuery();
  const navigate = useNavigate();

  const accountAddress = query.get('account_address');
  if (!accountAddress) {
    navigate('/merchant/select-account');
  }

  let fetchOrders = async () => {
    const result = await getOrders();
    setOrders(result);
  };

  useEffect(() => {
    fetchOrders();
    if (accountAddress) {
      getAccounts();
    }
  }, []);

  return (
    <div>
      <PageHeader
        title="Orders"
      />
      <Table columns={columns} dataSource={tableData(orders, accountAddress)}>
      </Table>
    </div>
  )
};
