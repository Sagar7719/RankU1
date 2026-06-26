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

          <a href="https://ranku1testseries-git-main-pooja-kothawade-projects.vercel.app/test-series" className={styles.primaryBtn} style={{ textDecoration: 'none' }}>
            Explore Test Series →
          </a>

          <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn} style={{ textDecoration: 'none' }}>
            Google Play
          </a>

          <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn} style={{ textDecoration: 'none' }}>
            App Store
          </a>

        </div>
        <div className="hp-hero-trust">
          
        </div>

      </div>

      <Right_Card />

    </section>
  );
}