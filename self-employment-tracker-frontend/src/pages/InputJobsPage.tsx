import Header from "../components/Header"
import NavBar from "../components/NavBar"
import ClientSelector from "../components/ClientSelector"
import { useState } from "react"

type input = {
    clients: string,
    startDate: string,
    endDate: string,
    job: string,
    hours: number,
    earnings: number
    expenses: number
    trips: trip[]
}

type trip = {
    start: string,
    end: string,
    distance: number,
    carId: string,
    gasPrice: number
}
function InputJobsPage() {
    const [inputData, setInputData] = useState<input>({
        clients: "",
        startDate: "",
        endDate: "",
        job: "",
        hours: 0,
        earnings: 0,
        expenses: 0,
        trips: [],
    });
    const [numberOfTrips, setNumberOfTrips]: any = useState(0);
    const borderStyle: string = "border-1 p-[1vh] rounded-lg shadow-lg";

    function handleSubmit() {
        console.log(inputData);
    }




    return (
        <>
            <NavBar />
            <Header mainTitle="Input Jobs" subTitle="Input your job information here" />
            <div className="h-[60%] w-[100%] flex flex-col justify-between items-center">
                {/*Client Filter*/}
                <div className={`flex flex-col justify-between items-center w-[80%] ${borderStyle}`}>
                    <p>Sort By Client</p>
                    <ClientSelector setSelectedOptions={(event) => { setInputData({ ...inputData, clients: event }) }} selectMultiple={false} />
                </div>
                {/* DATE FILTER */}
                <div className={`flex justify-between flex-col items-center w-[80%] h-[15%] ${borderStyle}`}>
                    <div className="flex flex-row justify-between items-center w-[80%] ">
                        <p className="text-[4vw] text-nowrap">Date Start</p>
                        <input type="date" id="dateStart" onChange={(event) => { setInputData({ ...inputData, startDate: event.target.value }) }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                    </div>
                    <div className="flex flex-row justify-between items-center w-[80%] ">
                        <p className="text-[4vw] text-nowrap">Date End</p>
                        <input type="date" id="dateEnd" onChange={(event) => { setInputData({ ...inputData, endDate: event.target.value }) }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                    </div>

                </div>
                {/* Earnings */}
                <div className={`flex justify-center flex-col items-center w-[80%] h-[10%] ${borderStyle}`}>
                    <div className="flex flex-row justify-between items-center w-[80%] ">
                        <p className="text-[4vw] text-nowrap">Earnings</p>
                        <input type="number" id="hoursWorked" onChange={(event) => { setInputData({ ...inputData, earnings: parseFloat(event.target.value) }) }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                    </div>
                </div>
                {/* Hrs Worked */}
                <div className={`flex justify-center flex-col items-center w-[80%] h-[10%] ${borderStyle}`}>
                    <div className="flex flex-row justify-between items-center w-[80%] ">
                        <p className="text-[4vw] text-nowrap">Hours</p>
                        <input type="number" id="hoursWorked" onChange={(event) => { setInputData({ ...inputData, hours: parseFloat(event.target.value) }) }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                    </div>

                </div>
                {/* Expenses */}
                <div className={`flex justify-center flex-col items-center w-[80%] h-[10%] ${borderStyle}`}>
                    <div className="flex flex-row justify-between items-center w-[80%] ">
                        <p className="text-[4vw] text-nowrap">Expenses</p>
                        <input type="number" id="expenses" onChange={(event) => { setInputData({ ...inputData, expenses: parseFloat(event.target.value) }) }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                    </div>
                </div>


                {/* Trips */}
                <div className={`flex justify-center flex-col items-center w-[80%] h-[10%] ${borderStyle}`}>
                    <div className="flex flex-row justify-between items-center w-[80%] ">
                        <p className="text-[4vw] text-nowrap">Trips</p>
                        <input type="number" id="hoursWorked" onChange={(event) => { setNumberOfTrips(event.target.value); }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                    </div>
                </div>
            </div>


            {/* Dynamic Trip Inputs */}
            <div className=" w-[100%] flex flex-col justify-between items-center flex-grow">
                {Array.from({ length: numberOfTrips }, (_, i) => (
                    <div key={i} className={`mt-4 flex justify-center flex-col items-center w-[80%]  ${borderStyle}`}>
                        <p className="text-[4vw] text-nowrap">Trip {i + 1}</p>
                        <div className={`flex flex-col justify-between items-center w-[100%] ${borderStyle}`}>
                            {/* Start */}
                            <div className="flex flex-row justify-between items-center w-[80%] ">
                                <p className="text-[4vw] text-nowrap">Start

                                </p>
                                <input type="text" id={`trip${i}`} onChange={(event) => {
                                    const updatedTrips = [...inputData.trips]; // copy array
                                    updatedTrips[i] = {
                                        ...updatedTrips[i],         // copy existing trip
                                        start: event.target.value // or whichever field you're updating
                                    };
                                    setInputData({ ...inputData, trips: updatedTrips });
                                }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                            </div>
                            {/* End */}
                            <div className="flex flex-row justify-between items-center w-[80%] ">
                                <p className="text-[4vw] text-nowrap">End</p>
                                <input type="text" id={`trip${i}`} onChange={(event) => {
                                    const updatedTrips = [...inputData.trips]; // copy array
                                    updatedTrips[i] = {
                                        ...updatedTrips[i],         // copy existing trip
                                        end: event.target.value // or whichever field you're updating
                                    };
                                    setInputData({ ...inputData, trips: updatedTrips });
                                }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                            </div>

                            <p className="font-bold">OR</p>


                            {/* Distance */}
                            <div className="flex flex-row justify-between items-center w-[80%] ">
                                <p className="text-[4vw] text-nowrap">Distance</p>
                                <input type="text" id={`trip${i}`} onChange={(event) => {
                                    const updatedTrips = [...inputData.trips]; // copy array
                                    updatedTrips[i] = {
                                        ...updatedTrips[i],         // copy existing trip
                                        distance: parseFloat(event.target.value) // or whichever field you're updating
                                    };
                                    setInputData({ ...inputData, trips: updatedTrips });
                                }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                            </div>
                        </div>

                        {/* Gas Price */}

                        <div className="flex flex-row justify-between items-center w-[80%] mt-4" >
                            <p className="text-[4vw] text-nowrap">Gas Price</p>
                            <input type="text" id="gasPrice" onChange={(event) => {
                                const updatedTrips = [...inputData.trips]; // copy array
                                updatedTrips[i] = {
                                    ...updatedTrips[i],         // copy existing trip
                                    gasPrice: parseFloat(event.target.value) // or whichever field you're updating
                                };
                                setInputData({ ...inputData, trips: updatedTrips });
                            }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                        </div>
                    </div >
                ))
                }
            </div >

            {/* Submit Button */}
            <div className="flex justify-center items-center  h-[10%]">
                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Submit
                </button>
            </div>
        </>
    )
}

export default InputJobsPage