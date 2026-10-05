export default function StatusPill({children,tone="blue"}:{children:React.ReactNode,tone?:"green"|"blue"|"amber"|"red"|"gray"}) {
 return <span className={`status-pill tone-${tone}`}>{children}</span>;
}
