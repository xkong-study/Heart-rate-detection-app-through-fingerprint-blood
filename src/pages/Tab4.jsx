import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonIcon, IonAvatar, IonLabel, IonList, IonCard, IonCardHeader, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import './Tab4.css';
import { useHistory } from "react-router-dom";
import image from "../components/img.png";
import { UserOutline, PictureOutline, RightOutline } from 'antd-mobile-icons';
import { CloudSyncOutlined } from '@ant-design/icons';
import draft from "../components/draft.png";
import note from "../components/note.png";
import save from "../components/save.png";
import boy from "./boy.jpg";
import boy1 from "./boy1.jpg";
const Tab4 = () => {
    const history = useHistory()

    const navigateTo = (route) => {
        history.push(route)
    }

    return (
        <IonPage>
            <IonHeader>
            </IonHeader>
            <IonContent color="tertiary" className="ion-padding">
                <div className="user-info">
                    <div className="user-avatar">
                        <IonAvatar className="avatar">
                            {!localStorage.getItem("email")?<img src={boy} alt="User"/>:<img src={boy1} alt="User"/>}
                        </IonAvatar>
                        <IonLabel className="user-label">djm</IonLabel>
                    </div>
                </div>
                <IonCard className="user-menu">
                    <IonCardContent>
                        <IonList class="menu">
                            <IonItem class="menu-item" onClick={() => navigateTo('/account')}>
                                <UserOutline slot="start" />
                                <IonLabel>Account</IonLabel>
                                <RightOutline slot="end" />
                            </IonItem>
                            <IonItem class="menu-item" onClick={() => history.push('/history',{state:'ok'})}>
                                <CloudSyncOutlined slot="start" />
                                <IonLabel>History</IonLabel>
                                <RightOutline slot="end" />
                            </IonItem>
                        </IonList>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Tab4;
