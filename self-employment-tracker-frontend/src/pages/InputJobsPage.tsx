import Header from "../components/Header"
import NavBar from "../components/NavBar"
import ClientSelector from "../components/ClientSelector"
import { useState, useEffect } from "react"
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import TextInputField from "../components/TextInputField";
import type { style } from "../components/TextInputField";
import { InputBase, BorderCard, LabelText } from '../constants/ui'
import SubmitButton from "../components/SubmitButton";
import MapInputField from "../components/MapInputField";


type input = {
    clientId: string,
    newClientName: string,
    jobName: string,
    startDate: string,
    endDate: string,
    job: string,
    hours: number,
    earnings: earning[]
    expenses: expense[]
    trips: trip[]
}

type LatLng = [number, number] | null;
type trip = {
    distance: number,
    carId: string,
    gasPrice: number,
    src: LatLng,
    dest: LatLng
}

type expense = {
    amount: number,
    methodId: string,
    date: string,
    desc: string
}

type earning = {
    amount: number,
    methodId: string,
    date: string,
}

function InputJobsPage() {
    const [inputData, setInputData] = useState<input>({
        clientId: "",
        newClientName: "",
        jobName: "",
        startDate: "",
        endDate: "",
        job: "",
        hours: 0,
        earnings: [],
        expenses: [],
        trips: [],
    });
    const [numberOfEarnings, setNumberOfEarnings]: any = useState(0);
    const [numberOfTrips, setNumberOfTrips]: any = useState(0);
    const [numberOfExpenses, setNumberOfExpenses]: any = useState(0);
    const borderStyle: string = "p-[1vh] flex flex-col items-center w-[90vw] justify-between mb-4 ";


    const [paymentMethods, setPaymentMethods]: any = useState([]);

    const [submitProcessing, setSubmitProcessing]: any = useState(false);


    const [addingNewClient, setAddingNewClient]: any = useState(false);
    const [validNewClient, setValidNewClient]: any = useState(false);

    async function handleSubmit() {
        console.log("submitting: ", addingNewClient, validNewClient);
        if (submitProcessing) {
            return;
        }
        setSubmitProcessing(true);

        if (addingNewClient && !validNewClient) {
            setSubmitProcessing(false);
            alert('Make sure you have filled out all required fields correctly');
            return;
        }

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
        const jobId = uuidv4();


        if (inputData.clientId === "add_new_client") {
            // // Defensive check: ensure the new client name is valid before inserting
            // const nameIsValid = /^(?!\s*$)[a-zA-Z\s.'-]+$/.test(inputData.newClientName);
            // if (!nameIsValid) {
            //     setSubmitProcessing(false);
            //     alert('New client name is invalid');
            //     return;
            // }

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
            console.log('inserting client', inputData);
            if (clientError) {
                console.error('Client insert failed:', clientError);
                alert('Client insert failed');
                setSubmitProcessing(false);
                return;
            }
        }

        // Use a local clientId variable because `setInputData` is asynchronous
        // and `inputData.clientId` may still be the sentinel "add_new_client".
        const clientIdToUse = inputData.clientId === "add_new_client" ? newClientId : (inputData.clientId || newClientId);


        // Insert job
        const { error: jobError } = await supabase.from('Job').insert({
            ID: jobId,
            UserID: user.id,
            TimeEntered: new Date().toISOString(),
            ClientID: clientIdToUse,
            HoursWorked: inputData.hours,
            HasBeenEdited: false,
            JobName: inputData.jobName || "Untitled Job"
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
            } else if (trip.src && trip.dest) {
                const backendUrl = import.meta.env.VITE_BACKEND_URL
                const { distance } = await fetch(`${backendUrl}/getDistanceFromCoordinates?start=${trip.src}&end=${trip.dest}`).then((res) => res.json());


                return {
                    ID: uuidv4(),
                    JobID: jobId,
                    Distance: distance,
                    GasPrice: trip.gasPrice ?? 0,
                    Src: trip.src,
                    Dst: trip.dest
                };

            }
            // } else if (trip.mapLink) {
            //     const { distance, source, destination } = await getTripDistanceFromShortLink(trip.mapLink);
            //     return {
            //         ID: uuidv4(),
            //         JobID: jobId,
            //         Distance: distance,
            //         GasPrice: trip.gasPrice ?? 0,
            //         Src: source,
            //         Dst: destination
            //     };
            // }
        }));

        const { error: tripError } = await supabase.from('Trip').insert(tripInserts);
        if (tripError) {
            console.error('Trip insert failed:', tripError);
            console.log('Trip insert failed with:', tripInserts);
            alert('Trip insert failed');
            setSubmitProcessing(false);
            return;
        }

        const defaultPaymentMethod = 'Cash';
        const { data, error } = await supabase
            .from('PaymentMethod')
            .select('ID')
            .eq('Method', defaultPaymentMethod)

        if (error) {
            console.error('Error fetching payment method ID:', error)
            alert('Error fetching payment method ID');
            setSubmitProcessing(false);
            return;
        }

        // determine a default payment method id to use when entries don't specify one
        let deafultPaymentMethodId: string | null = null;
        if (data && data.length > 0) {
            deafultPaymentMethodId = data[0].ID;
        } else if ((paymentMethods || []).length > 0) {
            deafultPaymentMethodId = paymentMethods[0].ID;
        }

        if (!deafultPaymentMethodId) {
            console.error('No payment methods available to assign to payments/expenses');
            alert('No payment methods available. Please create one in settings first.');
            setSubmitProcessing(false);
            return;
        }
        // Insert payments (one per earning entry)
        if ((inputData.earnings || []).length > 0) {
            const paymentInserts = (inputData.earnings || []).map((e) => ({
                ID: uuidv4(),
                JobID: jobId,
                Amount: e.amount,
                TimePayed: e.date || new Date().toISOString(),
                MethodID: e.methodId || deafultPaymentMethodId,
            }));

            const { error: paymentError } = await supabase.from('Payment').insert(paymentInserts);

            if (paymentError) {
                console.error('Payment insert failed:', paymentError);
                alert('Payment insert failed');
                setSubmitProcessing(false);
                return;
            }
        }

        // Insert expenses (one or more)
        if ((inputData.expenses || []).length > 0) {
            const expenseInserts = (inputData.expenses || []).map((exp) => ({
                ID: uuidv4(),
                JobID: jobId,
                Amount: exp.amount,
                TimePayed: exp.date || new Date().toISOString(),
                MethodID: exp.methodId || deafultPaymentMethodId,
                Description: exp.desc || '',
            }));

            const { error: expenseError } = await supabase.from('Expense').insert(expenseInserts);

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

    // async function getTripDistanceFromShortLink(shortLink: string) {
    //     console.log(`getting trip distance from short link: ${shortLink}`);

    //     // const longLink = await getLongUrl(shortLink);

    //     const longLink = await getLongLinkFromShortLink(shortLink);

    //     const { source, destination } = parseGoogleMapsUrl(longLink);

    //     console.log(`source: ${source}`);
    //     console.log(`destination: ${destination}`);


    //     const distance = await getDistanceFromLocations(source || "", destination || "");
    //     console.log(`distance: ${distance}`);
    //     return { distance, source, destination };
    // }
    // function parseGoogleMapsUrl(url: string) {
    //     const regex = /\/maps\/dir\/([^/]+)\/([^/?#]+)/;
    //     const match = url.match(regex);

    //     if (!match || match.length < 3) {
    //         return { error: "Unable to parse source and destination" };
    //     }

    //     const source = decodeURIComponent(match[1]);
    //     const destination = decodeURIComponent(match[2]);

    //     return { source, destination };
    // }

    // async function getLongLinkFromShortLink(shortLink: string) {
    //     const backendUrl = import.meta.env.VITE_BACKEND_URL
    //     const urlToFetch = `${backendUrl}/shortlinkToLonglink?shortLink=${shortLink}`

    //     const response = await fetch(urlToFetch);
    //     const jsonResponse = await response.json();

    //     const longUrl = jsonResponse.longUrl

    //     console.log(`longUrl: ${longUrl}`);

    //     return longUrl;
    // }



    // async function getDistanceFromLocations(dest: string, src: string) {

    //     const backendUrl = import.meta.env.VITE_BACKEND_URL

    //     const url = `${backendUrl}/distance?start=${src}&end=${dest}`;

    //     const response = await fetch(url);
    //     const data = await response.json();

    //     // Return distance in meters
    //     return data.routes[0].legs[0].distance.value;
    // }

    const inputTextStyle: style = {
        ContainerStyle: "flex flex-row justify-between items-center w-[100%] ",
        InputStyle: InputBase,
        LabelStyle: LabelText
    }

    useEffect(() => {
        // console.log(inputData.clientId);
        setAddingNewClient(inputData.clientId === "add_new_client");
        console.log("trip 1: ", inputData.trips[0]);
    }, [inputData]);

    useEffect(() => {
        console.log("addingNewClient: ", addingNewClient);
    }, [addingNewClient]);




    useEffect(() => {
        console.log("validNewClient: ", validNewClient);
    }, [validNewClient]);

    useEffect(() => {
        // fetch available payment methods for dropdowns
        async function fetchPaymentMethods() {
            const { data, error } = await supabase.from('PaymentMethod').select('ID, Method');
            if (error) {
                console.error('Error fetching payment methods:', error);
                return;
            }
            setPaymentMethods(data || []);
        }
        fetchPaymentMethods();
    }, []);

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center h-[90%] w-[100%]">

                <Header mainTitle="Input Jobs" subTitle="Input your job information here" />
                <div className={`${BorderCard} `}>
                    {/*Client Filter*/}
                    <div className={`flex flex-col justify-between items-center w-[80%] ${borderStyle}`}>
                        <p>Use Existing Client</p>
                        <ClientSelector setSelectedOptions={(event) => { setInputData({ ...inputData, clientId: event.value.id }) }} selectMultiple={false} addNewClientOption={true} />
                        {addingNewClient && (
                            <>
                                <p className="text-[4vw] text-nowrap">OR</p>
                                <TextInputField
                                    Label="Add New Client"
                                    Type="text"
                                    onChange={(event) => { setInputData({ ...inputData, newClientName: event.target.value }) }}
                                    Placeholder="Enter client name"
                                    Style={inputTextStyle}
                                    currentValue={inputData.newClientName}
                                    setValidity={(valid: boolean) => setValidNewClient(valid)}
                                    validationRegex={/^(?!\s*$)[a-zA-Z0-9\s.'-]+$/}
                                    warningMessage="Please enter a valid client name"
                                    onEnter={() => { }}
                                />
                                {/* <p className={`${validNewClient ? 'text-green-600' : 'text-red-600'} text-[3vw] mt-2`}>{validNewClient ? 'Name looks good' : 'Enter a valid client name'}</p> */}
                            </>
                        )}
                    </div>
                    {/* Job Name */}
                    <div className={`flex justify-center flex-col items-center w-[80%] h-[10%] ${borderStyle}`}>
                        <div className="flex flex-col justify-between items-center w-[80%] ">
                            <p className="text-[4vw] text-nowrap">Job Name</p>
                            <input type="text" id="hoursWorked" onChange={(event) => { setInputData({ ...inputData, jobName: event.target.value }) }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                        </div>
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
                    {/* Hrs Worked */}
                    <TextInputField
                        Label="Hours Worked"
                        Type="number"
                        onChange={(event) => {
                            const num = parseFloat(event.target.value) || 0;
                            setInputData({ ...inputData, hours: num });
                        }}
                        // Placeholder="Enter hours worked"
                        Style={{ ContainerStyle: `${borderStyle}`, InputStyle: "w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm", LabelStyle: "text-[4vw] text-nowrap" }}
                    />


                    {/* Earnings - number selector */}
                    <div className={`flex justify-center flex-col items-center w-[80%] h-[10%] ${borderStyle}`}>
                        <div className="flex flex-col justify-between items-center w-[80%] ">
                            <p className="text-[4vw] text-nowrap">Number of Earnings</p>
                            <input type="number" id="numEarnings" min={0} max={20} onChange={(event) => {
                                let num = parseInt(event.target.value) || 0;
                                if (num < 0) num = 0;
                                if (num > 20) num = 20;
                                setNumberOfEarnings(num);
                                const updated = [...(inputData.earnings || [])];
                                while (updated.length < num) updated.push({ amount: 0, methodId: '', date: '' });
                                while (updated.length > num) updated.pop();
                                setInputData({ ...inputData, earnings: updated });
                            }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                        </div>
                    </div>

                    {/* Dynamic Earnings Inputs */}
                    < div className=" w-[100%] flex flex-col justify-between items-center flex-grow" >
                        {
                            Array.from({ length: numberOfEarnings }, (_, i) => (
                                <div key={i} className={`mt-4 flex justify-center flex-col items-center w-[80%]  ${borderStyle}`}>
                                    <p className="text-[4vw] text-nowrap">Earning {i + 1}</p>
                                    <div className={`flex flex-col justify-between items-center w-[100%] ${borderStyle}`}>
                                        <div className="flex flex-row justify-between items-center w-[80%] ">
                                            <p className="text-[4vw] text-nowrap">Amount</p>
                                            <input type="number" value={inputData.earnings[i]?.amount ?? ''} onChange={(e) => {
                                                const updated = [...(inputData.earnings || [])];
                                                updated[i] = { ...(updated[i] || { amount: 0, methodId: '', date: '', desc: '' }), amount: parseFloat(e.target.value) || 0 };
                                                setInputData({ ...inputData, earnings: updated });
                                            }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                                        </div>
                                        <div className="flex flex-row justify-between items-center w-[80%] mt-2">
                                            <p className="text-[4vw] text-nowrap">Payment Method</p>
                                            <select value={inputData.earnings[i]?.methodId ?? ''} onChange={(e) => {
                                                const updated = [...(inputData.earnings || [])];
                                                updated[i] = { ...(updated[i] || { amount: 0, methodId: '', date: '', desc: '' }), methodId: e.target.value };
                                                setInputData({ ...inputData, earnings: updated });
                                            }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " >
                                                <option value="">Select method</option>
                                                {paymentMethods.map((m: any) => (
                                                    <option key={m.ID} value={m.ID}>{m.Method}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-row justify-between items-center w-[80%] mt-2">
                                            <p className="text-[4vw] text-nowrap">Date</p>
                                            <input type="date" value={inputData.earnings[i]?.date ?? ''} onChange={(e) => {
                                                const updated = [...(inputData.earnings || [])];
                                                updated[i] = { ...(updated[i] || { amount: 0, methodId: '', date: '', desc: '' }), date: e.target.value };
                                                setInputData({ ...inputData, earnings: updated });
                                            }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                                        </div>
                                        {/* earnings have no description field per Payment schema */}
                                    </div>
                                </div >
                            ))
                        }
                    </div>

                    {/* Expenses - number selector */}
                    <div className={`flex justify-center flex-col items-center w-[80%] h-[10%] ${borderStyle}`}>
                        <div className="flex flex-col justify-between items-center w-[80%] ">
                            <p className="text-[4vw] text-nowrap">Number of Expenses</p>
                            <input type="number" id="numExpenses" min={0} max={20} onChange={(event) => {
                                let num = parseInt(event.target.value) || 0;
                                if (num < 0) num = 0;
                                if (num > 20) num = 20;
                                setNumberOfExpenses(num);
                                // expand or shrink the expenses array
                                const updated = [...(inputData.expenses || [])];
                                while (updated.length < num) updated.push({ amount: 0, methodId: '', date: '', desc: '' });
                                while (updated.length > num) updated.pop();
                                setInputData({ ...inputData, expenses: updated });
                            }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                        </div>
                    </div>

                    {/* Dynamic Expense Inputs */}
                    <div className=" w-[100%] flex flex-col justify-between items-center flex-grow" >
                        {
                            Array.from({ length: numberOfExpenses }, (_, i) => (
                                <div key={i} className={`mt-4 flex justify-center flex-col items-center w-[80%]  ${borderStyle}`}>
                                    <p className="text-[4vw] text-nowrap">Expense {i + 1}</p>
                                    <div className={`flex flex-col justify-between items-center w-[100%] ${borderStyle}`}>
                                        <div className="flex flex-row justify-between items-center w-[80%] ">
                                            <p className="text-[4vw] text-nowrap">Amount</p>
                                            <input type="number" value={inputData.expenses[i]?.amount ?? ''} onChange={(e) => {
                                                const updated = [...(inputData.expenses || [])];
                                                updated[i] = { ...(updated[i] || { amount: 0, methodId: '', date: '', desc: '' }), amount: parseFloat(e.target.value) || 0 };
                                                setInputData({ ...inputData, expenses: updated });
                                            }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                                        </div>
                                        <div className="flex flex-row justify-between items-center w-[80%] mt-2">
                                            <p className="text-[4vw] text-nowrap">Payment Method</p>
                                            <select value={inputData.expenses[i]?.methodId ?? ''} onChange={(e) => {
                                                const updated = [...(inputData.expenses || [])];
                                                updated[i] = { ...(updated[i] || { amount: 0, methodId: '', date: '', desc: '' }), methodId: e.target.value };
                                                setInputData({ ...inputData, expenses: updated });
                                            }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " >
                                                <option value="">Select method</option>
                                                {paymentMethods.map((m: any) => (
                                                    <option key={m.ID} value={m.ID}>{m.Method}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-row justify-between items-center w-[80%] mt-2">
                                            <p className="text-[4vw] text-nowrap">Date</p>
                                            <input type="date" value={inputData.expenses[i]?.date ?? ''} onChange={(e) => {
                                                const updated = [...(inputData.expenses || [])];
                                                updated[i] = { ...(updated[i] || { amount: 0, methodId: '', date: '', desc: '' }), date: e.target.value };
                                                setInputData({ ...inputData, expenses: updated });
                                            }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                                        </div>
                                        <div className="flex flex-row justify-between items-center w-[80%] mt-2">
                                            <p className="text-[4vw] text-nowrap">Description</p>
                                            <input type="text" value={inputData.expenses[i]?.desc ?? ''} onChange={(e) => {
                                                const updated = [...(inputData.expenses || [])];
                                                updated[i] = { ...(updated[i] || { amount: 0, methodId: '', date: '', desc: '' }), desc: e.target.value };
                                                setInputData({ ...inputData, expenses: updated });
                                            }} className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm " />
                                        </div>
                                    </div>
                                </div >
                            ))
                        }
                    </div>





                    {/* Trips - number selector */}
                    <div className={`flex justify-center flex-col items-center w-[80%] h-[10%] ${borderStyle}`}>
                        <div className="flex flex-col justify-between items-center w-[80%] ">
                            <p className="text-[4vw] text-nowrap">Number of Trips</p>
                            <input
                                type="number"
                                id="numTrips"
                                min={0}
                                max={20}
                                onChange={(event) => {
                                    let num = parseInt(event.target.value) || 0;
                                    if (num < 0) num = 0;
                                    if (num > 20) num = 20;
                                    setNumberOfTrips(num);
                                    const updated = [...(inputData.trips || [])];
                                    while (updated.length < num)
                                        updated.push({
                                            distance: 0,
                                            carId: '',
                                            gasPrice: 0,
                                            src: null,
                                            dest: null
                                        });
                                    while (updated.length > num) updated.pop();
                                    setInputData({ ...inputData, trips: updated });
                                }}
                                className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm "
                            />
                        </div>
                    </div>

                    {/* Dynamic Trip Inputs */}
                    <div className="w-[100%] flex flex-col justify-between items-center flex-grow">
                        {Array.from({ length: numberOfTrips }, (_, i) => (
                            <div
                                key={i}
                                className={`mt-4 flex justify-center flex-col items-center w-[80%] ${borderStyle}`}
                            >
                                <p className="text-[4vw] text-nowrap">Trip {i + 1}</p>
                                <div className={`flex flex-col justify-between items-center w-[100%] ${borderStyle}`}>
                                    {/* Start
                                    <div className="flex flex-row justify-between items-center w-[80%]">
                                        <p className="text-[4vw] text-nowrap">Start</p>
                                        <input
                                            type="text"
                                            value={inputData.trips[i]?.start ?? ''}
                                            onChange={(e) => {
                                                const updated = [...(inputData.trips || [])];
                                                updated[i] = { ...(updated[i] || {}), start: e.target.value };
                                                setInputData({ ...inputData, trips: updated });
                                            }}
                                            className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm "
                                        />
                                    </div>

                                    {/* End }
                                    <div className="flex flex-row justify-between items-center w-[80%] mt-2">
                                        <p className="text-[4vw] text-nowrap">End</p>
                                        <input
                                            type="text"
                                            value={inputData.trips[i]?.end ?? ''}
                                            onChange={(e) => {
                                                const updated = [...(inputData.trips || [])];
                                                updated[i] = { ...(updated[i] || {}), end: e.target.value };
                                                setInputData({ ...inputData, trips: updated });
                                            }}
                                            className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm "
                                        />
                                    </div> */}

                                    <p className="font-bold">OR</p>

                                    {/* Distance */}
                                    <div className="flex flex-row justify-between items-center w-[80%] mt-2">
                                        <p className="text-[4vw] text-nowrap">Distance</p>
                                        <input
                                            type="number"
                                            value={inputData.trips[i]?.distance ?? ''}
                                            onChange={(e) => {
                                                const updated = [...(inputData.trips || [])];
                                                updated[i] = { ...(updated[i] || {}), distance: parseFloat(e.target.value) || 0 };
                                                setInputData({ ...inputData, trips: updated });
                                            }}
                                            className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm "
                                        />
                                    </div>

                                    <p className="font-bold">OR</p>

                                    {/* Map Link */}
                                    <MapInputField
                                        location1={inputData.trips[i].src ?? null}
                                        setLocation1={(src: [number, number] | null) => {
                                            setInputData(prev => {
                                                const updatedTrips = [...prev.trips];
                                                updatedTrips[i] = { ...updatedTrips[i], src }; // clone trip object
                                                return { ...prev, trips: updatedTrips };
                                            });
                                        }}
                                        location2={inputData.trips[i].dest ?? null}
                                        setLocation2={(dest: [number, number] | null) => {
                                            setInputData(prev => {
                                                const updatedTrips = [...prev.trips];
                                                updatedTrips[i] = { ...updatedTrips[i], dest }; // clone trip object
                                                return { ...prev, trips: updatedTrips };
                                            });
                                        }}
                                    />

                                    {/* Gas Price */}
                                    <div className="flex flex-row justify-between items-center w-[80%] mt-2">
                                        <p className="text-[4vw] text-nowrap">Gas Price</p>
                                        <input
                                            type="number"
                                            value={inputData.trips[i]?.gasPrice ?? ''}
                                            onChange={(e) => {
                                                const updated = [...(inputData.trips || [])];
                                                updated[i] = { ...(updated[i] || {}), gasPrice: parseFloat(e.target.value) || 0 };
                                                setInputData({ ...inputData, trips: updated });
                                            }}
                                            className="w-[38vw] ml-4 border bg-white border-gray-300 text-gray-900 rounded-sm "
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Submit Button */}
                    <div className="flex justify-center items-center mt-6" >
                        <SubmitButton disabled={(addingNewClient && !validNewClient) || submitProcessing} text={submitProcessing ? "Submitting..." : "Submit"} onClick={handleSubmit} />
                    </div>
                </div >
            </div>
        </>
    )
}

export default InputJobsPage