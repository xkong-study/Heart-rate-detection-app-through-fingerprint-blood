import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonIcon,
    IonItem, IonInput, IonSelectOption, IonSelect
} from '@ionic/react';
import { useHistory } from "react-router-dom";
import './Tab4.css';
import image from './mobile.png';
import {heartCircle, heartHalf, heartDislike, bookmarkOutline} from "ionicons/icons";
import { Line } from 'react-chartjs-2';

const Tab4 = () => {
    const history = useHistory();
    const [selectedSegment, setSelectedSegment] = useState('heart-rate');
    const [data, setData] = useState({
        heartRate: [],
        hrv: [],
        bloodPressure: []
    });

    const [IsShow, setShow] = useState('none')
    const [showAddRecordForm, setShowAddRecordForm] = useState(false);
    const [newRecordValue, setNewRecordValue] = useState('');
    const [patients, setPatients] = useState([]);
    const [currentPatientName, setCurrentPatientName] = useState('xkong');
    const [advice, setAdvice] = useState('');
    const [advice1, setAdvice1] = useState('');
    const [doctor, setDoctor] = useState('');

    useEffect(() => {
        const fetchPatientsByDoctor = async () => {
            const doctorName = localStorage.getItem('doctor');
            if (!doctorName) {
                console.log('No doctor name found in localStorage');
                return;
            }

            try {
                const response = await fetch(`/user/listPatients/${doctorName}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const patients = await response.json();
                let set = new Set();
                patients.forEach((i)=> {
                    set.add(i.name);
                });
                setPatients(Array.from(set));
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchPatientsByDoctor();
    }, []); // Add d

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://192.168.0.63:8084/user/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                const filteredResult = result.filter(item => item.name === currentPatientName);

                let set2 = new Set();
                let arr = [];
                result.filter(i =>{
                    if(inpm.name === currentPatientName) {
                        if (!set2.has(i.status)) arr.push(i.doctor);
                        set2.add(i.status);
                    }
                });
                setAdvice1(Array.from(set2));
                setDoctor(arr);

                const formattedData = filteredResult.reduce((acc, item) => {
                    if (item.heartRate && item.heartRate !== 0) {
                        acc.heartRate.push({ value: item.heartRate, time: item.recordDate });
                    }
                    if (item.hrv && item.hrv !== 0) {
                        acc.hrv.push({ value: item.hrv, time: item.recordDate });
                    }
                    if (item.pressure && item.pressure !== 0) {
                        acc.bloodPressure.push({ value: item.pressure, time: item.recordDate });
                    }
                    return acc;
                }, { heartRate: [], hrv: [], bloodPressure: [] });

                setData(formattedData);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchData();
    }, [showAddRecordForm, currentPatientName]);

    const submitAdvice = async () => {
        const doctorName = localStorage.getItem('doctor'); // Or however you're determining the doctor's name

        try {
            const response = await fetch('/user/sendAdvice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: currentPatientName, // Assuming this is the patient's name
                    status: advice,
                    doctorName: doctorName, // Add this field according to your backend expectation
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);
            setAdvice(''); // Clear advice input after successful submission
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., show an error message)
        }
    };

    useEffect(() => {
        if (data == null) {
            setShow('');
        }
    }, [data])

    const handleHistoryClick = () => {
        setShowAddRecordForm(true);
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                stepSize: 20,
                max: Math.ceil(Math.max(...data.heartRate.map(record => record.value)) / 20) * 20,
            },
        },
    };


    const handleSegmentChange = (e) => {
        const newValue = e.detail.value;
        setSelectedSegment(newValue);
        setShowAddRecordForm(false);
    };


    const handleAddRecord = () => {
        let parameterKey= '';
        switch (selectedSegment) {
            case 'heart-rate':
                parameterKey = 'heartRate';
                break;
            case 'blood-pressure':
                parameterKey = 'pressure';
                break;
            case 'blood-oxygen':
                parameterKey = 'hrv';
                break;
            default:
                console.error('Unknown segment');
                return; // 在未知情况下退出函数
        }

        const data = JSON.stringify({
            [parameterKey]: newRecordValue,
        });

        fetch('http://192.168.0.63:8084/user/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.error('Error:', error));
        setShowAddRecordForm(false);
        setNewRecordValue('');
    };

    const getChartData = () => {
        const labels = data.heartRate.map(record => {
            const timestamp = record.time;
            const date = new Date(timestamp);

            // Example: MM-dd HH:mm:ss
            const formattedTime = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

            return formattedTime;
        });

        const dataSet = data.heartRate.map(record => record.value);

        return {
            labels,
            datasets: [
                {
                    label: 'Heart Rate',
                    data: dataSet,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }
            ]
        };
    };

    const renderContent = () => {
        let records = [];
        switch (selectedSegment) {
            case 'heart-rate':
                records = data.heartRate.map((record, index) => (
                   <div>
                       <div key={index} className="record" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                           <span>Heart Rate: {record.value}</span>
                           <span>Date: {record.time}</span>
                       </div>
                   </div>
                ));
                break;
            case 'blood-pressure':
                records = data.bloodPressure.map((record, index) => (
                    <div key={index} className="record" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                        <span>Blood Pressure: {record.value}</span>
                        <span>Date: {record.time}</span>
                    </div>
                ));
                break;
            case 'blood-oxygen':
                records = data.hrv.map((record, index) => (
                    <div key={index} className="record" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                        <span>Blood Oxygen: {record.value}</span>
                        <span>Date: {record.time}</span>
                    </div>
                ));
                break;
            default:
                records = <div>No Data Available</div>;
                break;
        }
        return (
            <IonCard className="custom-card" style={{ position: 'relative', height: '90%' }}> {/* 确保 IonCard 占据足够的高度 */}
                <IonCardHeader className="ion-text-center">
                    <img src={image} alt="提示" className="card-image" style={{ display: IsShow }} />
                </IonCardHeader>
                <IonCardContent style={{ overflowY: 'auto', height: 'calc(80%)' }}>
                    {records}
                    {renderAddRecordForm()}
                </IonCardContent>
                <IonButton
                    expand="block"
                    onClick={handleHistoryClick}
                    style={{
                        position: 'absolute',
                        bottom: '2%',
                        left: '4.5%',
                        width: '90%'
                    }}
                >
                    Add Record
                </IonButton>
            </IonCard>
        );
    };

    const renderAddRecordForm = () => {
        if (!showAddRecordForm) return null;

        let recordType = '';
        switch (selectedSegment) {
            case 'heart-rate':
                recordType = 'Heart Rate';
                break;
            case 'blood-pressure':
                recordType = 'Blood Pressure';
                break;
            case 'blood-oxygen':
                recordType = 'HRV';
                break;
            default:
                break;
        }

        return (
            <div style={{ position: 'absolute', bottom: '5%', width: '91%',border:'2px solid',borderColor:'green',borderRadius:'2px' }}>
            <IonItem>
                <IonLabel position="floating" style={{ flex: 1 }}>{recordType}</IonLabel>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IonInput value={newRecordValue} onIonChange={e => setNewRecordValue(e.detail.value)} type="number" style={{ flex: 2 }} />
                    <IonButton expand="block" onClick={handleAddRecord} style={{ flex: 1 }}>Submit</IonButton>
                </div>
            </IonItem>
            </div>
        );
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Measurement History</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {
                    localStorage.getItem('doctor')?
                <IonSelect value={currentPatientName} onIonChange={e => setCurrentPatientName(e.detail.value)}>
                    {patients.map((patient, index) => (
                        <IonSelectOption key={index} value={patient}>
                            {patient}
                        </IonSelectOption>
                    ))}
                </IonSelect>
                        : null
                }
                <IonSegment onIonChange={handleSegmentChange} value={selectedSegment} style={{ width: '90%', margin: '5%' }}>
                    <IonSegmentButton value="heart-rate">
                        <IonIcon icon={heartCircle} color="green" />
                        <IonLabel style={{ fontSize: '.6rem' }}>Heart Rate</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="blood-pressure">
                        <IonIcon icon={heartHalf} color="green" />
                        <IonLabel style={{ fontSize: '.6rem' }}>Blood Pressure</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="blood-oxygen">
                        <IonIcon icon={heartDislike} color="green" />
                        <IonLabel style={{ fontSize: '.6rem' }}>Blood HRV</IonLabel>
                    </IonSegmentButton>
                </IonSegment>
                {selectedSegment === 'heart-rate' ? <div className="chart-container"><Line data={getChartData()} options={chartOptions} /></div> : null}
                    {renderContent()}
                {
                    localStorage.getItem('doctor')?
                        <div>
                            <IonItem>
                                <IonLabel position="stacked" style={{ fontWeight: 'bold' }}>Advice</IonLabel>
                                <IonInput
                                    value={advice}
                                    onIonChange={e => setAdvice(e.detail.value)}
                                    style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', width: '100%', boxSizing: 'border-box' }}
                                ></IonInput>
                                <IonIcon icon={bookmarkOutline} slot="start" style={{ color: '#007bff', marginRight: '10px' }}></IonIcon>
                            </IonItem>
                            <IonButton onClick={submitAdvice} style={{marginLeft:"72%",width:"25%",fontSize:"12px"}}>Submit Advice</IonButton>
                        </div> :<div style={{ border: '2px solid #ccc', borderRadius: '5px', padding: '20px', margin: '15px' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>doctor's orders：</div>
                                    <div>{advice1}</div>
                                </div>
                                <div style={{marginTop:'10px'}}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>doctor：</div>
                                    <div>{doctor[0]}</div>
                                </div>
                        </div>

                }
            </IonContent>
        </IonPage>
    );
};

export default Tab4;
