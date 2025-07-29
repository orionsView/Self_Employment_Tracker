import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Line
} from 'recharts';
import { useMemo } from 'react';

type DataPoint = {
    label: string;
    net_income: number;
    earnings?: number;
    expenses?: number;
};

function calculateLinearRegression(data: DataPoint[]) {
    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data.map(d => d.net_income);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return null;

    const m = (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / n;

    // Generate trend line data points
    return x.map(xi => ({
        index: xi,
        value: m * xi + b,
    }));
}

export default function BarGraph({ data, showExpenses = false, showEarnings = false, showTrend = false }: { data: any, showExpenses?: boolean, showEarnings?: boolean, showTrend?: boolean }) {
    const mergedData = useMemo(() => {
        const linePoints = calculateLinearRegression(data);
        if (!linePoints) return data;

        return data.map((item: any, i: number) => ({
            ...item,
            trend: linePoints[i].value
        }));
    }, [data]);
    return (
        <ResponsiveContainer width="100%" height={"75%"}>
            <BarChart
                data={mergedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ textAnchor: 'middle', fontSize: 12 }
                    // tickFormatter={(value: string) => value.slice(0, 3)
                } /> {/* label = "July-week1", etc. */}
                <YAxis
                    domain={[
                        (dataMin: number) => {
                            const min = (Math.floor(dataMin / 100) * 100)
                            return min < 0 ? min : 0
                        },
                        (dataMax: number) => Math.ceil((dataMax + 50) / 100) * 100  // round up to nearest 100 with +50 buffer

                    ]}
                    allowDataOverflow={true}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                />

                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke="#000" strokeWidth={1} />
                <Bar dataKey="net_income" fill="#82ca9d" name="Net Income" />
                {/* Optional: show both earnings & expenses for context */}
                {showEarnings && <Bar dataKey="earnings" fill="#8884d8" name="Earnings" />}
                {showExpenses && <Bar dataKey="expenses" fill="#ff7373" name="Expenses" />}

                {/* Trend line */}
                {showTrend && <Line
                    type="linear"
                    dataKey="trend"
                    stroke="#ff7300"
                    strokeWidth={2}
                    dot={false}
                    name="Trend Line"
                />
                }
            </BarChart>
        </ResponsiveContainer>
    );
}

