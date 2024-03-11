import React, { useEffect, useRef, useState } from 'react';
import './Camera.css';
import {useHistory} from "react-router-dom";
import {IonContent, IonHeader, IonPage} from "@ionic/react";
import cameraGif from './camera.gif';
import { CameraPreview } from '@capacitor-community/camera-preview';
import Survey from "./survey";

const ProgressCircle = ({ percentage, color }) => {
    const size = 80;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2.19;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
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
            <text
                x={textX}
                y={textY}
                fill={color}
                fontSize="16"
                textAnchor="middle"
                dominantBaseline="central"
            >
                {`${percentage.toFixed(0)}%`}
            </text>
        </svg>
    );
};

function CameraCapture() {
    const canvasRef = useRef(null);
    const [heartRate, setHeartRate] = useState(0);
    const processing = useRef(false);
    let colorSamples = [];
    const SAMPLE_WINDOW = 10000;
    const SAMPLE_RATE = 10;
    const [heartRates, setHeartRates] = useState([]);
    const [hrvEstimate, setHrvEstimate] = useState(0); // 存储估算的HRV
    const [normalRatePercentage, setNormalRatePercentage] = useState(0);
    const [tachycardiaPercentage, setTachycardiaPercentage] = useState(0);
    const [bradycardiaPercentage, setBradycardiaPercentage] = useState(0);
    const [open, setOpen] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [IsShow, setIsShow] = useState('none');
    const [showSurvey, setShowSurvey] = useState(false);


    function startstop(){
        setIsCameraOn(!isCameraOn);
        setIsShow(!IsShow);
        setOpen(!open);
    }

    const history = useHistory();

    useEffect(() => {
        let intervalId;

        const manageCamera = async () => {
            if (isCameraOn) {
                try {
                    await CameraPreview.start({
                        parent: 'cameraPreview',
                        position: 'rear',
                        toBack: true,
                        videoWidth: window.screen.width,
                        videoHeight: window.screen.height,
                    });
                    intervalId = setInterval(captureAndProcessFrame, 1000);
                } catch (error) {
                    console.error("Error starting camera:", error);
                }
            } else {
                CameraPreview.stop();
                console.log('Camera stopped');
                if (intervalId) clearInterval(intervalId);
            }
        };
        manageCamera();
        return () => {
            if (intervalId) clearInterval(intervalId);
            CameraPreview.stop();
        };
    }, [isCameraOn]);

    const applySimpleMovingAverageFilter = (samples, sampleWindow) => {
        let filteredSamples = [];
        for (let i = 0; i < samples.length; i++) {
            if (i < sampleWindow - 1) {
                // 对于数组前端不足以形成完整窗口的部分，直接使用原始值
                filteredSamples.push(samples[i]);
            } else {
                // 计算当前位置向前sampleWindow个样本的平均值
                let sum = 0;
                for (let j = 0; j < sampleWindow; j++) {
                    sum += samples[i - j];
                }
                let average = sum / sampleWindow;
                filteredSamples.push(average);
            }
        }
        return filteredSamples;
    };

    const calculateSimplifiedHeartRate = (colorSamples) => {
        let peakCount = 0;
        let threshold = 50;

        for (let i = 1; i < colorSamples.length - 1; i++) {
            if (colorSamples[i] > threshold && colorSamples[i] > colorSamples[i - 1] && colorSamples[i] > colorSamples[i + 1]) {
                peakCount++;
            }
        }
        const heartRate = peakCount * (60 / (colorSamples.length / SAMPLE_RATE));
        return heartRate;
    };

    const processFrame = (base64Image) => {
        if (canvasRef.current && !processing.current) {
            const context = canvasRef.current.getContext('2d');
            const image = new Image();
            image.onload = () => {
                context.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);
                const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
                const data = imageData.data;
                let sumRed = 0;
                let pixelCount = 0;

                // 计算红色通道的平均值
                for (let i = 0; i < data.length; i += 4) {
                    sumRed += data[i]; // 红色通道值
                    pixelCount++;
                }

                const avgRed = sumRed / pixelCount;
                colorSamples.push(avgRed);

                // 当累积足够的样本后，进行心率估算
                if (colorSamples.length >= 20) {
                    // 应用简化的移动平均滤波（如果您决定使用它来平滑数据）
                    const filteredSamples = applySimpleMovingAverageFilter(colorSamples, 4); // 窗口大小为4

                    // 使用简化的心率计算方法
                    const heartRateEstimate = calculateSimplifiedHeartRate(filteredSamples); // 使用简化的心率计算方法
                    setHeartRate(heartRateEstimate);
                    colorSamples = []; // 清空样本数组，准备下一轮采样
                }
            };
            image.src = `data:image/jpeg;base64,${base64Image}`;

            processing.current = true;
            setTimeout(() => { processing.current = false; }, SAMPLE_RATE);
        }
    };

    const captureAndProcessFrame = async () => {
        try {
            const cameraPreviewPictureOptions = {
                quality: 50,
            };
            const result = await CameraPreview.capture(cameraPreviewPictureOptions);
            const base64PictureData = result.value;
            processFrame(base64PictureData);

        } catch (error) {
            console.error("Error capturing video stream sample:", error);
        }
    };

    useEffect(() => {
        let intervalId;
        async function manageCamera() {
            if (isCameraOn) {
                try {
                    await CameraPreview.start({
                        parent: 'cameraPreview', // 确保这个ID与页面上的容器元素匹配
                        position: 'rear',
                        toBack: true,
                        videoWidth: window.screen.width,
                        videoHeight: window.screen.height,
                    });
                    console.log('Camera started');
                    intervalId = setInterval(captureAndProcessFrame, 1000);
                } catch (error) {
                    console.error("Error starting camera:", error);
                }
            } else {
                await CameraPreview.stop();
                console.log('Camera stopped');
            }
        }

        manageCamera();
        const percentages = calculateHeartRatePercentages(heartRates);
        updateHeartRateData(percentages);
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isCameraOn, captureAndProcessFrame]); // captureAndProcessFrame 被添加到依赖数组中，确保它没有在每次渲染时重新创建

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

    useEffect(() => {
        onNewHeartRate(heartRate)
    }, [heartRate]);

    const onNewHeartRate = (heartRate) => {
        setHeartRates((currentRates) => [...currentRates, heartRate]);
    };

    const toggleSurveyDisplay = () => {
        setShowSurvey(!showSurvey);
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
    }

    const handleStatClick = () => {
        addHeartRateData(heartRate,hrvEstimate);
        history.push('/Cost', { heartRate, hrvEstimate, heartRates, normalRatePercentage, tachycardiaPercentage, bradycardiaPercentage });
    };

    const findThreshold = (samples) => {
        let sum = samples.reduce((a, b) => a + b, 0);
        return sum / samples.length;
    };

    return (
        <IonPage style={{marginTop:"1rem"}}>
            <IonContent fullscreen className="center-card">
                <div style={{marginTop:"1rem"}}>
                    <div className="button-container">
                        <span className="badge">NEW</span>
                        <button type="button" className="heart-health-button" onClick={toggleSurveyDisplay}>
                            <i className="icon-heart"></i> Take heart health tests
                        </button>
                    </div>
                    {showSurvey? <Survey />:
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
                                {
                                    isCameraOn ?
                                        <img src={cameraGif} alt="Camera Loading" className="canvas1"/> :
                                        <div className="canvas2" style={{backgroundColor:'black'}}/>
                                }
                                <canvas className={`canvas ${isCameraOn ? 'cameraOnAnimation' : 'cameraOffAnimation'}`} ref={canvasRef} style={{display: isCameraOn ? 'block' : 'none'}}>
                                    <div id="cameraPreview"></div>
                                </canvas>
                            </div>
                        </div>
                    }
                </div>
            </IonContent>
        </IonPage>
    );
}

export default CameraCapture;
