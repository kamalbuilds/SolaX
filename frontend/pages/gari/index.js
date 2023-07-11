import react from 'react';
import Login from '../../components/Login';
import Sidebar from '../../components/sidebar';

export default function Home() {
    return (
<div>
      <div className="flex min-h-screen ">
        <Sidebar />

        <main className="flex flex-1 flex-col p-5">
        <h1>GARI</h1>
            <Login />
        </main>
      </div>
    </div>

    )
}
