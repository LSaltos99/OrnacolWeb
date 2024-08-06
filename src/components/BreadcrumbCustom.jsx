import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom'; 

class BreadcrumbCustom extends React.Component {
    render() {
        const items = [
            {
                title: <Link to="/dashboard">Home</Link>
            },
            this.props.first && {
                title: this.props.first
            },
            this.props.second && {
                title: this.props.second
            }
        ].filter(item => item); 

        return (
            <Breadcrumb style={{ margin: '12px 0' }} items={items} />
        );
    }
}

export default BreadcrumbCustom;
