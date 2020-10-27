import styles from './index.less';
import { history, useAccess, Access, Redirect } from 'umi';
import routes from "../../../routes";
import { getCurRouteInfo } from '@/utils/utils'
import NoPermission from "@/components/NoPermission";

/**
 * 容器组件
 * @param {*} props react props
 */
const ViewContainer = (props) => {
    const curRouter = getCurRouteInfo(routes, history.location.pathname)
    const access = useAccess()
    // const isLogin = localStorage.adminToken ? true : false
    const isLogin = true
    return (
        <div className={styles.viewContainer} id="viewContainer">
            {props.title && <div className={styles.title}>{props.title}</div>}
            {
                !isLogin && location.pathname != '/login' ? (<Redirect to="/login" />) : <Access
                    // accessible={ curRouter.noPermission ? true : access[curRouter.access]}
                    accessible={ true}
                    fallback={<NoPermission />}
                >
                    {props.children}
                </Access>
            }
        </div>
    )
}

export default ViewContainer;
