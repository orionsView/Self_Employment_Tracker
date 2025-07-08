function JobTable() {
    const data = [
        ["Job 1", "Client 1", "Start Date 1", "$200", "10"],
        ["Job 2", "Client 2", "Start Date 2", "$300", "15"],
        ["Job 3", "Client 3", "Start Date 3", "$400", "20"],
        ["Job 4", "Client 4", "Start Date 4", "$500", "25"],
        ["Job 5", "Client 5", "Start Date 5", "$600", "30"],
        ["Job 6", "Client 6", "Start Date 6", "$700", "35"],
        ["Job 7", "Client 7", "Start Date 7", "$800", "40"],
        ["Job 8", "Client 8", "Start Date 8", "$900", "45"],
        ["Job 9", "Client 9", "Start Date 9", "$1000", "50"],
        ["Job 10", "Client 10", "Start Date 10", "$1100", "55"],
        ["Job 11", "Client 11", "Start Date 11", "$1200", "60"],
        ["Job 12", "Client 12", "Start Date 12", "$1300", "65"],
        ["Job 13", "Client 13", "Start Date 13", "$1400", "70"],
        ["Job 14", "Client 14", "Start Date 14", "$1500", "75"],
        ["Job 15", "Client 15", "Start Date 15", "$1600", "80"],
    ];
    const headerCellStyle: string = "border-2 border-black";
    const cellStyle: string = "border border-black";
    return (
        <>
            <table className="w-[100%] ">
                <thead>
                    <tr className="border border-black">
                        <th className={headerCellStyle}>Job</th>
                        <th className={headerCellStyle}>Client</th>
                        <th className={headerCellStyle}>Start Date</th>
                        <th className={headerCellStyle}>Net Earnings</th>
                        <th className={headerCellStyle}># Trips</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (

                        <tr key={index} className="border border-black">

                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className={cellStyle}><a href="/job"> {cell}</a></td>
                            ))}

                        </tr >
                    ))
                    }
                </tbody>
            </table >
        </>
    )
}

export default JobTable