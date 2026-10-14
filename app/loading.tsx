export default function Loading() {
  return (
    <main
      className="flex min-h-dvh items-center justify-center bg-background p-6"
      aria-busy="true"
      aria-live="polite"
      aria-label="Carregando página"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex size-11 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary motion-reduce:animate-none" />
          <span className="size-2 rounded-full bg-primary" />
        </div>
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </div>
    </main>
  )
}
