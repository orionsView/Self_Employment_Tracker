import NavBar from "../components/NavBar"
import Header from "../components/Header"
import JobTable from "../components/JobTable"
function ViewLoggedJobsPage() {
    return (
        <>
            <NavBar />
            <Header mainTitle="Logged Jobs" subTitle="Click a job to view details" />

            <JobTable />
        </>
    )
}

export default ViewLoggedJobsPage