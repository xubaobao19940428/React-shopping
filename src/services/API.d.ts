declare namespace API {
    export interface CurrentUser {
        id?: string;
        token?: string;
        ret: {
            errcode: number;
            errname: "SUCCESS" | "ERROR";
            msg: string
        };
        permissionKeyMap: any;
        account: string;
        email: string;
        groupId: number;
        headImg: string;
        mobile: string;
        nickName: string;
    }
}
