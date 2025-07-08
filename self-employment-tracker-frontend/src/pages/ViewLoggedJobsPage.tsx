import NavBar from "../components/NavBar"
import Header from "../components/Header"
import JobTable from "../components/JobTable"
function ViewLoggedJobsPage() {
    return (
        <>
            <NavBar />
            <Header mainTitle="Logged Jobs" />

            <JobTable />
        </>
    )
}

export default ViewLoggedJobsPage