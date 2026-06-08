export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="text-muted text-sm mt-1">{description}</p>}
    </div>
  );
}
