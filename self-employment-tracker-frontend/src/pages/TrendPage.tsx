import Header from "../components/Header"
import NavBar from "../components/NavBar"
import LineGraph from "../components/LineGraph"
function TrendPage() {
    const data: any = [
        { name: 'Jan', sales: 400 },
        { name: 'Feb', sales: 300 },
        { name: 'Mar', sales: 500 },
        { name: 'Apr', sales: 200 },
        { name: 'May', sales: 700 },
    ];
    return (
        <>
            <NavBar />
            <Header mainTitle="Trends" subTitle="Understand your data" />
            <div className="h-[50%] w-[100vw] flex flex-col justify-around items-center">
                <div className={`flex flex-row justify-between items-center w-[80%] `}>
                    <p className="text-[4vw] text-nowrap">Graph</p>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5" defaultValue={""}>
                        <option value={""} disabled>Select a graph</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                    </select>
                </div>
                <LineGraph data={data} />
            </div>
        </>
    )
}

export default TrendPage