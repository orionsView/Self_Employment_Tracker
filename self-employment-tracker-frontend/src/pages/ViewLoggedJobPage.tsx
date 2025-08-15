import Header from "../components/Header";
import { useParams } from "react-router";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { set } from "lodash";
function LoggedJobInfoPage() {
    const [jobData, setJobData] = useState(null);
    const { jobID } = useParams();

    useEffect(() => {
        loadPage();
    }, []);

    async function loadPage() {

        const { data, error } = await supabase.rpc("get_job_full_details", { in_job_id: jobID })
        if (error) {
            console.log(error)
        }
        else {
            setJobData(data)
        }
    }

    return (
        <>
            <Header mainTitle="Logged Job Info" />
            <pre>{JSON.stringify(jobData, null, 2)}</pre>
        </>

    );
}

export default LoggedJobInfoPage