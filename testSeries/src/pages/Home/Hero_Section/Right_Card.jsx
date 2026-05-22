import styles from "./Right_Card.module.css";

const Right_Card = () => {
    return (
        <div>{/* RIGHT SIDE ANALYTICS */}
            <div className={styles.right}>

                <div className={styles.analyticsCard}>

                    <div className={styles.userInfo}>
                        <img
                            src="https://i.pravatar.cc/40"
                            alt="user"
                        />

                        <div>
                            <h4 className={styles.userName}>Aryan K.</h4>
                            <p className={styles.userSub}>Aspirant | SSC CGL</p>
                        </div>

                        <span className={styles.rank}>AIR 42</span>
                    </div>

                    <div className={styles.stats}>

                        <div className={styles.statItem}>
                            <p>Total Tests</p>
                            <span>128</span>
                        </div>

                        <div className={styles.statItem}>
                            <p>Accuracy</p>
                            <span>94%</span>
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
                    <span>178/200</span>
                </div>

            </div>
        </div>
    )
}

export default Right_Card