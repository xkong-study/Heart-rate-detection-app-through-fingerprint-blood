import React, { useState } from 'react';
import axios from 'axios';
import { IonContent, IonPage, IonInput, IonButton, IonLabel, IonItem } from '@ionic/react';
import './account.css';

const Account = () => {
    // 状态管理
    const [email, setEmail] = useState('');
    const [name, setUsername] = useState('');
    const [signature, setSignature] = useState('');
    const [password, setPassword] = useState('');

    const handleUpdateProfile = async () => {
        try {
            const response = await axios.post('http://192.168.0.63:8084/user/update', {
                email: email,
                name: name,
                signature: signature,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                // 处理成功的情况
                console.log('Profile updated successfully');
            } else {
                // 处理非200响应
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error during API call', error);
        }
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput value={email} onIonChange={e => setEmail(e.detail.value)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Username</IonLabel>
                    <IonInput value={name} onIonChange={e => setUsername(e.detail.value)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput value={password} onIonChange={e => setPassword(e.detail.value)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Signature</IonLabel>
                    <IonInput value={signature} onIonChange={e => setSignature(e.detail.value)}></IonInput>
                </IonItem>
                {/* 假设这里有一个上传头像的组件 */}
                <IonButton expand="block" onClick={handleUpdateProfile}>Update Profile</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Account;
