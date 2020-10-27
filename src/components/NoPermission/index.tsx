import React from "react";
import './index.less'

const NoPermission: React.FC<{}> = () => {
    return (
        <div className="noPermission">你没有当前页面的权限访问，请联系管理员开通</div>
    )
}
export default NoPermission;
