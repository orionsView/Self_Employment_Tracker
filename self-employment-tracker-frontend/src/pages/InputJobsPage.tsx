import Header from "../components/Header"
import NavBar from "../components/NavBar"
import ClientSelector from "../components/ClientSelector"
import { useState } from "react"
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import TextInputField from "../components/TextInputField";
import type { style } from "../components/TextInputField";
import { InputBase, BorderCard, LabelText } from '../constants/ui'

type input = {
    clientId: string,
    newClientName: string,
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
    mapLink: string
}

function InputJobsPage() {
    const [inputData, setInputData] = useState<input>({
        clientId: "",
        newClientName: "",
        startDate: "",
        endDate: "",
        job: "",
        hours: 0,
        earnings: 0,
        expenses: 0,
        trips: [],
    });
    const [numberOfTrips, setNumberOfTrips]: any = useState(0);
    const borderStyle: string = BorderCard;

    const [submitProcessing, setSubmitProcessing]: any = useState(false);

    async function handleSubmit() {
        if (submitProcessing) {
            return;
        }
        setSubmitProcessing(true);

        // Get current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error('User not authenticated', userError);
            alert('User not authenticated');
            setSubmitProcessing(false);
            return;
        }

        const newClientId = uuidv4();
        if (inputData.newClientName !== "") {
            setInputData({ ...inputData, clientId: newClientId });
            const names = inputData.newClientName.split(" ");
            const firstName = names[0];
            const lastName = names.slice(1).join(" ");
            const { error: clientError } = await supabase.from('Client').insert({
                ID: newClientId,
                FirstName: firstName,
                LastName: lastName,
                UserID: user.id
            });
            if (clientError) {
                console.error('Client insert failed:', clientError);
                alert('Client insert failed');
                setSubmitProcessing(false);
                return;
            }
        }

        const jobId = uuidv4();

        // Insert job
        const { error: jobError } = await supabase.from('Job').insert({
            ID: jobId,
            UserID: user.id,
            TimeEntered: new Date().toISOString(),
            ClientID: inputData.clientId || newClientId,
            HoursWorked: inputData.hours,
            HasBeenEdited: false,
        });

        if (jobError) {
            console.log('inserting job', inputData);
            console.error('Job insert failed:', jobError);
            alert('Job insert failed');
            setSubmitProcessing(false);
            return;
        }

        // Insert trips
        const tripInserts = await Promise.all(inputData.trips.map(async (trip) => {
            if (trip.distance) {
                return {
                    ID: uuidv4(),
                    JobID: jobId,
                    Distance: trip.distance,
                    GasPrice: trip.gasPrice ?? 0,
                };
            } else if (trip.mapLink) {
                const { distance, source, destination } = await getTripDistanceFromShortLink(trip.mapLink);
                return {
                    ID: uuidv4(),
                    JobID: jobId,
                    Distance: distance,
                    GasPrice: trip.gasPrice ?? 0,
                    Src: source,
                    Dst: destination
                };
            }
        }));

        const { error: tripError } = await supabase.from('Trip').insert(tripInserts);
        if (tripError) {
            console.error('Trip insert failed:', tripError);
            console.log('Trip insert failed with:', tripInserts);
            alert('Trip insert failed');
            setSubmitProcessing(false);
            return;
        }

        const paymentId = uuidv4();
        const expenseId = uuidv4();
        const defaultPaymentMethod = 'Cash';
        const { data, error } = await supabase
            .from('PaymentMethod')
            .select('ID')
            .eq('Method', defaultPaymentMethod)

        if (error) {
            console.error('Error fetching payment method ID:', error)
            alert('Error fetching payment method ID');
            setSubmitProcessing(false);
        } else { // got payment method id
            const deafultPaymentMethodId = data[0].ID;
            const { error: paymentError } = await supabase.from('Payment').insert({
                ID: paymentId,
                JobID: jobId,
                Amount: inputData.earnings,
                TimePayed: new Date().toISOString(),
                MethodID: deafultPaymentMethodId,
            });

            if (paymentError) {
                console.error('Payment insert failed:', paymentError);
                alert('Payment insert failed');
                setSubmitProcessing(false);
                return;
            }

            // Insert expense
            const { error: expenseError } = await supabase.from('Expense').insert({
                ID: expenseId,
                JobID: jobId,
                Amount: inputData.expenses,
                TimePayed: new Date().toISOString(),
                MethodID: deafultPaymentMethodId,
                Description: 'Auto-entered', // you can customize this
            });

            if (expenseError) {
                console.error('Expense insert failed:', expenseError);
                alert('Expense insert failed');
                setSubmitProcessing(false);
                return;
            }
        }
        console.log('Job, trips, payment, and expense created successfully!');
        window.location.href = "/menu";
        alert('Job, trips, payment, and expense created successfully!');
        setSubmitProcessing(false);
    }

    async function getTripDistanceFromShortLink(shortLink: string) {
        console.log(`getting trip distance from short link: ${shortLink}`);

        // const longLink = await getLongUrl(shortLink);

        const longLink = await getLongLinkFromShortLink(shortLink);

        const { source, destination } = parseGoogleMapsUrl(longLink);

        console.log(`source: ${source}`);
        console.log(`destination: ${destination}`);


        const distance = await getDistanceFromLocations(source || "", destination || "");
        console.log(`distance: ${distance}`);
        return { distance, source, destination };
    }
    function parseGoogleMapsUrl(url: string) {
        const regex = /\/maps\/dir\/([^/]+)\/([^/?#]+)/;
        const match = url.match(regex);

        if (!match || match.length < 3) {
            return { error: "Unable to parse source and destination" };
        }

        const source = decodeURIComponent(match[1]);
        const destination = decodeURIComponent(match[2]);

        return { source, destination };
    }

    async function getLongLinkFromShortLink(shortLink: string) {
        const backendUrl = import.meta.env.VITE_BACKEND_URL
        const urlToFetch = `${backendUrl}/shortlinkToLonglink?shortLink=${shortLink}`

        const response = await fetch(urlToFetch);
        const jsonResponse = await response.json();

        const longUrl = jsonResponse.longUrl

        console.log(`longUrl: ${longUrl}`);

        return longUrl;
    }



    async function getDistanceFromLocations(dest: string, src: string) {

        const backendUrl = import.meta.env.VITE_BACKEND_URL

        const url = `${backendUrl}/distance?start=${src}&end=${dest}`;

        const response = await fetch(url);
        const data = await response.json();

        // Return distance in meters
        return data.routes[0].legs[0].distance.value;
    }

    const inputTextStyle: style = {
        ContainerStyle: "flex flex-row justify-between items-center w-[100%] ",
        InputStyle: InputBase,
        LabelStyle: LabelText
    }



    return (
        <>
            <NavBar />
            <Header mainTitle="Input Jobs" subTitle="Input your job information here" />
            <div className="h-[60%] w-[100%] flex flex-col justify-between items-center">
                {/*Client Filter*/}
                <div className={`flex flex-col justify-between items-center w-[80%] ${borderStyle}`}>
                    <p>Use Existing Client</p>
                    <ClientSelector setSelectedOptions={(event) => { setInputData({ ...inputData, clientId: event.value.id }) }} selectMultiple={false} />
                    <p className="text-[4vw] text-nowrap">OR</p>
                    <TextInputField
                        Label="Add New Client"
                        Type="text"
                        onChange={(event) => { setInputData({ ...inputData, newClientName: event.target.value }) }}
                        Placeholder="Enter client name"
                        Style={inputTextStyle}
                        currentValue={inputData.newClientName}
                        setValidity={() => { }}
                        validationRegex={/ /}
                        warningMessage=" "
                        onEnter={() => { }}
                    />
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
                        <input type="number" id="hoursWorked" onChange={(event) => {
                            const numTrips = parseInt(event.target.value);
                            if (numTrips > 0 && numTrips < 30) { setNumberOfTrips(numTrips); }
                        }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
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
                                        ...updatedTrips[i],
                                        distance: parseFloat(event.target.value)
                                    };
                                    setInputData({ ...inputData, trips: updatedTrips });
                                }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                            </div>

                            <p className="font-bold">OR</p>

                            {/* Map Link */}
                            <div className="flex flex-row justify-between items-center w-[80%] ">
                                <p className="text-[4vw] text-nowrap">Map Link</p>
                                <input type="text" id={`trip${i}`} onChange={(event) => {
                                    const updatedTrips = [...inputData.trips]; // copy array
                                    updatedTrips[i] = {
                                        ...updatedTrips[i],
                                        mapLink: event.target.value
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
                    {submitProcessing ? "Submitting..." : "Submit"}
                </button>
            </div>
        </>
    )
}

export default InputJobsPage