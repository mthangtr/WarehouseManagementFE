import React, { useEffect } from 'react';
import { useWebSocket } from './WebSocketProvider';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const NotificationListener = () => {
    const { subscribeToWarehouse } = useWebSocket();
    const userInfo = useSelector((state) => state.auth);

    const wid = userInfo?.userInfo?.data?.warehouseId;

    useEffect(() => {
        if (!wid) {
            return;
        }

        const subscription = subscribeToWarehouse(wid, (message) => {
            const notification = JSON.parse(message.body);
            toast.info(notification.message);
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [wid, subscribeToWarehouse]);

    return null;
};

export default NotificationListener;
