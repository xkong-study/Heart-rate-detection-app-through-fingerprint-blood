import React, { useState } from 'react';
import {
    IonContent,
    IonPage,
    IonInput,
    IonButton,
    IonLabel,
    IonAvatar,
    IonItem,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonBackButton,
    IonHeader
} from '@ionic/react';
import { bulbOutline } from 'ionicons/icons';
import './account.css';
import boy from './boy.jpg';
import boy1 from './boy1.jpg';
import {Alert, Upload, Avatar, Tooltip,Button} from "antd";
import {UserOutlined,CameraOutlined} from "@ant-design/icons";
const Account: React.FC = () => {
    const [emailState, setEmail] = useState('dissert@tcd.ie');
    const [usernameState, setUsername] = useState('djm');
    const [signatureState, setSignature] = useState('How are you');
    const [statusState, setStatus] = useState('offline');
    const avatar = 'https://image.16pic.com/00/52/52/16pic_5252333_s.jpg';
    const [Avatar, setAvatar] = useState(boy);
    const beforeUpload = (file:any) => {
        const reader = new FileReader();
        // @ts-ignore
        reader.onloadend = () => setAvatar(reader.result);
        reader.readAsDataURL(file);
        return false;
    };


    const handleInputChange = (setState: React.Dispatch<React.SetStateAction<string>>) => (event: CustomEvent) => {
        if(event?.detail?.value) {
            setState(String(event.detail.value));
        }
    }
    const handleSubmit = () => {
        localStorage.setItem('email', boy1);
        fetch('http://localhost:8001/api/profile/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailState,
                password: '123', // 注意：在实际项目中，密码通常不会这样硬编码在代码中
                username: usernameState,
                signature: signatureState,
                role: 'user',
                status: statusState,
                token: 'abcd1234', // 同上，token 也不应硬编码
                avatar: boy1,
                registerTime: new Date().toISOString(),
                timeZone: 'UTC+1'
            })
        }).then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    }
    const uploadButton = (
        <Tooltip title="change avatar">
            <Button icon={<CameraOutlined />} style={{height:"5%",padding:"0"}}/>
        </Tooltip>
    );

    const getColor = () => {
        console.log(statusState)
        switch (statusState) {
            case 'online':
                return 'success';
            case 'invisible':
                return 'danger';
            default:
                return 'gray';
        }
    }

    return (
        <IonPage>
            <div className="ion-padding">
                <IonCard>
                    <IonCardHeader>
                        <div style={{display: 'flex'}}>
                         <IonBackButton defaultHref="/tab4" style={{width:"20px",height:"20px",marginLeft:"-10px",marginTop:"-10px"}}/>
                        <IonCardTitle>Profile Information</IonCardTitle>
                        </div>
                    </IonCardHeader>

                    <IonItem className="account-item">
                        <IonLabel className="account-label">Avatar</IonLabel>
                        <IonAvatar className="account-value" slot="end"><img src={Avatar} alt="avatar" style={{width:"30%"}}/></IonAvatar><Upload name="avatar" beforeUpload={beforeUpload} showUploadList={false}>
                            {uploadButton}
                        </Upload>
                        <IonLabel className="arrow" slot="end">{'>'}</IonLabel>
                    </IonItem>

                    <IonItem className="account-item">
                        <IonLabel className="account-label">Username:</IonLabel>
                        <IonInput className="account-value input-gray" slot="end" value={usernameState} onIonChange={handleInputChange(setUsername)}></IonInput>
                        <IonLabel className="arrow" slot="end">{'>'}</IonLabel>
                    </IonItem>

                    <IonItem className="account-item">
                        <IonLabel className="account-label">Email:</IonLabel>
                        <IonInput className="account-value input-gray" slot="end" value={emailState} onIonChange={handleInputChange(setEmail)}></IonInput>
                        <IonLabel className="arrow" slot="end">{'>'}</IonLabel>
                    </IonItem>

                    <IonItem className="account-item">
                        <IonLabel className="account-label">Signature:</IonLabel>
                        <IonInput className="account-value input-gray" slot="end" value={signatureState} onIonChange={handleInputChange(setSignature)}></IonInput>
                        <IonLabel className="arrow" slot="end">{'>'}</IonLabel>
                    </IonItem>

                    <IonItem className="account-item">
                        <IonLabel className="account-label">Status:</IonLabel>
                        <IonSelect className="account-value input-gray" slot="end" value={statusState} onIonChange={e => setStatus(e.detail.value)}>
                            <IonSelectOption value="offline">Offline</IonSelectOption>
                            <IonSelectOption value="online">Online</IonSelectOption>
                            <IonSelectOption value="invisible">Invisible</IonSelectOption>
                        </IonSelect>
                        <IonIcon icon={bulbOutline} color={getColor()} slot="end" />
                        <IonLabel className="arrow" slot="end">{'>'}</IonLabel>
                    </IonItem>

                    <IonButton expand="full" type="submit" className="ion-margin-top" onClick={handleSubmit}>
                        Update Profile
                    </IonButton>
                </IonCard>
            </div>
        </IonPage>
    );
};

export default Account;
