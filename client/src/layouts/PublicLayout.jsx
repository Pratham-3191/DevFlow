import { Outlet } from "react-router-dom";
import HomeHeader from '../components/HomeHeader'

function PublicLayout() {
    return (
        <>
            <HomeHeader />
            <Outlet />
        </>
    )
}

export default PublicLayout