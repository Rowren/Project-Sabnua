import React, { useEffect, useState } from 'react'
import useSabnuaStore from '../store/sabnuaStore'
import { currentUser } from '../api/auth'
import LoadingToRedirect from './LoadingToRedirect'

const ProtectRouteUser = ({ element }) => {

    const [ ok, setOk ] = useState(false)
    const user = useSabnuaStore((state) => state.user )
    const token = useSabnuaStore((state) => state.token )

    useEffect(()=> {
        if(user && token){
            // send to back
            currentUser(token) 
            .then((res) => setOk(true))
            .catch((err) => setOk(false))
        } 
    },[])
    return ok ? element: <LoadingToRedirect />
}

export default ProtectRouteUser
