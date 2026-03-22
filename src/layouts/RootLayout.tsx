import {  Outlet } from 'react-router-dom';
import { Navigator } from '../components/Navigator';

export default function RootLayout() {
  return (
    <div>
      <Navigator />
      <main>
        <Outlet />
      </main>
    </div>
  );
}