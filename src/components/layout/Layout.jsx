import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Toast from '../ui/Toast';
import RateModal from '../modals/RateModal';
import DetailModal from '../modals/DetailModal';
import BannerModal from '../modals/BannerModal';
import AddUserModal from '../modals/AddUserModal';
import EditUserModal from '../modals/EditUserModal';
import AddMovieModal from '../modals/AddMovieModal';
import useAppStore from '../../store/useAppStore';

export default function Layout() {
  const activeModal = useAppStore(s => s.activeModal);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>

      {activeModal?.type === 'rate'     && <RateModal />}
      {activeModal?.type === 'detail'   && <DetailModal />}
      {activeModal?.type === 'banner'   && <BannerModal />}
      {activeModal?.type === 'addUser'  && <AddUserModal />}
      {activeModal?.type === 'editUser' && <EditUserModal />}
      {activeModal?.type === 'addMovie' && <AddMovieModal />}

      <Toast />
    </div>
  );
}
