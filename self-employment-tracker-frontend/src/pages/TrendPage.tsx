import Header from "../components/Header"
import NavBar from "../components/NavBar"
import BarGraph from "../components/BarGraph"
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

import lodash from 'lodash';

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
    const [showTrend, setShowTrend]: any = useState(false);


    // Metrics
    const [AverageNetIncome, setAverageNetIncome]: any = useState(0);
    const [AverageExpenses, setAverageExpenses]: any = useState(0);
    const [AverageEarnings, setAverageEarnings]: any = useState(0);
    const [TotalNetIncome, setTotalNetIncome]: any = useState(0);
    const [TotalExpenses, setTotalExpenses]: any = useState(0);
    const [TotalEarnings, setTotalEarnings]: any = useState(0);

    // Date Range
    const [startDate, setStartDate]: any = useState(null);
    const [endDate, setEndDate]: any = useState(null);



    useEffect(() => {
        if (displayData.length === 0) return;

        setTotalNetIncome(lodash.round(lodash.sumBy(displayData, 'net_income'), 2));
        setAverageNetIncome(lodash.round(lodash.meanBy(displayData, 'net_income'), 2));

        setTotalEarnings(lodash.round(lodash.sumBy(displayData, 'earnings'), 2));
        setAverageEarnings(lodash.round(lodash.meanBy(displayData, 'earnings'), 2));

        setTotalExpenses(lodash.round(lodash.sumBy(displayData, 'expenses'), 2));
        setAverageExpenses(lodash.round(lodash.meanBy(displayData, 'expenses'), 2));
    }, [displayData]);

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
                    .rpc('get_weekly_income_summary', {
                        user_id: user.id,
                        start_date: startDate,
                        end_date: endDate
                    });

                if (error) {
                    console.error('Error fetching income summary:', error)

                } else {
                    console.log(`data: ${JSON.stringify(data)}`);
                    setDisplayData(data);
                }
                break;
            case "Month by Month Income":
                const { data: monthData, error: monthError } = await supabase
                    .rpc('get_monthly_income_summary', {
                        user_id: user.id,
                        start_date: startDate,
                        end_date: endDate
                    });

                if (monthError) {
                    console.error('Error fetching income summary:', monthError)
                } else {
                    console.log(`data: ${JSON.stringify(monthData)}`);
                    setDisplayData(monthData);
                }
                break;
            case "Year by Year Income":
                const { data: yearData, error: yearError } = await supabase
                    .rpc('get_yearly_income_summary', {
                        user_id: user.id,
                        start_date: startDate,
                        end_date: endDate
                    });

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
    }, [selectedGraph, startDate, endDate]);

    function clearDateRange() {
        setStartDate(null);
        setEndDate(null);
    }

    const metricsSmallStyle: string = "font-bold text-[2.5vw] text-nowrap";

    return (
        <>
            <NavBar />
            <Header mainTitle="Trends" subTitle="Understand your data" />



            <div className="h-[50%] w-[100vw] flex flex-col justify-around items-center">
                {/* DATE FILTER */}
                <div className={`flex justify-between flex-col items-center w-[80%] h-[20%] border-1 p-[1vh] rounded-lg shadow-lg mb-[2vh]`}>
                    <div className="flex flex-row justify-between items-center w-[80%] ">
                        <p className="text-[4vw] text-nowrap" >Date Start</p>
                        <input type="date" id="dateStart" onChange={(e) => setStartDate(e.target.value)} value={startDate === null ? "" : startDate} />
                    </div>
                    <div className="flex flex-row justify-between items-center w-[80%] ">
                        <p className="text-[4vw] text-nowrap">Date End</p>
                        <input type="date" id="dateEnd" onChange={(e) => setEndDate(e.target.value)} value={endDate === null ? "" : endDate} />
                    </div>
                    <p className="text-[3vw] text-nowrap text-red-500" onClick={clearDateRange}>Clear</p>
                </div>
                <div className={`flex flex-row justify-between items-center w-[80%] `}>
                    {/* Graph Type */}
                    <select onChange={(e) => setSelectedGraph(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5" defaultValue={""}>
                        <option value={""} disabled>Select a graph</option>
                        <option>Week by Week Income</option>
                        <option>Month by Month Income</option>
                        <option>Year by Year Income</option>
                    </select>

                    {/* Detail Level */}
                    <div className="flex flex-col items-center" >
                        <div >
                            <label htmlFor="showExpenses" className="mr-2">Show Expenses</label>
                            <input type="checkbox"
                                id="showExpenses"
                                name="showExpenses"
                                checked={showExpenses}
                                onChange={() => setShowExpenses(!showExpenses)}
                                className="mr-2" />
                        </div>
                        <div >
                            <label htmlFor="showEarnings " className="mr-2">Show Earnings</label>
                            <input type="checkbox"
                                id="showEarnings"
                                name="showEarnings"
                                checked={showEarnings}
                                onChange={() => setShowEarnings(!showEarnings)}
                                className="mr-2" />
                        </div>
                        {/* Show Trend */}
                        <div >
                            <label htmlFor="showTrend" className="mr-2">Show Trend</label>
                            <input type="checkbox"
                                id="showTrend"
                                name="showTrend"
                                checked={showTrend}
                                onChange={() => setShowTrend(!showTrend)}
                                className="mr-2" />
                        </div>
                    </div>

                </div>



                {/* <LineGraph data={data} /> */}
                <div className="w-[100%] min-h-[300px] h-[75vh]">
                    <BarGraph data={displayData} showExpenses={showExpenses} showEarnings={showEarnings} showTrend={showTrend} />
                </div>
                {/* Useful Metrics */}
                <div className="flex flex-col justify-between items-center w-[100%] ">
                    <p className="font-bold text-[5vw]">Useful Metrics</p>
                    <div className="flex flex-row justify-around items-center w-[100%] ">

                        <div className="flex flex-col items-center border-1 p-[1vh] rounded-lg shadow-lg">
                            <p className={metricsSmallStyle}>Total Net Income {TotalNetIncome}</p>
                            <p className={metricsSmallStyle}>Total Expenses {TotalExpenses}</p>
                            <p className={metricsSmallStyle}>Total Earnings {TotalEarnings}</p>
                        </div>

                        <div className="flex flex-col items-center border-1 p-[1vh] rounded-lg shadow-lg">
                            <p className={metricsSmallStyle}>Average Net Income {AverageNetIncome}</p>
                            <p className={metricsSmallStyle}>Average Expenses {AverageExpenses}</p>
                            <p className={metricsSmallStyle}>Average Earnings {AverageEarnings}</p>
                        </div>



                    </div>
                </div>
            </div >
        </>
    )
}

export default TrendPage