import { Api } from "../api-url"

const toUrlEncoded = (obj) =>
    Object.keys(obj)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
        .join('&')

export const makeRequest = async (
    method,
    url,
    queryParams = {},
    authToken,
    bodyRequest = null,
    isFormData = false,
) => {
    const requestOptions = {
        method: method,
        headers: {
            ...(isFormData ? {} : { 'Content-Type': "application/x-www-form-urlencoded" }),
            ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        ...(bodyRequest && method.toLowerCase() !== "get" ? { body: isFormData ? bodyRequest : toUrlEncoded(bodyRequest) } : {})
    }
    const headpoint = Api.baseurl(url, queryParams)      
    
    try {
        const Response = await fetch(headpoint, requestOptions)
        if (!Response.ok) {
            throw new Error(`Request failed with status ${Response.status}`)
        }
        const ResponseData = await Response.json()    
        return ResponseData
    } catch (error) {
        console.error(error)
    }
}