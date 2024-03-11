import React, {useEffect, useState} from 'react';
import { IonContent,IonCard, IonPage, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton } from '@ionic/react';

const BloodPressureCalculator = () => {
    const [age, setAge] = useState(25);
    const [sex, setSex] = useState('Male');
    const [weight, setWeight] = useState(70); // 以公斤为单位
    const [height, setHeight] = useState(175); // 以厘米为单位
    const [position, setPosition] = useState('Sitting');
    const [heartRate, setHeartRate] = useState(75); // 心率，每分钟跳动次数
    const [bloodPressure, setBloodPressure] = useState({ systolic: 0, diastolic: 0 });

    const calculateBloodPressure = () => {
        const R = 18.5; // 假定的血管阻力
        const Q = (sex === "Male" || sex === "M") ? 5 : 4.5; // 每分钟通过心脏的血量，男性或女性的不同值
        const ejectionTime = position !== "Laying Down" ? 386 - 1.64 * heartRate : 364.5 - 1.23 * heartRate;
        const bodySurfaceArea = 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
        const strokeVolume = -6.6 + 0.25 * (ejectionTime - 35) - 0.62 * heartRate + 40.4 * bodySurfaceArea - 0.51 * age;
        const pulsePressure = strokeVolume / ((0.013 * weight - 0.007 * age - 0.004 * heartRate) + 1.307);
        const meanPulsePressure = Q * R;

        const systolicPressure = Math.round(meanPulsePressure + (3 / 2) * pulsePressure);
        const diastolicPressure = Math.round(meanPulsePressure - pulsePressure / 3);

        setBloodPressure({ systolic: systolicPressure, diastolic: diastolicPressure });
            const data = JSON.stringify({
                pressure: systolicPressure,
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

    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Blood Pressure Calculator</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding blood-pressure-content">
                    <IonContent>
                        <IonItem>
                            <IonLabel position="floating">Age</IonLabel>
                            <IonInput type="number" value={age} onIonChange={e => setAge(e.detail.value)} />
                        </IonItem>
                        <IonItem>
                            <IonLabel>Sex</IonLabel>
                            <IonSelect value={sex} onIonChange={e => setSex(e.detail.value)}>
                                <IonSelectOption value="Male">Male</IonSelectOption>
                                <IonSelectOption value="Female">Female</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Weight (kg)</IonLabel>
                            <IonInput type="number" value={weight} onIonChange={e => setWeight(e.detail.value)} />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Height (cm)</IonLabel>
                            <IonInput type="number" value={height} onIonChange={e => setHeight(e.detail.value)} />
                        </IonItem>
                        <IonItem>
                            <IonLabel>Position</IonLabel>
                            <IonSelect value={position} onIonChange={e => setPosition(e.detail.value)}>
                                <IonSelectOption value="Sitting">Sitting</IonSelectOption>
                                <IonSelectOption value="Standing">Standing</IonSelectOption>
                                <IonSelectOption value="Laying Down">Laying Down</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Heart Rate (BPM)</IonLabel>
                            <IonInput type="number" value={heartRate} onIonChange={e => setHeartRate(e.detail.value)} />
                        </IonItem>
                        <IonButton expand="block" onClick={calculateBloodPressure} style={{marginTop:'1.5rem'}}>Calculate Blood Pressure</IonButton>

                        {bloodPressure.systolic !== 0 && (
                            <IonCard style={{marginTop:'.5rem'}}>
                                <div className="result-display">
                                <h3 style={{marginLeft:'5%',color:'black'}}>Calculated Blood Pressure</h3>
                                <p style={{marginLeft:'5%',color:'black'}}>Systolic: {bloodPressure.systolic} mmHg</p>
                                <p style={{marginLeft:'5%',color:'black'}}>Diastolic: {bloodPressure.diastolic} mmHg</p>
                                </div>
                            </IonCard>
                        )}
                    </IonContent>
            </IonContent>
        </IonPage>
    );
};

export default BloodPressureCalculator;
