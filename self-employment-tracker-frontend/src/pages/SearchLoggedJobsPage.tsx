import NavBar from "../components/NavBar"
import Header from "../components/Header"
import ClientSelector from "../components/ClientSelector"
import { useState } from "react"
function SearchLoggedJobsPage() {

    const borderStyle: string = "border-1 p-[1vh] rounded-lg shadow-lg";
    const [selectedOptions, setSelectedOptions]: any = useState([]);
    const [startDate, setStartDate]: any = useState(null);
    const [endDate, setEndDate]: any = useState(null);


    function handleSubmit() {
        localStorage.setItem("selectedClients", JSON.stringify(selectedOptions));
        localStorage.setItem("startDate", startDate);
        localStorage.setItem("endDate", endDate);

        window.location.href = "/logged/view";
        console.log("Submitted");
    }


    return (<>
        <NavBar />
        <Header mainTitle="Search Logs" />
        <div className="h-[50%] w-[100vw] flex flex-col justify-between items-center">
            {/*Client Filter*/}
            <div className={`flex flex-col justify-between items-center w-[80%] ${borderStyle}`}>
                <p>Sort By Client</p>
                <ClientSelector setSelectedOptions={setSelectedOptions} selectMultiple={true} />
            </div>
            {/* DATE FILTER */}
            <div className={`flex justify-between flex-col items-center w-[80%] h-[40%] ${borderStyle}`}>
                <div className="flex flex-row justify-between items-center w-[80%] ">
                    <p className="text-[4vw] text-nowrap">Date Start</p>
                    <input type="date" id="dateStart" onChange={(event) => setStartDate(event.target.value)} />
                </div>
                <div className="flex flex-row justify-between items-center w-[80%] ">
                    <p className="text-[4vw] text-nowrap">Date End</p>
                    <input type="date" id="dateEnd" onChange={(event) => setEndDate(event.target.value)} />
                </div>
            </div>


            <button className="bg-black text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Search</button>
        </div >
    </>)
}

export default SearchLoggedJobsPage