import { Header } from "@widgets/header";
import { SiderBar } from "@widgets/sidebar";
import { Outlet } from 'react-router-dom';

export const Layout = () => {
    return (
        <div>
            <Header />
            <div style={{display: "flex", maxWidth: '1200px', margin: 0}}>
                <SiderBar />
                <main style={{flex: 1, marginLeft: '20px'}}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};