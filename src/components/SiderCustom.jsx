import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { AppstoreOutlined, HistoryOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const SiderCustom = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('');
    const location = useLocation();

    useEffect(() => {
        setSelectedKey(location.pathname);
    }, [location.pathname]);

    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    const menuClick = e => {
        setSelectedKey(e.key);
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            style={{ height: '100vh', overflow: 'auto', background: '#f0f2f5' }}
        >
            <div className="logo" style={{ height: '32px', margin: '16px', background: '#1890ff', color: '#fff', textAlign: 'center', lineHeight: '32px' }}>
                ORNACOL
            </div>
            <Menu
                onClick={menuClick}
                theme="light" 
                mode="inline"
                selectedKeys={[selectedKey]}
            >
                <Menu.Item key="/dashboard" icon={<AppstoreOutlined />}>
                    <Link to='/dashboard'>Home</Link>
                </Menu.Item>
                <Menu.Item key="/control-nodos" icon={<AppstoreOutlined />}>
                    <Link to='/control-nodos'>Control de Nodos</Link>
                </Menu.Item>
                <Menu.Item key="/historico" icon={<HistoryOutlined />}>
                    <Link to='/historico'>Histórico</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default SiderCustom;
