import { IonContent, IonHeader, IonPage, IonTitle } from '@ionic/react';
import axios from 'axios';
import './Login.css';
import {useState} from "react"
import { CapsuleTabs, Toast } from 'antd-mobile'
import { Input } from 'antd-mobile'
import { useHistory } from "react-router-dom";
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'
import {Alert, Upload, Avatar, Tooltip,Button} from "antd";
import {UserOutlined,CameraOutlined} from "@ant-design/icons";

const Login: React.FC = () => {
    const [value, setValue] = useState('')
    const [password, setPassword] = useState('')
    const [r_value,setR_value] = useState('')
    const [r_password,setR_password] = useState('')
    const [activeTab,setActiveTab] = useState('fruits')
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [signature, setSignature] = useState('');
    const [avatar, setAvatar] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const closeAlert = () => {
        setIsVisible(false);
    };
    const beforeUpload = (file:any) => {
        const reader = new FileReader();
        // @ts-ignore
        reader.onloadend = () => setAvatar(reader.result);
        reader.readAsDataURL(file);
        return false;
    };

    const uploadButton = (
        <Tooltip title="change avatar">
            <Button icon={<CameraOutlined />} style={{height:"5%",padding:"0"}}/>
        </Tooltip>
    );

    const history = useHistory();

    const handleTabChange = (tabKey:any) => {
        setActiveTab(tabKey);
    }

    const handleLogin = () => {
        // Simulate a successful login
        localStorage.setItem('name', value);
        Toast.show({
            icon: 'success',
            content: 'Login successful!',
        });
        window.location.href = "./Camera";
    };

    const handleRegister = () => {
        // Check if the required fields are filled
        if (username && email && r_password && signature) {
            // Simulate a successful registration
            Toast.show({
                icon: 'success',
                content: 'Registration successful!',
            });
            setTimeout(() => setActiveTab('fruits'), 2000);
        } else {
            alert('Username, password, email, and signature cannot be empty');
        }
    }
    // @ts-ignore
    document.querySelector('ion-tab-bar').style.display='none'

    return (
        <IonPage>
            <IonHeader>
            </IonHeader>
            <IonContent fullscreen className="center-card">
                <div className="card1">
                    <CapsuleTabs activeKey={activeTab} onChange={handleTabChange}>
                        <CapsuleTabs.Tab title='Sign in' key='fruits'>
                            <h2>Sign in to SmileSnap</h2>
                            <p className="fontStyle">
                                Email
                            </p>
                            <Input
                                className="input-field"
                                value={value}
                                onChange={val => setValue(val)}
                            />
                            <p className="fontStyle">
                                Password
                            </p>
                            <Input
                                className="input-field"
                                type='password'
                                value={password}
                                onChange={val => setPassword(val)}
                            />
                            <Button onClick={handleLogin} style={{height:"20%",width:"50%",marginLeft:"50%",transform:"translate(-50%,0)",marginTop:"10%",padding:"10px"}}>Sign in</Button>
                        </CapsuleTabs.Tab>
                        {/* 注册表单 */}
                        <CapsuleTabs.Tab title='Register' key='vegetables'>
                            <h2>Create an account</h2>
                            {isVisible&&<div
                                style={{
                                    padding: '1em',
                                    marginBottom: '1em',
                                    borderRadius: '4px',
                                    backgroundColor: '#f8d7da',
                                    color: '#721c24',
                                    border: '1px solid #f5c6cb',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width:"100%",
                                    height:"45px",
                                }}
                            >
                                <div style={{width:"250%"}}>email has registered</div>
                                <button onClick={closeAlert} style={{ background: 'none', border: 'none', color: 'inherit',marginTop:"-3%",marginLeft:"30%" }}>X</button>
                            </div>}
                            <div className="avatar-upload">
                                <Avatar src={avatar} size={64} icon={<UserOutlined />} style={{marginLeft:"50%",transform:"translate(-50%,0)",marginBottom:"15px"}}/>
                                <Upload name="avatar" beforeUpload={beforeUpload} showUploadList={false}>
                                    {uploadButton}
                                </Upload>
                            </div>
                            <p className="fontStyle">
                                UserName
                            </p>
                            <Input
                                className="input-field"
                                value={username}
                                onChange={val => setUsername(val)}
                            />
                            <p className="fontStyle">
                                Email
                            </p>
                            <Input
                                className="input-field"
                                value={email}
                                onChange={val => setEmail(val)}
                            />
                            <p className="fontStyle">
                                Password
                            </p>
                            <Input
                                className="input-field"
                                type='password'
                                value={r_password}
                                onChange={val => setR_password(val)}
                            />
                            <p className="fontStyle">
                                Signature
                            </p>
                            <Input
                                className="input-field"
                                value={signature}
                                onChange={val => setSignature(val)}
                            />
                            <Button onClick={handleRegister} style={{height:"20%",width:"80%",marginLeft:"50%",marginTop:"10%",transform:"translate(-50%,0)",padding:"10px"}}>Create an account</Button>
                        </CapsuleTabs.Tab>
                    </CapsuleTabs>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
