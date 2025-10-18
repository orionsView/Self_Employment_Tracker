import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient";

type jobObj = {
    JobID: string;
    JobName: string;            // The job ID
    ClientName: string;    // Combined FirstName + LastName
    StartDate: string;     // TimeEntered date string
    NetEarnings: number;      // total_earnings
    Trips: number;         // trip_count
};

function JobTable() {
    // const data = [
    //     ["Job 1", "Client 1", "Start Date 1", "$200", "10"],
    //     ["Job 2", "Client 2", "Start Date 2", "$300", "15"],
    //     ["Job 3", "Client 3", "Start Date 3", "$400", "20"],
    //     ["Job 4", "Client 4", "Start Date 4", "$500", "25"],
    //     ["Job 5", "Client 5", "Start Date 5", "$600", "30"],
    //     ["Job 6", "Client 6", "Start Date 6", "$700", "35"],
    //     ["Job 7", "Client 7", "Start Date 7", "$800", "40"],
    //     ["Job 8", "Client 8", "Start Date 8", "$900", "45"],
    //     ["Job 9", "Client 9", "Start Date 9", "$1000", "50"],
    //     ["Job 10", "Client 10", "Start Date 10", "$1100", "55"],
    //     ["Job 11", "Client 11", "Start Date 11", "$1200", "60"],
    //     ["Job 12", "Client 12", "Start Date 12", "$1300", "65"],
    //     ["Job 13", "Client 13", "Start Date 13", "$1400", "70"],
    //     ["Job 14", "Client 14", "Start Date 14", "$1500", "75"],
    //     ["Job 15", "Client 15", "Start Date 15", "$1600", "80"],
    // ];

    const [jobs, setJobs] = useState<jobObj[]>([]);
    const [orderBy, setOrderBy] = useState("JobName");
    const [asc, setAsc] = useState(false);



    useEffect(() => {
        const fetchJobs = async (
            orderBy: string,
            asc: boolean,
            clients: string[] | null,
            startDate: string | null,
            endDate: string | null
        ) => {


            const {
                data: { user },
            } = await supabase.auth.getUser()

            console.log(`user id: ${user?.id}`);


            const { data, error } = await supabase.rpc('get_user_jobs_limited_filtered', {
                in_user_id: user?.id,
                in_order_by: orderBy,
                in_asc: asc,
                in_client_ids: clients,
                in_start_date: startDate,
                in_end_date: endDate
            })

            if (error) {
                console.error('Error fetching jobs:', error)

            } else {
                console.log(`data: ${JSON.stringify(data)}`);
                const jobObjs: jobObj[] = data.map((job: any) => ({
                    JobName: job.JobName,
                    ClientName: `${job.FirstName} ${job.LastName}`,
                    StartDate: new Date(job.TimeEntered).toLocaleDateString(),  // format date nicely
                    NetEarnings: job.net_earnings,
                    Trips: job.trip_count,
                    JobID: job.JobID
                }));

                console.log(`jobObjs: ${JSON.stringify(jobObjs)}`);
                setJobs(jobObjs);
            }

        }






        const raw = localStorage.getItem("selectedClients");
        let selectedClients: string[] = [];

        if (!raw) selectedClients = [];

        try {
            const parsed: { value: { id: string }; label: string }[] | null = JSON.parse(raw || "") as {
                value: { id: string };
                label: string;
            }[];

            selectedClients = parsed.map((entry) => entry.value.id);
        } catch (err) {
            console.error("Failed to parse clients from localStorage", err);
        }

        let startDate = localStorage.getItem("startDate");
        let endDate = localStorage.getItem("endDate");

        console.log(`selectedClients: ${JSON.stringify(selectedClients)}`);

        // get search paras from local storage
        if (!startDate && !endDate) {
            fetchJobs(orderBy, asc, selectedClients, startDate, endDate);
        } else {
            fetchJobs(orderBy, asc, selectedClients, null, null);
        }

    }, [orderBy, asc]);

    useEffect(() => {
        console.log(jobs)
    }, [jobs])

    const navigate = useNavigate();

    const headerCellStyle: string = "border-2 border-textColor text-nowrap p-1 pb-2 pt-2 text-tertiaryColor bg-mainColor font-bold";
    const cellStyle: string = "border border-textColor text-nowrap p-1 bg-tertiaryColor text-textColor";
    return (
        <>
            <div className="w-full overflow-x-auto">

                <table className="border-collapse border border-black">
                    <thead>
                        <tr className="border border-black">
                            <th className={headerCellStyle} onClick={() => { setOrderBy("TimeEntered"); setAsc(!asc) }}>Job ↕</th>
                            <th className={headerCellStyle} onClick={() => { setOrderBy("FirstName"); setAsc(!asc) }}>Client ↕</th>
                            <th className={headerCellStyle} onClick={() => { setOrderBy("TimeStarted"); setAsc(!asc) }}>Start Date ↕</th>
                            <th className={headerCellStyle} onClick={() => { setOrderBy("net_earnings"); setAsc(!asc) }}>Net Earnings ↕</th>
                            <th className={headerCellStyle} onClick={() => { setOrderBy("trip_count"); setAsc(!asc) }}># Trips ↕</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            jobs.map((job, index) => (
                                <tr key={`${job.JobName}-${index}`} onClick={() => navigate(`/logged/moreInfo/${job.JobID}`)}>
                                    <td className={cellStyle}>{job.JobName}</td>
                                    <td className={cellStyle}>{job.ClientName}</td>
                                    <td className={cellStyle}>{job.StartDate}</td>
                                    <td className={cellStyle}>{job.NetEarnings}</td>
                                    <td className={cellStyle}>{job.Trips}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table >
            </div>
        </>
    )
}

export default JobTable