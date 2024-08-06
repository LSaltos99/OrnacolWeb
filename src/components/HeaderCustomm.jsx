// src/components/HeaderCustom.jsx
import React, { Component } from 'react';
import { Layout, Menu, Badge } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
const { Header } = Layout;
const { SubMenu } = Menu;
import avatar from '../style/imgs/usr.jpg';

class HeaderCustom extends Component {
    state = {
        collapsed: false,
    };

    render() {
        return (
            <Header style={{ background: '#fff', padding: 0, height: 65, lineHeight: '65px' }} className="custom-theme">
                <div
                    className="trigger custom-trigger"
                    onClick={this.props.toggle}
                    style={{ lineHeight: '65px' }}
                >
                    {this.state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div>
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right', border: 'none' }}
                >
                    <Menu.Item key="1">
                        <Badge overflowCount={10} style={{ marginLeft: 10 }}>
                            <MailOutlined />
                        </Badge>
                    </Menu.Item>
                    <SubMenu title={<span className="avatar"><img src={avatar} alt="avatar" /><i className="on bottom b-white" /></span>}>
                        <Menu.ItemGroup title="Control de usuario">
                            <Menu.Item key="setting:1">Prueba 1</Menu.Item>
                            <Menu.Item key="setting:2">Prueba 2</Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.ItemGroup title="Avanzado">
                            <Menu.Item key="setting:3">Configuración</Menu.Item>
                            <Menu.Item key="setting:4">Salir</Menu.Item>
                        </Menu.ItemGroup>
                    </SubMenu>
                </Menu>
                <style>
                    {`
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -40px;
                    }
                    .ant-menu-horizontal .ant-menu-item {
                        line-height: 65px;
                    }
                    `}
                </style>
            </Header>
        )
    }
}

export default HeaderCustom;
