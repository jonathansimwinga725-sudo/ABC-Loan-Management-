import ModulePage from "../../components/ModulePage";
export default function Page(){return <ModulePage eyebrow="PORTFOLIO INTELLIGENCE" title="Reports" description="Operational, portfolio, collections and financial reports for management decisions." metrics={[{value:"12",label:"Standard reports"},{value:"4",label:"Saved views"},{value:"Today",label:"Latest data refresh"}]} columns={["Report","Category","Period","Owner","Status"]} rows={[
 {cells:["Portfolio at risk","Credit risk","Current","Risk team"],status:{label:"Ready",tone:"green"}},
 {cells:["Repayment performance","Servicing","Oct 2026","Operations"],status:{label:"Ready",tone:"green"}},
 {cells:["Disbursement register","Finance","Oct 2026","Finance"],status:{label:"Ready",tone:"green"}},
 {cells:["Collections effectiveness","Collections","Q4 2026","Collections"],status:{label:"Scheduled",tone:"blue"}}
 ]}/>}
