import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonContent,
    IonItem,
    IonLabel,
    IonToggle,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonModal,
    IonInput,
    IonDatetime
} from '@ionic/react';
import './Tab2.css';

const Tab2 = () => {
    const [alarms, setAlarms] = useState([
        { time: '09:00', label: 'heart rate', isEnabled: false },
        { time: '09:00', label: 'blood pressure', isEnabled: false },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newAlarmTime, setNewAlarmTime] = useState('');
    const [newAlarmLabel, setNewAlarmLabel] = useState('');
    const [audio] = useState(new Audio(process.env.PUBLIC_URL + '/alert.mp3'));
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioLoaded, setIsAudioLoaded] = useState(false);

    useEffect(() => {
        audio.onloadeddata = () => {
            setIsAudioLoaded(true);
        };
        audio.onerror = (e) => {
            console.error("音频加载失败", e);
        };
    }, [audio]);

    useEffect(() => {
        const interval = setInterval(() => {
            alarms.forEach((alarm, index) => {
                if (alarm.isEnabled) {
                    const now = new Date();
                    const alarmTime = new Date();
                    const [hours, minutes] = alarm.time.split(':');
                    alarmTime.setHours(hours, minutes, 0);

                    if (now.getHours() === alarmTime.getHours() && now.getMinutes() === alarmTime.getMinutes() && !isPlaying) {
                        playAudio(index);
                    }
                }
            });
        }, 1000); // 每秒检查一次时间

        return () => clearInterval(interval);
    }, [alarms, audio, isPlaying]);

    const playAudio = (index) => {
        if (isAudioLoaded ) {
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                    setTimeout(() => {
                        audio.pause();
                        setIsPlaying(false);
                        toggleAlarm(index, false);
                    }, 60000);
                })
                .catch(error => {
                    console.error("播放音频失败:", error);
                });
        } else {
            console.error("音频未加载");
        }
    };

    const stopAudio = () => {
        audio.pause();
        setIsPlaying(false);
        const updatedAlarms = alarms.map(alarm => {
            return { ...alarm, isEnabled: false };
        });
        setAlarms(updatedAlarms);
    };

    const addAlarm = () => {
        const newAlarm = {
            time: newAlarmTime.split('T')[1].slice(0, 5),
            label: newAlarmLabel,
            isEnabled: true
        };
        setAlarms([...alarms, newAlarm]);
        setShowModal(false);
    };

    const toggleAlarm = (index, value = null) => {
        const updatedAlarms = [...alarms];
        if (value !== null) {
            updatedAlarms[index].isEnabled = value;
        } else {
            updatedAlarms[index].isEnabled = !updatedAlarms[index].isEnabled;
        }
        setAlarms(updatedAlarms);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Reminder</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    {alarms.map((alarm, index) => (
                        <IonItem key={index} lines="full">
                            <IonLabel>
                                <h2>{alarm.time}</h2>
                                <p>{alarm.label}</p>
                            </IonLabel>
                            <IonToggle checked={alarm.isEnabled} onIonChange={() => toggleAlarm(index)} />
                        </IonItem>
                    ))}
                </IonList>
                <IonButton expand="block" fill="#02796b"  onClick={() => setShowModal(true)}>
                    Add new tip
                </IonButton>
                <IonModal isOpen={showModal}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Set new reminder</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonItem>
                            <IonLabel position="floating" style={{marginTop:'.7rem'}}>reminder time</IonLabel>
                            <IonDatetime
                                displayFormat="HH:mm"
                                value={newAlarmTime}
                                onIonChange={e => setNewAlarmTime(e.detail.value)}
                                style={{marginTop:'2rem'}}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Reminder label</IonLabel>
                            <IonInput
                                value={newAlarmLabel}
                                onIonChange={e => setNewAlarmLabel(e.detail.value)}
                            />
                        </IonItem>
                        <IonButton expand="block" onClick={addAlarm} style={{marginBottom:'.5rem'}}>Add reminder</IonButton>
                        <IonButton expand="block" color="light" onClick={() => setShowModal(false)}>Cancel</IonButton>
                    </IonContent>
                </IonModal>
                {isPlaying && (
                    <IonButton expand="block" onClick={stopAudio}>Turn off alarm</IonButton>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Tab2;
