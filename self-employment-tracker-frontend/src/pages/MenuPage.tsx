import NavBar from "../components/NavBar"
import Header from "../components/Header"
import { supabase } from '../supabaseClient'

function Menu() {
    async function handleLogout() {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('Error logging out:', error.message)
        } else {
            console.log('User logged out successfully')
        }
        localStorage.clear()
        window.location.href = "/login"
    }

    const linkClassName: string = "text-[5vw] italic color-black"
    return (
        <>
            <NavBar />
            <Header mainTitle="Menu" />
            <div className="h-[50%] w-[100vw] flex flex-col justify-between items-center">
                <a href="/login" className={linkClassName}>Login</a>
                <a href="/settings" className={linkClassName}>Settings</a>
                <a href="/log" className={linkClassName}>Input Jobs</a>
                <a href="/trends" className={linkClassName}>Trends</a>
                <a href="/logged/search" className={linkClassName}>Logged Data</a>
                <p onClick={handleLogout} className={linkClassName}>Logout</p>
            </div>
        </>
    )
}

export default Menu