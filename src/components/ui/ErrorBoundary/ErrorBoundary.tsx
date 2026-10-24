import styles from './ErrorBoundary.module.css';
import { Button } from '../Button/Button';

export const ErrorBoundary = () => (
  <section className={styles.error}>
    <h1>Something went wrong</h1>
    <p>We couldn't display this page. Please try again.</p>
    <Button onClick={() => window.location.reload()}>Reload page</Button>
  </section>
);
