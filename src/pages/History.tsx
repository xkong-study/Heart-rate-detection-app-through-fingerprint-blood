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
    IonItem, IonInput
} from '@ionic/react';
import { useHistory } from "react-router-dom";
import './Tab4.css';
import image from './mobile.png';
import { heartCircle, heartHalf, heartDislike } from "ionicons/icons";

interface Record {
    value: number;
    time: string;
}

interface Data {
    heartRate: Record[];
    hrv: Record[];
    bloodPressure: Record[];
}

interface ApiResponseItem {
    heartRate?: number;
    hrv?: number;
    pressure?: number;
    recordDate: string;
}





const Tab4: React.FC = () => {
    const history = useHistory();
    const [selectedSegment, setSelectedSegment] = useState('heart-rate');
    const [data, setData] = useState<Data>({
        heartRate: [],
        hrv: [],
        bloodPressure: []
    });

    const [IsShow, setShow] = useState('none')
    const [showAddRecordForm, setShowAddRecordForm] = useState(false);
    const [newRecordValue, setNewRecordValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8084/user/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        // 在此处添加其他需要的请求头
                    },
                    body: JSON.stringify({
                        // 这里填写你的请求体内容
                    })
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                const formattedData = result.reduce((acc: Data, item: ApiResponseItem) => {
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
    }, [showAddRecordForm]);

    useEffect(() => {
        if (data == null) {
            setShow('');
        }
    }, [data])

    const handleHistoryClick = () => {
        setShowAddRecordForm(true);
    };

    const handleSegmentChange = (e: CustomEvent) => {
        const newValue = e.detail.value;
        setSelectedSegment(newValue);
        setShowAddRecordForm(false); // 切换标签时隐藏添加记录表单
    };


    const handleAddRecord = () => {
        let parameterKey: string = ''; // 初始化为一个空字符串或合适的默认值
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

        fetch('http://localhost:8084/user/add', {
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

    const renderContent = () => {
        let records: JSX.Element[] | JSX.Element = [];
        switch (selectedSegment) {
            case 'heart-rate':
                records = data.heartRate.map((record, index) => (
                    <div key={index} className="record" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                        <span>Heart Rate: {record.value}</span>
                        <span>Date: {record.time}</span>
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
                <IonCardContent style={{ overflowY: 'auto', height: 'calc(100% - 70px)' }}> {/* 调整高度以适应按钮 */}
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
                    <IonInput value={newRecordValue} onIonChange={e => setNewRecordValue(e.detail.value!)} type="number" style={{ flex: 2 }} />
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

                {renderContent()}
            </IonContent>
        </IonPage>
    );
};

export default Tab4;