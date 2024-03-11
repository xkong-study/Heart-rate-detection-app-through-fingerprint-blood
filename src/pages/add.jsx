import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
} from '@ionic/react';

const AddRecord = () => {
    const [heartRate, setHeartRate] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [hrv, setHrv] = useState('');

    const handleSubmit = async () => {
        // Here, you can add your logic to send this data to your server or backend
        console.log({ heartRate, bloodPressure, hrv });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Add New Record</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonLabel position="floating">Heart Rate</IonLabel>
                    <IonInput value={heartRate} onIonChange={e => setHeartRate(e.detail.value)} type="number" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Blood Pressure</IonLabel>
                    <IonInput value={bloodPressure} onIonChange={e => setBloodPressure(e.detail.value)} type="number" />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">HRV (Heart Rate Variability)</IonLabel>
                    <IonInput value={hrv} onIonChange={e => setHrv(e.detail.value)} type="number" />
                </IonItem>
                <IonButton expand="block" onClick={handleSubmit}>Submit Record</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default AddRecord;
