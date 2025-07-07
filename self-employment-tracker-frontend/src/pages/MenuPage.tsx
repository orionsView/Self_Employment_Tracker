import NavBar from "../components/NavBar"
import Header from "../components/Header"
function Menu() {
    const linkClassName: string = "text-[5vw] italic color-black"
    return (
        <>
            <NavBar />
            <Header mainTitle="Menu" />
            <div className="h-[50%] w-[100vw] flex flex-col justify-between items-center">
                <a href="/login" className={linkClassName}>Login</a>
                <a href="/settings" className={linkClassName}>Settings</a>
                <a href="/dataInput" className={linkClassName}>Input Jobs</a>
                <a href="/trends" className={linkClassName}>Trends</a>
                <a href="/logged" className={linkClassName}>Logged Data</a>
                <a href="/logout" className={linkClassName}>Logout</a>
            </div>
        </>
    )
}

export default Menu