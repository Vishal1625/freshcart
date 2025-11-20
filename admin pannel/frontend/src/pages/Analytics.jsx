
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer
} from 'recharts'

export default function Analytics() {

    const user = JSON.parse(localStorage.getItem('authUser') || 'null')
    const [data, setData] = useState([])

    useEffect(() => {
        fetch("http://localhost:5000/api/analytics/revenue-daily")
            .then(res => res.json())
            .then(data => setData(data))
    }, [])

    const doLogout = () => {
        localStorage.removeItem('authUser');
        window.location.href = '/login';
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar onLogout={doLogout} />
            <div style={{ flex: 1 }}>
                <Topbar user={user} />

                <div style={{ padding: 18 }}>
                    <div style={{ background: '#f3f3f3ff', padding: 16, borderRadius: 10 }}>

                        <h4>Revenue by day</h4>

                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={data}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="total" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
