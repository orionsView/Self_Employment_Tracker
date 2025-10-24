import NavBar from "../components/NavBar"
import Header from "../components/Header"
import { supabase } from '../supabaseClient'
import { useEffect, useState } from "react"
import { BorderCard } from "../constants/ui"

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

    const linkClassName: string = "text-[5vw] italic p-8 text-nowrap";
    const [userName, setUserName]: any = useState<string>("");

    useEffect(() => {
        getUserName()
        // setColorSceheme();
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

    // async function setColorSceheme() {
    //     const storedTheme = localStorage.getItem("UserSettings");
    //     if (storedTheme) {
    //         const settings = JSON.parse(storedTheme);
    //         console.log("settings.darkMode: ", settings.darkMode);
    //         if (settings.darkMode === "useSystem") {
    //             if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //                 document.documentElement.classList.add('dark');
    //             } else {
    //                 document.documentElement.classList.remove('dark');
    //             }
    //         } else if (settings.darkMode === "true") {
    //             document.documentElement.classList.add('dark');
    //         } else if (settings.darkMode === "false") {
    //             document.documentElement.classList.remove('dark');
    //         }
    //     }
    // }




    return (
        <>
            <NavBar showMenu={false} />
            <Header mainTitle="Menu" subTitle={userName === "" || userName === undefined ? "Hello!" : `Hello, ${userName}!`} />
            <div className="h-[50%] w-[100vw] flex flex-col justify-between items-center">
                <div className={`${BorderCard} `}>
                    <a href="/log" className={linkClassName}>New Job</a>
                    <a href="/logged/search" className={linkClassName}>Logged Jobs</a>
                    <a href="/trends" className={linkClassName}>Trends</a>
                    <a href="export" className={linkClassName}>Export</a>
                    {/* <a href="/settings" className={linkClassName}>Settings</a> */}
                    <a href="/tutorial" className={linkClassName}>Tutorial</a>
                    <p onClick={handleLogout} className={linkClassName}>Logout</p>
                </div>
            </div>
        </>
    )
}

export default Menu