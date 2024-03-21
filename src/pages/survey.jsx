import React, { useState, useEffect } from 'react';
import {
    IonAlert,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    IonToggle,
} from '@ionic/react';

const Survey = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [age, setAge] = useState('');
    const [restingHeartRate, setRestingHeartRate] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [smokingStatus, setSmokingStatus] = useState(false);
    const [healthTips, setHealthTips] = useState('');

    const totalSteps = 5; // Number of questions + 1 for health tips

    useEffect(() => {
        if (currentStep === 5) {
            generateHealthTips();
        }
    }, [currentStep]); // This effect depends on currentStep.

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

    const generateHealthTips = () => {
        let tips = "Health Tips: ";
        if (!age || !restingHeartRate) {
            return;
        }
        const ageNum = parseInt(age, 10);
        const heartRateNum = parseInt(restingHeartRate, 10);

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

        setHealthTips(tips);
    };

    const getProgress = () => ((currentStep / totalSteps) * 100).toFixed(0);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <IonItem>
                        <IonLabel position="floating">Age</IonLabel>
                        <IonInput type="number" value={age} onIonChange={e => setAge(e.detail.value)}></IonInput>
                    </IonItem>
                );
            case 2:
                return (
                    <IonItem>
                        <IonLabel position="floating">Resting Heart Rate (beats per minute)</IonLabel>
                        <IonInput type="number" value={restingHeartRate} onIonChange={e => setRestingHeartRate(e.detail.value)}></IonInput>
                    </IonItem>
                );
            case 3:
                return (
                    <IonItem>
                        <IonLabel>Activity Level</IonLabel>
                        <IonSelect placeholder="Select One" value={activityLevel} onIonChange={e => setActivityLevel(e.detail.value)}>
                            <IonSelectOption value="high">High (Regular intense physical activity)</IonSelectOption>
                            <IonSelectOption value="moderate">Moderate (Occasional moderate physical activity)</IonSelectOption>
                            <IonSelectOption value="low">Low (Little to no physical activity)</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                );
            case 4:
                return (
                    <IonItem>
                        <IonLabel>Smoker</IonLabel>
                        <IonToggle checked={smokingStatus} onIonChange={e => setSmokingStatus(e.detail.checked)}></IonToggle>
                    </IonItem>
                );
            case 5:
                return (
                    <div style={{
                        marginTop: 20,
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#ffffff',
                        color: '#333',
                        lineHeight: '1.6',
                        fontSize: '16px'
                    }}>
                        {healthTips}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Heart Health Survey</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="progress-container" style={{ width: '100%', backgroundColor: '#e0e0de', borderRadius: '5px', margin: '20px 0' }}>
                    <div className="progress-bar" style={{ width: `${getProgress()}%`, backgroundColor: '#4caf50', height: '10px', borderRadius: '5px' }}></div>
                </div>
                {renderStep()}
                <div style={{ marginTop: 50,margin:'3%' }}>
                    {currentStep > 1 && <IonButton onClick={prevStep} style={{marginRight:150,width:'25%'}}>Back</IonButton>}
                    {currentStep < totalSteps && <IonButton onClick={nextStep} style={{width:'25%'}}>Next</IonButton>}
                    {currentStep === totalSteps && <IonButton onClick={() => window.location.reload()}>Finish</IonButton>}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Survey;
