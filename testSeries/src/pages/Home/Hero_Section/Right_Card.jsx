import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import styles from "./Right_Card.module.css";

const Right_Card = () => {
    const [topper, setTopper] = useState(null);

    useEffect(() => {
        const fetchTopper = async () => {
            try {
                const res = await api.get('/admin/topper');
                setTopper(res.data);
            } catch (err) {
                console.error("Error fetching topper info:", err);
            }
        };
        fetchTopper();
    }, []);

    const displayTopper = (topper && topper.name) ? topper : {
        name: "Shruti Patil",
        subTitle: "Aspirant | Talathi Exam",
        rank: "AIR 12",
        totalTests: 12,
        accuracy: 94,
        score: "188/200",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    };

    const getAvatarUrl = (pic) => {
        if (!pic) return null;
        if (pic.startsWith('data:') || pic.startsWith('http://') || pic.startsWith('https://')) {
            return pic;
        }
        const serverUrl = '  ';
        if (pic.startsWith('/')) {
            return `${serverUrl}${pic}`;
        }
        return `${serverUrl}/${pic}`;
    };

    return (
        <div>{/* RIGHT SIDE ANALYTICS */}
            <div className={styles.right}>

                <div className={styles.analyticsCard}>

                    <div className={styles.userInfo}>
                        {displayTopper.avatar && (
                            <img 
                                src={getAvatarUrl(displayTopper.avatar)} 
                                alt={displayTopper.name || "Topper Avatar"} 
                            />
                        )}
                        <div>
                            <h4 className={styles.userName}>{displayTopper.name}</h4>
                            <p className={styles.userSub}>{displayTopper.subTitle}</p>
                        </div>

                        <span className={styles.rank}>{displayTopper.rank}</span>
                    </div>

                    <div className={styles.stats}>

                        <div className={styles.statItem}>
                            <p>Total Tests</p>
                            <span>{displayTopper.totalTests}</span>
                        </div>

                        <div className={styles.statItem}>
                            <p>Accuracy</p>
                            <span>{displayTopper.accuracy}%</span>
                        </div>

                    </div>

                    {/* Chart Bars */}
                    <div className={styles.chart}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.barActive}></div>
                        <div className={styles.bar}></div>
                    </div>

                </div>

                {/* Floating Card */}
                <div className={styles.floatingScore}>
                    <p>Mock Score</p>
                    <span>{displayTopper.score}</span>
                </div>

            </div>
        </div>
    );
};

export default Right_Card