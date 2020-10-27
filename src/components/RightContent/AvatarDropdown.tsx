import React, { useCallback } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history } from 'umi';
import { getPageQuery } from '@/utils/utils';

import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps {
    menu?: boolean;
}

const defaultAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAACJVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////G1tf3tSxJTpH06dP////K2dru8/PP3d7p7/D3+fra5OXr8fHN29zV3dbY4+TT3+Do7+/n7e7y6NP8/fySnbpYXZhLUJL09/fJ2Nfq5dSIk7VSV5X0uDfw9PXf6Ojc5ufM29zi4tXg4dW8zNK2xc7J1M305sf84q1weKfnwGT4ujv2ti/M2Nf06M9nbaFfZJ3lwm72tzP98NW/z9TNxcSdqsC9t7786L385bN0famBgafVzKT836NrcaNiaZ/Xy5xNU5PbyY/60Hj6zG34wlD4wEr4vUTxuUL3vEH3uDXz9/fN2dbE09bk4tXH1dTv5dLl282pt8fGv8LN0sHO0bzP0LnTzquNi6v13KnhxXvuvE7++e7+9eHU4OH+89zp38/d1Mr97MikscT96cGYpL7Qz7ScmbGCjLFaYJr61Yjdx4j10YP604H5xVr5xVnm7e3Q3t7w7Nvr4M/j38vu5MquvMqzvcjUzMezrrqno7X03rCOjKx6g6x2d6LqvlrrvVhCBfKSAAAAN3RSTlMAFCfv/fPxpuNrI8n77uGcmpVuRDcswNvYinNcMyAYB8uQZRv39t3cyrKwpz6RZPSEXRIG7b6kpxftdwAABjNJREFUaN6s1VlPE1EYxvGhK6W0bCruivsWY9zenHlm6TB2gVa0DbjQi14YuABMMIFwrSSKN1wZjTHqpTFxi/oBnWDFtvPOOUP19wX+Oct7jhZWz8jw2Ln06UwciGdOp8+NDY/0aP9TXyqZBSObTPX9n0Lk0ig8k9OlmXzBNQwiw3AL+ZnS9CQ8o5ci/1q4nEoDyNmOSwzXsXMA0qnL/7KIwRNeofiCJF4Uvc6JwUi3iesxwHRIyTGBWLKbTM9QP1C0KBSrCPQP7fi2XYwCtkuhuTYQvbijxKE9gGnRjlgmsOdQ+MaBBHIO7ZiTQ+JAyMSRAWDcoC4Y48DAkTCNw2cQu0NduhPDmcPqxu4sHlvUNesxsrtVjV0ZmAZxFjbK7xorq3Mrc+/XhBC1+UZ1Y53ZMhOZXfLGhTjGifGpunpT+FWqs+QzjvgF6TrisJk1lOdFkFqZfGwkJGvZHeUab2pCZnmdWUs08FyO93J7tSQUlomp9B7nG1fSMMmnviZUmB0zkb7CRgYwZZDPnFCq+U/fmMIA+5YgZrGbpVZl5iWGA8ybmAA35/MihHlu9pHwv5bX2AF5LUKpE3f4e3z/B3LcoK+IUMrkZ+RwrOMfvAqH/OoinB/EcJBp/yuHYBKjKsKZI46JodZGpB8fiLEqwqkQx0J/pCWShE2S3VIjlo1ky0JicIlRFp1u1gRrgTh3Efu7lEEUibMsOj169khwZolVxOD21ToJizgV0em5rj+sMJF1Ylk4+eeC7YdJnFnRaUX3vNwUndYogIn9zche5ImzwSxky2LnY/OeAuSxV9tyEFPEWvKdiN709G37Z9ygIFM4uBXZhxJRmMtVeaZv+9L2BbyjICXs24qMohAqcnNRbzHxreU3W6IgBYxqnj7kiPemvfFQb/fqp+8GM3Lo8yIp2MR7LWt4Jr42R3OVgtlIeZHzcIi30HK6lUWd0RzNKgVzcN6L9MKlAI3tZWy+1DnN0axTsLvo9cYdkxSk/nu4a5uv9EAfv4sGyUyiRxvBNAWarTaW3z5/qkstfiaZaYxowyiRzANd6QnJlDCsjWGGZG6pI7dIZgZj2jnkSWpCGSGpPM5qR1Egqduqxm2SKuCodgouSd1XRe6RlIusFoVBUjdUkRskZSCqJeQR9aFM3FJF4hpACvdVu6UA/KrVfF6biII4nrpqCyUIbU2TUqJEaO0hlJ52yBy8lEJzibAHI2SX3TSQ5JJAAiG/E8V4yA/StBRK6aE/RfTkQf8+Vyu+NG95sz/0c9zL8Hbezs58v2MjyHvqK6GD0K9LTopifJBl+nVJdJDEviAjB3QQiV1hAbvE1aKuMPExUrl/K5uQHyMrK0KSREKIssIKJHEWwTmIAhllpZ5gd5/LOcsHUerZT4siMfPKkuxeUT8t9vulOfg4lQ0WgiCO4V+NxBvZJq8FV1fQSLCWyFMQoiVizZ2XIERzx9pUT0GoNtW3iXv/L8gebnKjg5DEV1XNZGKxTEZVvyRkW3zCEBuCKIbV7ORbbIrxRK+e92QOfghi45yIXimrgEnnaqzeRVDHVx0wUfRKiihcQcFgyugfKsDIGZ2OkZt+kD2XTcjBlI3YPAM9DRTfR7JMjNhMLOBJZdNgB31AigWm7GFdWioK2CR92RPIHgIBJ6WDAyZ9q4PM35Oi+KwM2+AIpURIURai2kgBp1TFoppvzj9TiytpcM7hTP2VZqy0yH2hs0TFoKMwoZMRmJZsR2lwx+WMZCsQnwcKuKXCi8/WMnqqDa7JDf/K6DtCQ0AHD7RTvxPyDp9YW39/rI0qeCJ7d3ufPxOZNP0ceKPEmTS83fQDPNJOvULpqdA4+wyeyeCjFcICLIJHipwFyJ1FwjMDPGCcobRiw5bNN8E1zTyzZcUGc/waXHIdx5cv7FrlxS64oFvkrHKh6X9SA8fUTvDxjoOVmwBioQGOaBQQA84WciISotYC27Q0RCniaqVEa9g8hcZWSpzxYP4hYqEOJPUCsRxDr/nkyzcg4KacJ9Z8SObWgoh4rNValomoaceIGFzzvOm1HlpFk6PT8kX9tml0AbpG87Z+UT49QpPV0Po/WyJbQAsWuCUyj4SXl6Jbixv+bcRt/8biVnRpOeyzyU/OK/71Ifd2tQAAAABJRU5ErkJggg==";

const userInfo = localStorage.getItem("adminUserInfo") ? JSON.parse(localStorage.getItem("adminUserInfo")) : null;
/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
    const { redirect } = getPageQuery();
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
            pathname: '/user/login',
            search: stringify({
                redirect: window.location.href,
            }),
        });
    }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {

    const onMenuClick = useCallback(({ item, key, keyPath, domEvent }) => {
        if (key === 'logout') {
            loginOut();
            return;
        }
        history.push(`/account/${key}`);
    }, []);

    const loading = (
        <span className={`${styles.action} ${styles.account}`}>
            <Spin
                size="small"
                style={{
                    marginLeft: 8,
                    marginRight: 8,
                }}
            />
        </span>
    );

    if (!userInfo || !userInfo.nickName) {
        return loading;
    }

    const menuHeaderDropdown = (
        <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
            <Menu.Item key="logout">退出</Menu.Item>
        </Menu>
    );
    return (
        <HeaderDropdown overlayStyle={{ minWidth: '98px' }} placement="bottomCenter" arrow overlay={menuHeaderDropdown} trigger={['click']}>
            <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="large" className={styles.avatar} src={userInfo?.headImg || defaultAvatar} alt="avatar" />
                <span className={`${styles.name} anticon`}>{userInfo.nickName}</span>
                <CaretDownOutlined />
            </span>
        </HeaderDropdown>
    );
};

export default AvatarDropdown;
