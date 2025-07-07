import NavBar from "../components/NavBar"
import Header from "../components/Header"
import ClientSelector from "../components/ClientSelector"
function LoggedJobsPage() {

    return (<>
        <NavBar />
        <Header mainTitle="Logged Jobs" />
        <div className="h-[50%] w-[100vw] flex flex-col justify-between items-center">
            {/*Client Filter*/}
            <div className="flex flex-col justify-between items-center w-[80%] ">
                <p>Sort By Client</p>
                <ClientSelector />
            </div>
            {/* DATE FILTER */}
            <div className="flex justify-between flex-col items-center w-[80%] h-[40%] border-1 p-[1vh]">
                <div className="flex flex-row justify-between items-center w-[80%] ">
                    <p className="text-[4vw] text-nowrap">Date Start</p>
                    <input type="date" id="dateStart" />
                </div>
                <div className="flex flex-row justify-between items-center w-[80%] ">
                    <p className="text-[4vw] text-nowrap">Date End</p>
                    <input type="date" id="dateEnd" />
                </div>
                <p>OR</p>
                <div className="flex flex-row justify-between items-center w-[80%] ">
                    <p>Select All</p>
                    <input type="checkbox" />
                </div>
            </div>


            <button className="bg-black text-white font-bold py-2 px-4 rounded">Search</button>
        </div>
    </>)
}

export default LoggedJobsPage