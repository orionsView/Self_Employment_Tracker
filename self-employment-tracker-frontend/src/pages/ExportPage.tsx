import Header from "../components/Header";
import NavBar from "../components/NavBar";
import ClientSelector from "../components/ClientSelector";
import { useState } from "react";
import DateRangePicker from '../components/DateRangePicker'
import { BorderCard } from '../constants/ui'
import SubmitButton from "../components/SubmitButton"
import { supabase } from '../supabaseClient'

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// import { set } from "lodash";
function ExportPage() {
  const borderStyle: string = BorderCard;
  const [selectedOptions, setSelectedOptions]: any = useState([]);
  const [startDate, setStartDate]: any = useState(null);
  const [endDate, setEndDate]: any = useState(null);

  const [jobs, setJobs] = useState([]);


  const handleSubmit = async () => {
    const data = await fetchJobs(selectedOptions, startDate, endDate);
    exportJobsToExcel(data);
  };

  const fetchJobs = async (
    selectedOptionsArr: string | null,
    startDate: string | null,
    endDate: string | null
  ) => {
    let selectedClientIds: string[] = [];

    try {
      // If user has selected clients, extract their IDs directly
      if (Array.isArray(selectedOptionsArr)) {
        selectedClientIds = selectedOptionsArr.map(
          (entry: any) => entry.value?.id || entry.value
        );
      }
    } catch (err) {
      console.error("Failed to extract clients:", err);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log(`user id: ${user?.id}`);


    const { data, error } = await supabase.rpc('get_user_jobs_limited_filtered', {
      in_user_id: user?.id,
      in_order_by: "JobName",
      in_asc: true,
      in_client_ids: selectedClientIds,
      in_start_date: startDate,
      in_end_date: endDate
    })

    if (error) {
      console.error('Error fetching jobs:', error)

      return [];

    } else {
      // console.log(`data: ${JSON.stringify(data)}`);
      // const jobObjs: jobObj[] = data.map((job: any) => ({
      //     JobName: job.JobName,
      //     ClientName: `${job.FirstName} ${job.LastName}`,
      //     StartDate: new Date(job.TimeEntered).toLocaleDateString(),  // format date nicely
      //     NetEarnings: job.net_earnings,
      //     Trips: job.trip_count,
      //     JobID: job.JobID
      // }));

      // console.log(`jobObjs: ${JSON.stringify(jobObjs)}`);
      // setJobs(jobObjs);
      setJobs(data);
      console.log(`jobs: ${JSON.stringify(jobs)}`);
      return data;
    }
  }

  // const exportCSV = () => {
  //     const csv = jobs.map((job: any) => `${job.JobName || 'N/A'},${job.FirstName || 'N/A'} ${job.LastName || 'N/A'},${job.TimeStarted || 'N/A'},${job.net_earnings || 'N/A'},${job.trip_count || 'N/A'}`).join('\n');
  //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.setAttribute('href', url);
  //     link.setAttribute('download', 'jobs.csv');
  //     link.style.visibility = 'hidden';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  // }


  function exportJobsToExcel(jobs: any[], filename = "Jobs.xlsx") {
    if (!jobs || jobs.length === 0) {
      console.warn("No jobs found to export!");
      alert("No jobs found to export!");
      return;
    }

    // Format data for Excel
    const formattedJobs = jobs.map((job: any) => ({
      JobName: job.JobName ?? "N/A",
      ClientName: `${job.FirstName ?? ""} ${job.LastName ?? ""}`.trim(),
      TimeEntered: job.TimeEntered ?? "N/A",
      TimeStarted: job.TimeStarted ?? "N/A",
      TimeEnded: job.TimeEnded ?? "N/A",
      Profit: job.net_earnings ?? "N/A",
      Trips: job.trip_count ?? "N/A",
    }));

    // Convert to Excel worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedJobs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");

    // Write to binary array
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Create and trigger download
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
  }


  return (
    <>
      <NavBar />
      <Header mainTitle="Export Logs" subTitle="Export logs to Excel" />
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
          <SubmitButton text="Select" onClick={handleSubmit} />
        </div >
      </div>
    </>
  )
}

export default ExportPage;