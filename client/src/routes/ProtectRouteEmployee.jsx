import React, { useEffect, useState } from 'react'
import useSabnuaStore from '../store/sabnuaStore'
import { currentEmployee } from '../api/auth'  // สมมติว่า API ที่ตรวจสอบ employee
import LoadingToRedirect from './LoadingToRedirect'

const ProtectRouteEmployee = ({ element }) => {

    const [ok, setOk] = useState(false)
    const user = useSabnuaStore((state) => state.user)
    const token = useSabnuaStore((state) => state.token)

    useEffect(() => {
        if (user && token) {
            // ส่ง token ไปตรวจสอบว่าเป็น employee หรือไม่
            currentEmployee(token)
                .then((res) => setOk(true))  // ถ้าเป็น employee ก็ให้ set ok เป็น true
                .catch((err) => setOk(false))  // ถ้าไม่ใช่ employee จะ set ok เป็น false
        }
    }, [user, token])  // เพิ่ม user และ token เป็น dependency เพื่อให้ useEffect ทำงานเมื่อข้อมูลเปลี่ยน

    return ok ? element : <LoadingToRedirect />
}

export default ProtectRouteEmployee
