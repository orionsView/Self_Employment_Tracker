import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

export default function BarGraph({ data, showExpenses = false, showEarnings = false }: { data: any, showExpenses?: boolean, showEarnings?: boolean }) {

    return (
        <ResponsiveContainer width="100%" height={"75%"}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ textAnchor: 'middle', fontSize: 12 }
                    // tickFormatter={(value: string) => value.slice(0, 3)
                } /> {/* label = "July-week1", etc. */}
                <YAxis
                    domain={[
                        (dataMin: number) => Math.floor(dataMin / 100) * 100,
                        (dataMax: number) => Math.ceil((dataMax + 50) / 100) * 100  // round up to nearest 100 with +50 buffer

                    ]}
                    allowDataOverflow={true}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                />

                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
                <Bar dataKey="net_income" fill="#82ca9d" name="Net Income" />
                {/* Optional: show both earnings & expenses for context */}
                {showEarnings && <Bar dataKey="earnings" fill="#8884d8" name="Earnings" />}
                {showExpenses && <Bar dataKey="expenses" fill="#ff7373" name="Expenses" />}

            </BarChart>
        </ResponsiveContainer>
    );
}

// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// export default function BarGraph({ data }: { data: any[] }) {
//     return (
//         <ResponsiveContainer width="100%" height={300}>
//             <BarChart
//                 data={data}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//             >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="label" />
//                 <YAxis
//                     domain={[
//                         0,
//                         (dataMax: number) => Math.ceil((dataMax + 50) / 100) * 100,
//                     ]}
//                     tickFormatter={(value) => `$${value.toLocaleString()}`}
//                     allowDataOverflow={false}
//                 />
//                 <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
//                 <Legend />
//                 <Bar dataKey="net_income" fill="#82ca9d" name="Net Income" />

//                 {/* Vertical lines between weeks */}
//                 {data.map((entry) => (
//                     <ReferenceLine
//                         key={`ref-line-${entry.label}`}
//                         x={entry.label}
//                         stroke="#ccc"
//                         strokeDasharray="3 3"
//                         ifOverflow="visible"
//                     />
//                 ))}
//             </BarChart>
//         </ResponsiveContainer>
//     );
// }
