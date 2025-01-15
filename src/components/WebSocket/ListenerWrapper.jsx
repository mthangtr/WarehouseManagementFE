import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationListener from '../../components/WebSocket/NotificationListener';

function ListenerWrapper({ children }) {
    return (
        <>
            <NotificationListener />
            <ToastContainer
                autoClose={8000}
                hideProgressBar={true}
                closeOnClick
                pauseOnHover
            />
            {children}
        </>
    );
}

export default ListenerWrapper;