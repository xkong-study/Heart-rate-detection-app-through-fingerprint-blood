import React, { useEffect, useRef, useState } from 'react';
import './Camera.css';
import {useHistory} from "react-router-dom";
import {IonContent, IonHeader, IonPage} from "@ionic/react";
import cameraGif from './camera.gif';
import { Camera, CameraResultType, CameraSource, PermissionStatus } from '@capacitor/camera';

const ProgressCircle = ({ percentage, color }) => {
    const size = 80; // 外部容器的尺寸
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2.19; // 减去strokeWidth以适应边框
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    // 确保文本居中显示
    const textX = size / 2;
    const textY = size / 2;

    return (
        <svg height={size} width={size}>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            {/* 添加文本元素来显示百分比 */}
            <text
                x={textX}
                y={textY}
                fill={color}
                fontSize="16" // 字体大小可以根据需要调整
                textAnchor="middle" // 文本锚点设置为中间，以确保文本居中
                dominantBaseline="central" // 用于垂直居中
            >
                {`${percentage.toFixed(0)}%`}
            </text>
        </svg>
    );
};



function App() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [heartRate, setHeartRate] = useState(0);
    const processing = useRef(false);
    let colorSamples = [];
    const SAMPLE_WINDOW = 10000; // 10秒的采样窗口
    const SAMPLE_RATE = 100; // 每100ms采样一次
    const [heartRates, setHeartRates] = useState([]); // 用于存储一系列心率
    const [hrvEstimate, setHrvEstimate] = useState(0); // 存储估算的HRV
    const history = useHistory();
    const [normalRatePercentage, setNormalRatePercentage] = useState(0);
    const [tachycardiaPercentage, setTachycardiaPercentage] = useState(0);
    const [bradycardiaPercentage, setBradycardiaPercentage] = useState(0);
    const [open, setOpen] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [IsShow, setIsShow] = useState('none');
    function startstop(){
        setIsCameraOn(!isCameraOn);
        setIsShow(!IsShow);
        setOpen(!open);
    }


    async function checkCameraPermission() {
        Camera.checkPermissions().then((status) => {
            console.log("当前权限状态:", status);
            if (status.camera !== 'granted') {
                console.log("请求摄像头权限");
                return Camera.requestPermissions();
            } else {
                return status;
            }
        }).then((status) => {
            // 使用 JSON.stringify 来查看对象的详细内容
            console.log("最新权限状态:", JSON.stringify(status));
        }).catch((error) => {
            console.error("请求权限过程中出错:", error);
        });
    }

    useEffect(() => {
        if(isCameraOn === true) {
            checkCameraPermission().then(r => console.log(r));
        }
    }, [isCameraOn]);

    useEffect(() => {
        if(open === true) {
            const intervalId = setInterval(() => {
                if (heartRates.length > 1) {
                    // 计算心率的变化量
                    const rateChanges = heartRates.slice(1).map((rate, i) => Math.abs(rate - heartRates[i]));
                    // 计算变化量的平均值
                    const averageChange = rateChanges.reduce((a, b) => a + b, 0) / rateChanges.length;
                    setHrvEstimate(Math.floor(averageChange));
                }
            }, 6000); // 每分钟更新一次HRV估算值
            const percentages = calculateHeartRatePercentages(heartRates);
            updateHeartRateData(percentages);
            return () => clearInterval(intervalId);
        }
    }, [heartRates,open]);

    useEffect( () => {
        if (isCameraOn === true) {
            const video = videoRef.current;
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const constraints = {
                    video: true
                };
                navigator.mediaDevices.getUserMedia(constraints)
                    .then((stream) => {
                        video.srcObject = stream;
                        video.addEventListener('loadedmetadata', () => {
                            video.play().then(() => {
                                controlFlashLight(stream);
                                processFrame();
                            }).catch(e => console.error("视频播放错误: ", e));
                        });
                    }).catch(e => console.error("获取媒体流错误: ", e));
            }
        } else {
            if (videoRef.current.srcObject) {
                let tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        }
    }, [isCameraOn]);

    const controlFlashLight = (stream) => {
        const track = stream.getVideoTracks()[0];
        if ('ImageCapture' in window) {
            const imageCapture = new ImageCapture(track);
            imageCapture.getPhotoCapabilities().then((photoCapabilities) => {
                console.log(photoCapabilities);
                if (photoCapabilities.fillLightMode.includes('flash')) {
                    track.applyConstraints({
                        advanced: [{torch: true}]
                    });
                }
            }).catch(error => console.error('Error accessing ImageCapture API', error));
        }
    };

    const calculateHeartRatePercentages = (heartRates) => {
        let normal = 0;
        let tachycardia = 0;
        let bradycardia = 0;
        for(let i=0;i<heartRates.length;i++){
            if (heartRates[i] >= 60 && heartRates[i] <= 100) { // 假设60-100为正常心率范围
                normal++;
            } else if (heartRates[i] > 100 && i>=1 && heartRates[i-1]>0) {
                tachycardia++;
            } else if (heartRates[i]> 10){
                bradycardia++;
            }
        }
        // 计算百分比
        const total = heartRates.length;
        return {
            normal: (normal / total) * 100,
            tachycardia: (tachycardia / total) * 100,
            bradycardia: (bradycardia / total) * 100
        };
    };

    const updateHeartRateData = (newData) => {
        setNormalRatePercentage(newData.normal);
        setTachycardiaPercentage(newData.tachycardia);
        setBradycardiaPercentage(newData.bradycardia);
    };

    const processFrame = () => {
        if (videoRef.current && canvasRef.current && !processing.current) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            const data = imageData.data;
            let sumRed = 0;
            let pixelCount = 0;

            for (let i = 0; i < data.length; i += 4) {
                sumRed += data[i]; // 红色通道
                pixelCount++;
            }

            const avgRed = sumRed / pixelCount;
            colorSamples.push(avgRed);

            if (colorSamples.length >= SAMPLE_WINDOW / SAMPLE_RATE) {
                const heartRateEstimate = calculateHeartRate(colorSamples);
                setHeartRate(heartRateEstimate);
                colorSamples = []; // 重置样本数组
            }

            processing.current = true;
            setTimeout(() => { processing.current = false; }, SAMPLE_RATE);
        }
        requestAnimationFrame(processFrame);
    };
    useEffect(() => {
        onNewHeartRate(heartRate)
    }, [heartRate]);
    const onNewHeartRate = (heartRate) => {
        setHeartRates((currentRates) => [...currentRates, heartRate]);
    };
    const calculateHeartRate = (samples) => {
        let peaks = 0;
        let threshold = findThreshold(samples);

        for (let i = 1; i < samples.length - 1; i++) {
            if (samples[i] > threshold && samples[i] > samples[i - 1] && samples[i] > samples[i + 1]) {
                peaks++;
            }
        }

        const heartRate = (peaks / (SAMPLE_WINDOW / 1000)) * 60; // 每分钟心跳次数
        return heartRate;
    };

    function addHeartRateData(heartRate, hrv) {
        const data = JSON.stringify({
            heartRate: heartRate,
            hrv: hrv
        });

        fetch('http://localhost:8084/user/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.error('Error:', error));
    }


    const handleStatClick = () => {
        addHeartRateData(heartRate,hrvEstimate);

        history.push('/Cost', { heartRate, hrvEstimate, heartRates, normalRatePercentage, tachycardiaPercentage, bradycardiaPercentage });
    };


    const findThreshold = (samples) => {
        // 简单的阈值计算，例如取样本的平均值
        let sum = samples.reduce((a, b) => a + b, 0);
        return sum / samples.length;
    };

    // @ts-ignore
    return (
        <IonPage>
            <IonHeader>
            </IonHeader>
            <IonContent fullscreen className="center-card">
                <div style={{marginTop:"3rem"}}>
                    <div className="button-container">
                        <span className="badge">NEW</span>
                        <button type="button" className="heart-health-button" onClick={()=>history.push('/Survey')}>
                            <i className="icon-heart"></i> Take heart health tests
                        </button>
                    </div>

                    <div className="container">
                        <div className="stat-header">
                            <span>Latest Status</span>
                            <span onClick={handleStatClick} style={{marginTop:"-10%"}}>...</span>
                        </div>
                        <div className="stat-content">
                            <div className="stat">
                                <div className="stat-indicator">
                                    <div className="circle green-circle"></div>
                                    <span>Heart Rate</span>
                                </div>
                                <span>{heartRate} BPM</span>
                            </div>
                            <div className="stat">
                                <div className="stat-indicator">
                                    <div className="circle orange-circle"></div>
                                    <span>HRV</span>
                                </div>
                                <span>{hrvEstimate} ms</span>
                            </div>
                            <div className="stat">
                                <div className="stat-indicator">
                                    <div className="circle green-circle"></div>
                                    <span>Stress</span>
                                </div>
                                <span>5%</span>
                            </div>
                        </div>
                        <div class="progress-section">
                            <div class="progress-circle">
                                <ProgressCircle percentage={normalRatePercentage} color="#02796b" />
                                <div class="progress-label">Normal Heart Rate</div>
                            </div>
                            <div class="progress-circle">
                                <ProgressCircle percentage={tachycardiaPercentage} color="red" />
                                <div class="progress-label">Fast Heart Rate</div>
                            </div>
                            <div class="progress-circle">
                                <ProgressCircle percentage={bradycardiaPercentage} color="#0273c2" />
                                <div class="progress-label">Slow Heart Rate</div>
                            </div>
                        </div>
                        <div className="stat-header" style={{marginTop:'2rem'}}>
                            <span>Detection</span>
                        </div>
                        <div onClick={() => startstop()}>
                            <div id="thumb"></div>
                            <video ref={videoRef} className={`canvas ${isCameraOn ? 'cameraOnAnimation' : 'cameraOffAnimation'}`} style={{display: 'none'}}></video>
                            {isCameraOn ? <img src={cameraGif} alt="Camera Loading" className="canvas1"/> : <div className="canvas2" style={{backgroundColor:'black'}}/> }
                            <canvas id="can" className={`canvas ${isCameraOn ? 'cameraOnAnimation' : 'cameraOffAnimation'}`} ref={canvasRef} style={{display: isCameraOn ? 'block' : 'none'}}></canvas>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default App;
