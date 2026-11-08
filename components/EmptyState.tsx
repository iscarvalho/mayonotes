export default function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
      <div className="col-span-2 flex flex-col items-center justify-center gap-3 text-muted">
        <p>Selecione uma nota ou crie uma nova.</p>
        <button
          onClick={onCreate}
          className="rounded-md bg-action px-4 py-2 text-sm font-semibold text-black transition hover:brightness-90"
        >
          + Nova nota
        </button>
      </div>
    );
  }