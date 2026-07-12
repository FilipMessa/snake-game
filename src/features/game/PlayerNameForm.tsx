import { useState, type ChangeEvent, type FC, type FormEvent } from "react";

interface PlayerNameFormProps {
  readonly maximumLength: number;
  readonly onSubmit: (input: string) => void;
}

export const PlayerNameForm: FC<PlayerNameFormProps> = ({
  maximumLength,
  onSubmit,
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit(input);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  return (
    <div className="absolute inset-1 grid place-items-center rounded-xl bg-neon-ink/78 p-6 text-center backdrop-blur-[2px]">
      <form
        className="w-full max-w-sm rounded-2xl border border-neon-violet/50 bg-neon-panel/90 px-6 py-5 shadow-[0_0_35px_rgba(139,92,246,0.25)]"
        onSubmit={handleSubmit}
      >
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-neon-cyan">
          New player
        </p>
        <label
          className="mt-3 block text-left font-mono text-xs uppercase tracking-wider text-neon-muted"
          htmlFor="player-name"
        >
          Player name
        </label>
        <input
          autoFocus
          className="mt-2 w-full rounded-lg border border-neon-violet/60 bg-neon-ink px-3 py-2 font-mono text-white outline-none focus:border-neon-cyan"
          id="player-name"
          maxLength={maximumLength}
          onChange={handleInputChange}
          placeholder="Optional"
          type="text"
          value={input}
        />
        <button
          className="mt-4 rounded-lg border border-neon-lime/70 bg-neon-lime/10 px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-neon-lime"
          type="submit"
        >
          Play
        </button>
      </form>
    </div>
  );
};
