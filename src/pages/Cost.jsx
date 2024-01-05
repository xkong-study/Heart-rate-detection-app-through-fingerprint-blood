import React from 'react';
import { useLocation } from 'react-router-dom';
import './Cost.css'; // Stylesheet
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import {IonContent, IonHeader, IonPage} from "@ionic/react";
// Register the required components for Chart.js
ChartJS.register(...registerables);

const Cost = () => {
    const location = useLocation();
    // Accessing the passed state parameters using location.state
    const {
        heartRate,
        hrvEstimate,
        heartRates,
        normalRatePercentage,
        tachycardiaPercentage,
        bradycardiaPercentage
    } = location.state || {
        heartRate: 'N/A',
        hrvEstimate: 'N/A',
        heartRates: [],
        normalRatePercentage: 0,
        tachycardiaPercentage: 0,
        bradycardiaPercentage: 0
    };

    console.log(heartRates)
    const chartData = {
        datasets: [{
            label: 'Normal Heart',
            data: heartRates.map((value, index) => ({ x: index, y: value })).filter(hr => hr.y > 60 && hr.y < 120),
            backgroundColor: '#02796b',
            pointStyle: 'rect'
        }, {
            label: 'Fast Heart',
            data: heartRates.map((value, index) => ({ x: index, y: value })).filter(hr => hr.y > 120),
            backgroundColor: '#c2175b',
            pointStyle: 'triangle'
        }, {
            label: 'Slow Heart',
            data: heartRates.map((value, index) => ({ x: index, y: value })).filter(hr => hr.y < 60),
            backgroundColor: '#0273c2',
            pointStyle: 'rectRot'
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    // Function to get the current date and time
    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toLocaleString('en-US', {
            weekday: 'long', // Monday, Tuesday, ...
            year: 'numeric', // 2023
            month: 'long', // January, February, ...
            day: 'numeric', // 1, 2, ...
            hour: '2-digit', // 01, 02, ..., 12
            minute: '2-digit', // 01, 02, ..., 59
            hour12: true // AM/PM
        });
    };
    return (
        <IonPage>
            <IonHeader>
            </IonHeader>
            <IonContent fullscreen className="center-card">
        <ion-content className="cost-container" color="tertiary">
            <div className="cost-header">
                <h1 className="date-time-header">{getCurrentDateTime()}</h1>
            </div>
            <div className="cost-stat">
                <div className="cost-stat-title">Heart Rate</div>
                <div className="cost-stat-value">{heartRate} BPM</div>
                <div className="cost-stat-description">Normal</div>
                <div className="cost-stat-footer">For most adults, a normal resting heart rate ranges from 60 to 100 beats per minute (BPM). Factors such as stress, anxiety, medications, physical activity, and more can affect heart rate.</div>
            </div>
            <div className="cost-stat">
                <div className="cost-stat-title">HRV</div>
                <div className="cost-stat-value">{hrvEstimate} ms</div>
                <div className="cost-stat-description">Good</div>
                <div className="cost-stat-footer">Heart Rate Variability (HRV) represents the variation in time between each heartbeat. While HRV can vary from person to person due to factors like age, weight, and general wellbeing, consistently low HRV, even within normal ranges, may indicate an increased stress response in the autonomic nervous system and an increased risk of health issues.</div>
            </div>
            <div className="card" style={{margin:'auto',width: '90%',borderRadius:'2%',height:'41%'}}>
                <div style={{ marginLeft:'1rem', position: 'relative' }}>
                    <Scatter data={chartData} options={{ ...options, maintainAspectRatio: false }} height={350} width={500}/>
                </div>
                <div className="legend-container">
                    <div className="legend-item">
                        <span className="legend-color-box" style={{ backgroundColor: '#02796b' }}></span>
                        <span className="legend-text">Normal Heart Rate</span>
                        <span className="legend-percentage" style={{ color: '#02796b' }}>{Math.floor(normalRatePercentage)}%</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color-box" style={{ backgroundColor: '#c2175b' }}></span>
                        <span className="legend-text">Fast Heart Rate</span>
                        <span className="legend-percentage" style={{ color: '#c2175b' }}>{Math.floor(tachycardiaPercentage)}%</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color-box" style={{ backgroundColor: '#0273c2' }}></span>
                        <span className="legend-text">Slow Heart Rate</span>
                        <span className="legend-percentage" style={{ color: '#0273c2' }}>{Math.floor(bradycardiaPercentage)}%</span>
                    </div>
                </div>
            </div>
        </ion-content>
            </IonContent>
        </IonPage>
    );
};

export default Cost;
