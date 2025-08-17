import Header from "../components/Header";
import { useParams } from "react-router";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import InfoDropdown from "../components/InfoDropDown";

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
    const [jobData, setJobData] = useState<Job | null>(null);
    const { jobID } = useParams();

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
            job_description: "", // no description in your RPC, maybe add later?
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
                method: e.Method ?? "", // depends on your RPC
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


    const [jobText, setJobText] = useState("");
    const [clientText, setClientText] = useState("");
    const [tripText, setTripText] = useState("");
    const [expenseText, setExpenseText] = useState("");
    const [earningsText, setEarningsText] = useState("");

    useEffect(() => {
        if (!jobData) return;
        console.log("jobData: ", jobData)
        setJobText(
            `${jobData.job_title} | ${jobData.job_description} | ${jobData.job_start_date} - ${jobData.job_end_date}`
        );

        setClientText(
            jobData.job_client
                ? `${jobData.job_client.first_name} ${jobData.job_client.last_name}`
                : "No client data found"
        );

        if (!jobData.trips?.length) {
            setTripText("No trip data found");
        } else {
            setTripText(
                jobData.trips.map(t =>
                    `${t.trip_src} - ${t.trip_dst} | ${t.trip_distance} | ${t.trip_gas_price} | ${t.trip_duration} | ${new Date(t.trip_starting_date).toLocaleDateString()}`
                ).join("\n")
            );
        }

        if (!jobData.expenses?.length) {
            setExpenseText("No expense data found");
        } else {
            setExpenseText(
                jobData.expenses.map(e =>
                    `${e.amount} | ${e.method} | ${new Date(e.date).toLocaleDateString()}`
                ).join("\n")
            );
        }

        if (!jobData.earnings?.length) {
            setEarningsText("No earning data found");
        } else {
            setEarningsText(
                jobData.earnings.map(e =>
                    `${e.amount} | ${e.method} | ${new Date(e.date).toLocaleDateString()}`
                ).join("\n")
            );
        }


    }, [jobData]);
    useEffect(() => {
        console.log("jobText: ", jobText);
        console.log("clientText: ", clientText);
        console.log("tripText: ", tripText);
        console.log("expenseText: ", expenseText);
        console.log("earningsText: ", earningsText);
    }, [jobText, clientText, tripText, expenseText, earningsText]);


    return (
        <>
            <div className="h-[100%] w-[100vw] flex flex-col items-center">
                <Header mainTitle="Logged Job Info" />

                <InfoDropdown title="Job Details" text={jobText} />
                <InfoDropdown title="Client" text={clientText} />
                <InfoDropdown title="Trips" text={tripText} />
                <InfoDropdown title="Expenses" text={expenseText} />
                <InfoDropdown title="Earnings" text={earningsText} />
            </div>
        </>

    );
}

export default LoggedJobInfoPage