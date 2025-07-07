import NavBar from "../components/NavBar"
import Header from "../components/Header"
function LoggedJobsPage() {
    return (<>
        <NavBar />
        <Header mainTitle="Logged Jobs" />
        <div className="h-[60%] w-[100vw] flex flex-col justify-between items-center">
            {/* DATE FILTER */}
            <div className="flex justify-between flex-col items-center w-[80%] h-[30%] border-1 p-2">
                <div className="flex flex-row justify-between items-center w-[80%] ">
                    <p>Date Start</p>
                    <input type="date" />
                </div>
                <div className="flex flex-row justify-between items-center w-[80%] ">
                    <p>Date End</p>
                    <input type="date" />
                </div>
                <p>OR</p>
                <div className="flex flex-row justify-between items-center w-[80%] ">
                    <p>Select All</p>
                    <input type="checkbox" />
                </div>
            </div>

            {/*  */}
            <button className="bg-black text-white font-bold py-2 px-4 rounded">Search</button>
        </div>
    </>)
}

export default LoggedJobsPage