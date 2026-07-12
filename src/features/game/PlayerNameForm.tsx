import { useState, type ChangeEvent, type FC, type FormEvent } from "react";

interface PlayerNameFormProps {
  readonly isCompact: boolean;
  readonly maximumLength: number;
  readonly onSubmit: (input: string) => void;
}

export const PlayerNameForm: FC<PlayerNameFormProps> = ({
  isCompact,
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
    <form
      className={`mx-auto w-full max-w-sm shrink-0 rounded-2xl border border-neon-violet/50 bg-neon-panel/90 shadow-[0_0_35px_rgba(139,92,246,0.25)] ${isCompact ? "px-3 py-2" : "px-6 py-4"}`}
      onSubmit={handleSubmit}
    >
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-neon-cyan">
        New player
      </p>
      <label
        className={`${isCompact ? "mt-1" : "mt-3"} block text-left font-mono text-xs uppercase tracking-wider text-neon-muted`}
        htmlFor="player-name"
      >
        Player name
      </label>
      <input
        autoFocus
        className={`${isCompact ? "mt-1 py-1" : "mt-2 py-2"} w-full rounded-lg border border-neon-violet/60 bg-neon-ink px-3 font-mono text-white outline-none focus:border-neon-cyan`}
        id="player-name"
        maxLength={maximumLength}
        onChange={handleInputChange}
        placeholder="Optional"
        type="text"
        value={input}
      />
      <button
        className={`${isCompact ? "mt-2 py-1" : "mt-4 py-2"} rounded-lg border border-neon-lime/70 bg-neon-lime/10 px-5 font-mono text-xs font-bold uppercase tracking-wider text-neon-lime`}
        type="submit"
      >
        Play
      </button>
    </form>
  );
};
