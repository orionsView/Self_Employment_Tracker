import NavBar from "../components/NavBar"
import Header from "../components/Header"
import ClientSelector from "../components/ClientSelector"
import { useState } from "react"
import DateRangePicker from '../components/DateRangePicker'
import { BorderCard } from '../constants/ui'
import SubmitButton from "../components/SubmitButton"
function SearchLoggedJobsPage() {

    const borderStyle: string = BorderCard;
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
        <div className={`h-[40%] w-[100vw] flex flex-col justify-between items-center `}>
            <div className={`h-[100%] w-[80%] flex flex-col justify-evenly items-center ${borderStyle}`}>

                {/*Client Filter*/}
                <div className={`flex flex-col justify-between items-center w-[80%]`}>
                    <p>Sort By Client</p>
                    <ClientSelector setSelectedOptions={setSelectedOptions} selectMultiple={true} />
                </div>
                {/* DATE FILTER */}
                {/* <div className={`flex justify-between flex-col items-center w-[80%] ${borderStyle}`}> */}
                <DateRangePicker startDate={startDate} endDate={endDate} onChangeStart={setStartDate} onChangeEnd={setEndDate} />
                {/* </div> */}


                {/* <button className="bg-black text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Search</button> */}
                <SubmitButton text="Search" onClick={handleSubmit} />
            </div >
        </div>
    </>)
}

export default SearchLoggedJobsPage