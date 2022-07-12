import React, { useEffect, useState } from 'react';
import { PageHeader, Table, Space, Tag, Modal, Button, notification, Select } from 'antd';
import { useNavigate } from "react-router-dom";
import { getOrders, updateOrder } from "../../services/api";
import Loading from '../../components/Loading';
import { Libra, getAccounts } from '../../services/libra';
import { formatOrderId } from '../../utils/formatter';

const { Option } = Select;

const tableData = (orders, accountAddress) => orders.map((order) => ({
  key: order.id,
  order_id: order.id,
  merchant: order.merchant,
  product_title: order.items[0].product_title,
  quantity: order.items[0].quantity,
  amount: `${order.total_amount} ${order.currency.symbol}`,
  status: order.status,
  accountAddress: accountAddress,
}));

const DISPUTE = 'dispute';
const CANCEL_ORDER = 'cancel_order';

const modalText = (action, orderId) => {
  switch (action) {
    case DISPUTE: return `Are you sure that you want to dispute order ${formatOrderId(orderId)}?`;
    case CANCEL_ORDER: return `Are you sure that you want to cancel order ${formatOrderId(orderId)}?`;
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
      if (action === CANCEL_ORDER) {
        await libra.cancelPayment(
          record.accountAddress,
          record.payment_hash,
        );

        notification.success({
          message: 'Transaction Success',
          description: `Order ${formatOrderId(record.order_id)} has been accepted. Please deliver and fulfill the order.`,
        });

        await updateOrder(record.order_id, {
          status: 'Cancelled',
        });
        setIsLoading(false);
        return;
      }
    } catch (err) {
      notification.error({
        message: 'Transaction Failed',
        description: err.message,
      });
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setAction(null);
  };

  return (
    <Space size="small">
      {
        record.status === 'Pending' && 
        <>
          <Button type='link' onClick={() => setAction(CANCEL_ORDER)}>Cancel</Button>
        </> 
      }
      {
        (record.status === 'Accepted' || record.status === 'Fulfilled') && 
        <>
          <Button type='link' onClick={() => setAction(DISPUTE)}>Dispute</Button>
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
    { record.status === 'Disputed' && <Tag color='#FA554D'>{record.status}</Tag> }
  </Space>
);

const columns = [
  {
    title: 'Order',
    dataIndex: 'order_id',
    render: (_, { order_id }) => formatOrderId(order_id),
  },
  {
    title: 'Merchant',
    dataIndex: 'merchant',
    key: 'merchant',
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

export default function OrdersHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountAddress, setSelectedAccountAddress] = useState('');
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingAccount, setIsLoadingAccount] = useState(false);

  let loadAccounts = async () => {
    setIsLoadingAccount(true);
    const result = await getAccounts();
    if (result.length > 0) {
      setAccounts(result);
      setSelectedAccountAddress(result[0].address);
      setIsLoadingAccount(false);
    } else {
      navigate('/');
      setIsLoadingAccount(false);
    }
  };


  let fetchOrders = async () => {
    setIsLoadingOrders(true);
    const result = await getOrders();
    const filtered = result.filter(item => item.customer.wallet === selectedAccountAddress);
    setOrders(filtered);
    setIsLoadingOrders(false);
  };

  // eslint-disable-next-line
  useEffect(() => { loadAccounts(); }, []);
  // eslint-disable-next-line
  useEffect(() => { fetchOrders(); }, [selectedAccountAddress]);

  return (
    <>
      <Loading isLoading={isLoadingOrders || isLoadingAccount}></Loading>
      <Space style={{ justifyContent: 'space-between', width: '100%', paddingRight: '48px' }}>
        <PageHeader
          title="Order history"
        />
        <Select value={selectedAccountAddress} onChange={(value) => setSelectedAccountAddress(value)}>
          { accounts.map(account => <Option key={account.address} value={account.address}>{account.meta.name}</Option>)}
        </Select> 
      </Space>
      <Table style={{ width: '100%' }} columns={columns} dataSource={tableData(orders, selectedAccountAddress)}>
      </Table>
    </>
  )
};
