import Header from "../components/Header"
import NavBar from "../components/NavBar"
import LineGraph from "../components/LineGraph"
import BarGraph from "../components/BarGraph"
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
function TrendPage() {
    // const data: any = [
    //     { name: 'Jan', sales: 400 },
    //     { name: 'Feb', sales: 300 },
    //     { name: 'Mar', sales: 500 },
    //     { name: 'Apr', sales: 200 },
    //     { name: 'May', sales: 700 },
    // ];

    const [displayData, setDisplayData]: any = useState([]);
    const [selectedGraph, setSelectedGraph]: any = useState("");
    const [showExpenses, setShowExpenses]: any = useState(false);
    const [showEarnings, setShowEarnings]: any = useState(false);

    async function handleDataChange() {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error('User not authenticated', userError);
            return;
        }
        switch (selectedGraph) {
            case "Week by Week Income":

                const { data, error } = await supabase
                    .rpc('get_weekly_income_summary', { user_id: user.id });

                if (error) {
                    console.error('Error fetching income summary:', error)

                } else {
                    console.log(`data: ${JSON.stringify(data)}`);
                    setDisplayData(data);
                }
                break;
            case "Month by Month Income":
                const { data: monthData, error: monthError } = await supabase
                    .rpc('get_monthly_income_summary', { user_id: user.id });

                if (monthError) {
                    console.error('Error fetching income summary:', monthError)
                } else {
                    console.log(`data: ${JSON.stringify(monthData)}`);
                    setDisplayData(monthData);
                }
                break;
            case "Year by Year Income":
                const { data: yearData, error: yearError } = await supabase
                    .rpc('get_yearly_income_summary', { user_id: user.id });

                if (yearError) {
                    console.error('Error fetching income summary:', yearError)
                } else {
                    console.log(`data: ${JSON.stringify(yearData)}`);
                    setDisplayData(yearData);
                }
                break;
        }
    }

    useEffect(() => {
        handleDataChange();
    }, [selectedGraph]);

    return (
        <>
            <NavBar />
            <Header mainTitle="Trends" subTitle="Understand your data" />
            {/* ADD DATE RANGE FILTER */}


            <div className="h-[50%] w-[100vw] flex flex-col justify-around items-center">
                <div className={`flex flex-row justify-between items-center w-[80%] `}>
                    {/* Graph Type */}

                    <select onChange={(e) => setSelectedGraph(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5" defaultValue={""}>
                        <option value={""} disabled>Select a graph</option>
                        <option>Week by Week Income</option>
                        <option>Month by Month Income</option>
                        <option>Year by Year Income</option>
                    </select>
                    {/* Detail Level */}
                    <div className="flex flex-col items-center">
                        <div>
                            <label htmlFor="showExpenses" className="mr-2">Show Expenses</label>
                            <input type="checkbox" name="showExpenses" onChange={(e) => setShowExpenses(e.target.checked)} />
                        </div>
                        <div>
                            <label htmlFor="showEarnings " className="mr-2">Show Earnings</label>
                            <input type="checkbox" name="showEarnings" onChange={(e) => setShowEarnings(e.target.checked)} />
                        </div>
                    </div>

                </div>
                {/* Submit Button
                <div className="flex justify-center items-center  h-[10%]">
                    <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </button>
                </div> */}

                {/* <LineGraph data={data} /> */}
                <BarGraph data={displayData} showExpenses={showExpenses} showEarnings={showEarnings} />

            </div>
        </>
    )
}

export default TrendPage