interface Props {
  text: string;
  color: string;
}

export function HankoStamp({ text, color }: Props) {
  return (
    <div
      className="hanko-stamp flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-center font-ledger text-xs font-bold tracking-wide"
      style={{
        border: `3px double ${color}`,
        color,
        transform: "rotate(-8deg)",
      }}
    >
      <span>{text}</span>
    </div>
  );
}
