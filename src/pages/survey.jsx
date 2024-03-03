import React, { useState } from 'react';
import {
    IonAlert,
    IonButton,
    IonContent,
    IonHeader, IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonPage, IonSelect, IonSelectOption,
    IonTitle, IonToggle,
    IonToolbar
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import App from "./camera";

const activityLevels = [
    [
        { label: 'High (Regular intense physical activity)', value: 'high' },
        { label: 'Moderate (Occasional moderate physical activity)', value: 'moderate' },
        { label: 'Low (Little to no physical activity)', value: 'low' },
    ]
];

const Survey = () => {
    const [age, setAge] = useState('');
    const [restingHeartRate, setRestingHeartRate] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [smokingStatus, setSmokingStatus] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [healthTips, setHealthTips] = useState('');
    const history = useHistory();
    const generateHealthTips = () => {
        let tips = "Health Tips: ";
        if (!age || !restingHeartRate) {
            return;
        }
        const ageNum = parseInt(age);
        const heartRateNum = parseInt(restingHeartRate);

        if (ageNum >= 45 || smokingStatus) {
            tips += "Given your age or smoking status, regular cardiovascular check-ups are recommended. ";
        }

        if (heartRateNum < 60) {
            tips += "Your resting heart rate is below the normal range; this could be a sign of being well-trained if you're an athlete. Otherwise, consider consulting a healthcare provider. ";
        } else if (heartRateNum > 100) {
            tips += "Your resting heart rate is above the normal range; this may indicate a high level of stress or a medical condition that should be checked by a healthcare provider. ";
        } else {
            tips += "Your resting heart rate is within the normal range. ";
        }

        if (smokingStatus) {
            tips += "Smoking is a major risk factor for cardiovascular diseases. Quitting smoking can significantly reduce your risk of heart disease and improve your overall health. ";
        } else {
            tips += "Not smoking is beneficial to your heart health. Keep up the good work avoiding tobacco products. ";
        }

        switch (activityLevel) {
            case 'low':
                tips += "Increasing daily physical activity can improve heart health and reduce heart disease risk. ";
                break;
            case 'moderate':
                tips += "Maintaining your current level of physical activity is good, but more intense activities could bring additional benefits. ";
                break;
            case 'high':
                tips += "Your high level of physical activity is beneficial to your heart health. Keep it up! ";
                break;
            default:
                break;
        }

        if (smokingStatus) {
            tips += "Smoking is a major risk factor for heart diseases; quitting smoking can significantly reduce your risk. ";
        }

        setHealthTips(tips);
    };

    function refreshWindow() {
        window.location.reload();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Heart Health Survey</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    <IonListHeader>Please complete the survey</IonListHeader>
                    <IonItem>
                        <IonLabel position="floating">Age</IonLabel>
                        <IonInput type="number" value={age} onIonChange={e => setAge(e.detail.value)}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Resting Heart Rate (beats per minute)</IonLabel>
                        <IonInput type="number" value={restingHeartRate} onIonChange={e => setRestingHeartRate(e.detail.value)}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Activity Level</IonLabel>
                        <IonSelect placeholder="Select One" value={activityLevel} onIonChange={e => setActivityLevel(e.detail.value)}>
                            <IonSelectOption value="high">High (Regular intense physical activity)</IonSelectOption>
                            <IonSelectOption value="moderate">Moderate (Occasional moderate physical activity)</IonSelectOption>
                            <IonSelectOption value="low">Low (Little to no physical activity)</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Smoker</IonLabel>
                        <IonToggle checked={smokingStatus} onIonChange={e => setSmokingStatus(e.detail.checked)}></IonToggle>
                    </IonItem>
                    <IonButton expand="block" onClick={generateHealthTips} >Submit</IonButton>
                    <IonButton expand="block" onClick={refreshWindow}>Go Back</IonButton>                </IonList>
                {healthTips && <div style={{ marginTop: 20 }}>{healthTips}</div>}
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={'Alert'}
                    message={'Please answer all questions.'}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default Survey;
