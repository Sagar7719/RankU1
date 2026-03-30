import styles from "./Hero.module.css";
import Right_Card from "./Right_Card";

export default function Hero() {
  return (
    <section className={styles.hero}>

      {/* LEFT CONTENT */}
      <div className={styles.left}>

        <span className={styles.badge}>
          ⚡ The Next-Gen Exam Preparation Platform
        </span>

        <h1 className={styles.heading}>
          Cracking Exams <br />
          Made Simpler & <br />
          <span className={styles.blue}>Smarter.</span>
        </h1>

        <p className={styles.desc}>
          RankU1 provides the most relevant mock tests and deep
          performance analytics to help you secure your dream
          government job.
        </p>

        <div className={styles.buttons}>

          <button className={styles.primaryBtn}>
            Explore Test Series →
          </button>

          <button className={styles.secondaryBtn}>
            Google Play
          </button>

          <button className={styles.secondaryBtn}>
            App Store
          </button>

        </div>
        <div className="hp-hero-trust">
          
        </div>

      </div>

      <Right_Card />

    </section>
  );
}