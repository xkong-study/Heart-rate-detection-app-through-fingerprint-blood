import { IonContent, IonHeader, IonPage, IonTitle } from '@ionic/react';
import axios from 'axios';
import './Login.css';
import {useState} from "react"
import { CapsuleTabs, Toast } from 'antd-mobile'
import { Input } from 'antd-mobile'
import { useHistory } from "react-router-dom";
import {Alert, Upload, Avatar, Tooltip,Button} from "antd";
import {UserOutlined,CameraOutlined} from "@ant-design/icons";

const Login = () => {
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
    const forceUpdate = false;

    const closeAlert = () => {
        setIsVisible(false);
    };
    const beforeUpload = (file) => {
        const reader = new FileReader();
        // @ts-ignore
        reader.onloadend = () => setAvatar(reader.result);
        reader.readAsDataURL(file);
        return false;
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8084/user/login',
                {
                    name: value,
                    password: password,
                },
                {
                    withCredentials: true, // Include credentials in the request (cookies)
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
                    },
                }
            );
            if (response.data) {
                Toast.show({
                    icon: 'success',
                    content: 'Login successful!',
                });
                localStorage.setItem('user', JSON.stringify(response.data));
                history.push("/Camera");
            } else {
                Toast.show({
                    icon: 'fail',
                    content: 'Login failed!',
                });
            }
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: 'Login failed!',
            });
        }
    };

    const uploadButton = (
        <Tooltip title="change avatar">
            <Button icon={<CameraOutlined />} style={{height:"5%",padding:"0"}}/>
        </Tooltip>
    );

    const history = useHistory();

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
    }

    const handleRegister = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8084/user/register', // Adjust this URL to match your back-end route
                {
                    name: username, // Assuming 'username' holds the new user's name
                    email: email,
                    password: r_password,
                    signature: signature, // Additional fields as needed
                    // avatar: avatar, // Handling file uploads requires additional setup
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                Toast.show({
                    icon: 'success',
                    content: 'Registration successful!',
                });
                setActiveTab('fruits');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                icon: 'fail',
                content: 'Registration failed!',
            });
        }
    };
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