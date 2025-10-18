import Header from "../components/Header";
import InfoDropdown from "../components/InfoDropDown";
import NavBar from "../components/NavBar";

function TutorialPage() {
    return (
        <>
            <NavBar />
            <Header mainTitle="Tutorial" subTitle="Click a page title to learn more" />
            <div className="h-[40%] w-[100%] flex flex-col justify-between items-center ">
                <div className="h-[100%] w-[80%] flex flex-col items-center ">
                    <InfoDropdown
                        title="Login"
                        text="Arriving at the login screen, the options to login include: logging in with a connected Google account, manually entering an email and password, or creating a new account."
                    />

                    <InfoDropdown
                        title="New Job"
                        text="When entering a new job, a client is associated with each job along with a custom name for the job. After that, the date range and total hours worked can be input. Next, the number of earnings, expenses, and trips that took place during this job is selected. For each of these sections there are options for adding information that clarifies what each item was for, what payment method was used, how much gas cost for that trip, and more. After submitting the form, a confirmation message will appear if the job was input correctly."
                    />

                    <InfoDropdown
                        title="Logged Jobs"
                        text="When searching through logged jobs, the logs can be sorted by the clients a job was associated with or by a specific date range. After searching, a job can be selected to view additional details."
                    />

                    <InfoDropdown
                        title="Trends"
                        text="After viewing the information about the job, additional analysis on finances as a whole may be necessary. This is what the Trends page is for: here, different graphs can be selected to provide insight into how the business is performing over time. Below the graphs, there is a section that displays personalized analysis of the financial situation in written form."
                    />

                    <InfoDropdown
                        title="Export"
                        text="Here, personal data can be downloaded as an Excel sheet. The export can be filtered by clients or time range, or the data can be downloaded in full."
                    />

                    <div className="text-tertiaryColor bg-mainColor rounded-3xl p-4">Thank you for checking out <span className="italic">Punch The Clock</span>! If you have any questions, comments or concerns, please feel free to reach out at <a href="mailto:davidhunterphillips03@gmail.com" className="text-secondaryColor">davidhunterphillips03@gmail.com</a></div>

                </div>

            </div>
        </>
    )
}

export default TutorialPage;