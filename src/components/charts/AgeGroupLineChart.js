import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AgeGroupLineChart = ({ data }) => {
    console.log("AgeGroupLineChart");
    console.log(data);

    const legendFormatter = (value) => (
        <span style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
            {value}
        </span>
    );

    return (
        <div style={{ width: '100%' }}>
            <h3 align="left" >
                Subgroup Analysis across AgeGroup
            </h3>
            <div style={{ marginTop: '15%' }}>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={data
                    .map((d) => ({
                        ...d,
                        "True Positive Rate": d["True Positive Rate"] * 100,
                        "True Negative Rate": d["True Negative Rate"] * 100,
                        "False Positive Rate": d["False Positive Rate"] * 100,
                        "False Negative Rate": d["False Negative Rate"] * 100,
                    }))
                    .sort((a, b) => a.Subgroup.localeCompare(b.Subgroup))
                    }
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                    dataKey="Subgroup"
                    type="category"
                    label={{ value: "Age Group", position: "insideBottomRight", offset: -5 }}
                    />
                    <YAxis
                    domain={[0, 120]}
                    ticks={[0, 20, 40, 60, 80, 100, 120]}
                    label={{ value: "Rate (%)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend formatter={legendFormatter} />
                    <Line type="monotone" dataKey="True Positive Rate" stroke="#ff0000" name="True Positive Rate" />
                    <Line type="monotone" dataKey="True Negative Rate" stroke="#cc8400" name="True Negative Rate" />
                    <Line type="monotone" dataKey="False Positive Rate" stroke="#0000ff" name="False Positive Rate" />
                    <Line type="monotone" dataKey="False Negative Rate" stroke="#ff00ff" name="False Negative Rate" />
                </LineChart>
                </ResponsiveContainer>

            </div>
        </div>
    );
};

export default AgeGroupLineChart;
