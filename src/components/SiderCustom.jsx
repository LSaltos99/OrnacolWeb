import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { MenuOutlined, AppstoreOutlined, HistoryOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        selectedKey: ''
    };

    componentDidMount() {
        const _path = this.props.path;
        this.setState({
            openKey: _path.substr(0, _path.lastIndexOf('/')),
            selectedKey: _path
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.collapsed !== this.props.collapsed) {
            this.onCollapse(this.props.collapsed);
        }
    }

    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
    };

    render() {
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsible
                collapsed={this.props.collapsed}
                onCollapse={this.onCollapse}
                style={{ overflowY: 'auto' }}
            >
                <div className="logo" />
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode={this.state.mode}
                    selectedKeys={[this.state.selectedKey]}
                >
                    <Menu.Item key="/dashboard">
                        <Link to='/dashboard'><AppstoreOutlined /><span className="nav-text">Home</span></Link>
                    </Menu.Item>
                    <Menu.Item key="/control-nodos">
                        <Link to='/control-nodos'><AppstoreOutlined /><span className="nav-text">Control de Nodos</span></Link>
                    </Menu.Item>
                    <Menu.Item key="/historico">
                        <Link to='/historico'><HistoryOutlined /><span className="nav-text">Histórico</span></Link>
                    </Menu.Item>
                </Menu>
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

export default SiderCustom;
