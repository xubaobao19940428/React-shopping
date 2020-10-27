// src/access.ts
export default function (initialState: { currentUser?: API.CurrentUser | undefined }) {
    const { currentUser } = initialState || {};
    const permissionKeyMap = currentUser?.permissionKeyMap ? currentUser?.permissionKeyMap : {};
    return {
        ...permissionKeyMap
    };
}
