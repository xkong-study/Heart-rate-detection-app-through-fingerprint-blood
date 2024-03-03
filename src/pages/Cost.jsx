import React from 'react';
import { useLocation } from 'react-router-dom';
import './Cost.css';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

// Register the required components for Chart.js
ChartJS.register(...registerables);

const Cost = () => {
    const location = useLocation();
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

    const getHeartRateAdvice = (hr) => {
        if (hr < 60) {
            return "Your resting heart rate is below the normal range. This could be a sign of being well-trained if you're an athlete. Otherwise, consider consulting a healthcare provider.";
        } else if (hr > 100) {
            return "Your resting heart rate is above the normal range. This may indicate a high level of stress or a potential medical condition. Consider checking with a healthcare provider.";
        } else {
            return "Your resting heart rate is within the normal range, indicating good heart health. Continue maintaining a healthy lifestyle.";
        }
    };

    const getHRVAdvice = (hrv) => {
        if (hrv < 30) {
            return "Your HRV is lower than average, which might suggest potential stress or underlying health issues. Consider monitoring changes and consulting with a healthcare provider.";
        } else if (hrv > 60) {
            return "Your HRV is higher than average, indicating good autonomic nervous system balance and resilience to stress. Keep up the good work with your health habits!";
        } else {
            return "Your HRV is within a normal range, suggesting a balanced autonomic nervous system. Continue monitoring any significant changes over time.";
        }
    };

    // Call the advice functions with the actual heart rate and HRV values
    const heartRateAdvice = getHeartRateAdvice(parseInt(heartRate));
    const hrvAdvice = getHRVAdvice(parseInt(hrvEstimate));

    const chartData = {
        datasets: [{
            label: 'Heart Rate Over Time',
            data: heartRates.map((value, index) => ({ x: index, y: value })),
            backgroundColor: 'rgba(75,192,192,1)',
        }]
    };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Heart Rate (BPM)'
                }
            }
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Heart Health Analysis</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <div className="analysis-container">
                    <h2>Heart Rate & HRV Analysis</h2>
                    <div className="advice">
                        <p><strong>Heart Rate Advice:</strong> {heartRateAdvice}</p>
                        <p><strong>HRV Advice:</strong> {hrvAdvice}</p>
                    </div>
                    <div className="chart-container">
                        <Scatter data={chartData} options={options} />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Cost;
