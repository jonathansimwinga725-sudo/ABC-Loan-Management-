import AppShell from "./AppShell";
import PageHeader from "./PageHeader";
import StatusPill from "./StatusPill";

type Tone="green"|"blue"|"amber"|"red"|"gray";
type Row={cells:string[]; status?:{label:string;tone:Tone}};
export default function ModulePage({eyebrow,title,description,metrics,columns,rows,action}:{eyebrow:string;title:string;description:string;metrics:{value:string;label:string}[];columns:string[];rows:Row[];action?:React.ReactNode}){
 return <AppShell><div className="content">
  <PageHeader eyebrow={eyebrow} title={title} description={description} action={action}/>
  <div className="module-metrics">{metrics.map(m=><div className="card module-stat" key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}</div>
  <section className="card data-card">
   <div className="flex-table-head" style={{gridTemplateColumns:`repeat(${columns.length},minmax(120px,1fr))`}}>{columns.map(c=><b key={c}>{c}</b>)}</div>
   {rows.map((row,i)=><div className="flex-data-row" style={{gridTemplateColumns:`repeat(${columns.length},minmax(120px,1fr))`}} key={i}>
    {row.cells.map((cell,j)=><span key={j} className={j===0?"primary-cell":""}>{cell}</span>)}
    {row.status&&<StatusPill tone={row.status.tone}>{row.status.label}</StatusPill>}
   </div>)}
  </section>
 </div></AppShell>
}
