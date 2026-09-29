import Button from './components/Button';

export default function NotFound() {
  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">404</p>
          <h1>That page moved.</h1>
          <p>Head back to the main site and choose a division or project.</p>
          <Button variant="solid" href="/" arrow>Go home</Button>
        </div>
      </section>
    </div>
  );
}
