import { Outlet } from "react-router-dom"
import DashboardHeader from '../components/DashboardHeader'

function DashboardLayout() {
    return (
        <>
            <DashboardHeader />
            <Outlet />
        </>
    )
}

export default DashboardLayout