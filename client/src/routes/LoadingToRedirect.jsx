import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoadingToRedirect = () => {
    const [count, setCount] = useState(3);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => {
                if (currentCount === 1) {
                    clearInterval(interval);
                    navigate('/'); // Redirect to home page
                }
                return currentCount - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    useEffect(() => {
        toast.info(`ไม่มีสิทธิ์เข้าถึง กำลังเปลี่ยนหน้าในอีก ${count} วินาที...`, {
            position: "top-center",
            autoClose: count * 1000,
            hideProgressBar: false,
            closeOnClick: false,
            draggable: false,
            pauseOnHover: false,
        });
    }, [count]);

    return (
        <>
            <ToastContainer />
        </>
    );
};

export default LoadingToRedirect;
