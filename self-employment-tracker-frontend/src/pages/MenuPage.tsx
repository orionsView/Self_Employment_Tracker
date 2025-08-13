import NavBar from "../components/NavBar"
import Header from "../components/Header"
import { supabase } from '../supabaseClient'
import { useEffect, useState } from "react"
import { get } from "lodash"

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
    const [userName, setUserName]: any = useState<string>("");

    useEffect(() => {
        getUserName()
    }, [])

    async function getUserName() {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error('User not authenticated', userError);
            return;
        }
        setUserName(user.user_metadata.full_name)
    }


    return (
        <>
            <NavBar showMenu={false} />
            <Header mainTitle="Menu" subTitle={userName === "" ? "Hello!" : `Hello, ${userName}!`} />
            <div className="h-[50%] w-[100vw] flex flex-col justify-between items-center">
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