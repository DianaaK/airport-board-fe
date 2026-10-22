import { Outlet } from 'react-router';

export function AppLayout() {
  return (
    <div className="app-layout">
      <header>
        <p className="eyebrow">AIRPORT FLIGHT BOARD</p>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
