import { useState, useCallback } from 'react';
import { getPermissionKeys } from '@/services/staff';

export default () => {
    const [userInfo, setUserInfo] = useState(null);
    const [permission, setPermission] = useState();

    // 查询用户信息
    const queryUserInfo = useCallback(() => {
        const infoStr = localStorage.getItem('userInfo');
        const uInfo = infoStr ? JSON.parse(infoStr) : null;

        setUserInfo(uInfo);
    }, []);

    // 查询用户权限信息
    const queryUserPermission = useCallback(() => {
        getPermissionKeys({}).then(res => {
            if (res.ret.errcode == 1) {
                setPermission(res.permissionKeyMap);
            }
        });
    }, []);

    return { userInfo, queryUserInfo, permission, queryUserPermission };
};