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
import { LocalNotifications } from '@capacitor/local-notifications';

let count = 0;
const scheduleNotification = async (alarm) => {
    const now = new Date();
    const [hours, minutes] = alarm.time.split(':').map(Number); // 将字符串转换为数字
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    count+=1;
    if(count>1) return;
    await LocalNotifications.schedule({
        notifications: [
            {
                title: "Alarm",
                body: alarm.label,
                id: new Date().getTime(),
                schedule: { at: alarmTime },
                sound: 'default',
                attachments: null,
                actionTypeId: "",
                extra: null
            }
        ]
    });
};

LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
    console.log('Notification action performed', notification);
});


const Tab2 = () => {
    useEffect(() => {
        const requestAndSchedule = async () => {
            const permissionStatus = await LocalNotifications.requestPermissions();
            console.log(permissionStatus);
            const notifListener = LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
                console.log('Notification action performed', notification);
            });
            return () => {
                notifListener.remove();
            };
        };

        requestAndSchedule();
    }, []);

    const [alarms, setAlarms] = useState([
        { time: '09:00', label: 'heart rate', isEnabled: false },
        { time: '09:00', label: 'blood pressure', isEnabled: false },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newAlarmTime, setNewAlarmTime] = useState('');
    const [newAlarmLabel, setNewAlarmLabel] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);


    useEffect(() => {
        const interval = setInterval(() => {
            alarms.forEach((alarm, index) => {
                if (alarm.isEnabled) {
                    const now = new Date();
                    const alarmTime = new Date();
                    const [hours, minutes] = alarm.time.split(':');
                    alarmTime.setHours(hours, minutes, 0);

                    if (now.getHours() === alarmTime.getHours() && now.getMinutes()+1 === alarmTime.getMinutes()) {
                        scheduleNotification(alarm);
                    }
                }
            });
        }, 1000); // 每秒检查一次时间

        return () => clearInterval(interval);
    }, [alarms,isPlaying]);


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
            </IonContent>
        </IonPage>
    );
};

export default Tab2;
