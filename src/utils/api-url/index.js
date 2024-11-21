const qs = require('qs');

export const baseUrl = `http://192.168.0.11:3009`;
export const ChatUrl = `http://192.168.0.11:3002`;

// export const Api = {
//     baseurl: (headPoint, params) =>
//         `${baseUrl}/${headPoint}${params ? `?${qs.stringify(params)}` : ""}`,
// }; 

export const Api = {
    baseurl: (headPoint, params) => {
        const port = headPoint.includes("conversation") ? 3002 : 3009;

        const baseUrl = `http://192.168.0.11:${port}`;

        return `${baseUrl}/${headPoint}${params ? `?${qs.stringify(params)}` : ""}`;
    },
};