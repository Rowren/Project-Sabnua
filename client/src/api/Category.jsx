import axios from "axios";




export const createCategory = async (token, from) => {

    return await axios.post('http://localhost:5004/api/category', from, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

}

export const listCategory = async (token) => {

    return await axios.get('http://localhost:5004/api/category', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

}
export const removeCategory = async (token, id) => {

    return await axios.delete('http://localhost:5004/api/category/' + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

}