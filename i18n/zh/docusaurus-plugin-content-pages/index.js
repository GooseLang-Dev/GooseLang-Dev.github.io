import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from './features';

import Heading from '@theme/Heading';
import styles from '../../../src/pages/index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          GooseLang 文档中心
        </Heading>
        <p className="hero__subtitle">GooseLang 开发 & 使用的最终指南</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/dev/intro">
            开发文档⚙️
          </Link> 
          <span style={{width:'5vw'}}></span>
          <Link
            className="button button--secondary button--lg"
            to="/guide/intro">
            用户手册🧭
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`欢迎来到 ${siteConfig.title}`}
      description="GooseLang 开发 & 使用的终极指南">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}