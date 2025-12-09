import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { useParams } from "react-router";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import InfoDropdown from "../components/InfoDropDown";
// import SubmitButton from "../components/SubmitButton";

type Job = {
    id: number;
    job_title: string;
    job_description: string;
    job_start_date: Date;
    job_end_date: Date;
    job_client: Client;
    trips: Trip[],
    expenses: Transaction[],
    earnings: Transaction[]
}

type Trip = {
    trip_src: string;
    trip_dst: string;
    trip_distance: number;
    trip_gas_price: number;
    trip_duration: number;
    trip_starting_date: Date;
}

type Client = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

type Transaction = {
    amount: number;
    method: string;
    date: Date;
}


function LoggedJobInfoPage() {
    const { jobID } = useParams();
    const [jobData, setJobData] = useState<Job | null>(null);

    useEffect(() => {
        loadPage();
    }, [jobID]);

    async function loadPage() {
        const { data, error } = await supabase.rpc("get_job_full_details", { in_job_id: jobID });
        if (error) {
            console.error("Supabase error:", error);
            return;
        }
        if (!data) return;

        console.log("Raw RPC result:", JSON.stringify(data, null, 2));

        const normalized: Job = {
            id: data.Job.ID,
            job_title: data.Job.JobName,
            job_description: "",
            job_start_date: new Date(data.Job.TimeStarted),
            job_end_date: new Date(data.Job.TimeEnded),
            job_client: {
                first_name: data.Client.FirstName,
                last_name: data.Client.LastName,
                email: data.Client.Email,
                phone: String(data.Client.PhoneNumber),
            },
            trips: data.Trips.map((t: any) => ({
                trip_src: t.Src,
                trip_dst: t.Dst,
                trip_distance: t.Distance,
                trip_gas_price: t.GasPrice,
                trip_duration: t.Duration,
                trip_starting_date: new Date(t.TimeStarted),
            })),
            expenses: data.Expenses.map((e: any) => ({
                amount: e.Amount,
                method: e.Method ?? "",
                date: new Date(e.TimeSpent ?? Date.now()),
            })),
            earnings: data.Payments.map((p: any) => ({
                amount: p.Amount,
                method: p.PaymentMethod,
                date: new Date(p.TimePayed),
            })),
        };

        setJobData(normalized);
    }


    // Structured state: maps / arrays instead of flattened strings
    const [jobMap, setJobMap] = useState<Record<string, any> | null>(null);
    const [clientMap, setClientMap] = useState<Record<string, any> | null>(null);
    const [tripArray, setTripArray] = useState<Array<Record<string, any>>>([]);
    const [expenseArray, setExpenseArray] = useState<Array<Record<string, any>>>([]);
    const [earningsArray, setEarningsArray] = useState<Array<Record<string, any>>>([]);

    useEffect(() => {
        if (!jobData) return;
        console.log("jobData: ", jobData)

        // Job summary map
        setJobMap({
            title: jobData.job_title,
            description: jobData.job_description,
            startDate: jobData.job_start_date?.toLocaleString?.() ?? String(jobData.job_start_date),
            endDate: jobData.job_end_date?.toLocaleString?.() ?? String(jobData.job_end_date),
        });

        // Client map
        setClientMap(jobData.job_client ?? {});

        // Trips as array of maps
        if (!jobData.trips?.length) {
            setTripArray([]);
        } else {
            setTripArray(jobData.trips.map(t => ({
                src: t.trip_src,
                dst: t.trip_dst,
                distance: t.trip_distance,
                gasPrice: t.trip_gas_price,
                duration: t.trip_duration,
                startDate: t.trip_starting_date?.toLocaleDateString?.() ?? String(t.trip_starting_date),
            })));
        }

        // Expenses as array of maps
        if (!jobData.expenses?.length) {
            setExpenseArray([]);
        } else {
            setExpenseArray(jobData.expenses.map(e => ({
                amount: e.amount,
                method: e.method ?? '',
                date: e.date?.toLocaleDateString?.() ?? String(e.date),
            })));
        }

        // Earnings as array of maps
        if (!jobData.earnings?.length) {
            setEarningsArray([]);
        } else {
            setEarningsArray(jobData.earnings.map(e => ({
                amount: e.amount,
                method: e.method ?? '',
                date: e.date?.toLocaleDateString?.() ?? String(e.date),
            })));
        }


    }, [jobData]);
    useEffect(() => {
        // Debug log structured data
        console.log("jobMap: ", jobMap);
        console.log("clientMap: ", clientMap);
        console.log("tripArray: ", tripArray);
        console.log("expenseArray: ", expenseArray);
        console.log("earningsArray: ", earningsArray);
    }, [jobMap, clientMap, tripArray, expenseArray, earningsArray]);

    async function deleteJob() {
        const { data, error } = await supabase.rpc("delete_job_cascade", {
            job_uuid: jobID
        });
        

        if (error) console.error("RPC error:", error);
        else {
            window.location.href = "/menu";
            alert("Job deleted successfully.");
        }

    }

    return (
        <>
            <NavBar />
            <Header mainTitle="Logged Job" />
            <div className="h-[100%] w-[100vw] flex flex-col items-center">
                <div className=" w-[80%] flex flex-col items-center">

                    <InfoDropdown title="Job Details" text={jobMap ?? {}} editable={false} />
                    <InfoDropdown title="Client" text={clientMap ?? {}} editable={false} />
                    <InfoDropdown title="Trips" text={tripArray} editable={false} />
                    <InfoDropdown title="Expenses" text={expenseArray} editable={false} />
                    <InfoDropdown title="Earnings" text={earningsArray} editable={false} />
                </div>

                <button className="bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={deleteJob}>Delete Job</button>

            </div>

        </>

    );
}

export default LoggedJobInfoPage