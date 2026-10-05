import ModulePage from "../../components/ModulePage";
export default function Page(){return <ModulePage eyebrow="CREDIT CONTROL" title="Approval workflows" description="Use different sequential approval chains based on product, value and risk." metrics={[{value:"4",label:"Active workflows"},{value:"3",label:"Approval roles"},{value:"7",label:"Items awaiting action"}]} columns={["Workflow","Applies to","Step 1","Step 2","Final step","Status"]} rows={[
 {cells:["Fast Track","Emergency Loan","Loan Officer","—","—"],status:{label:"Active",tone:"green"}},
 {cells:["Standard Credit","Personal / Salary","Loan Officer","Manager","—"],status:{label:"Active",tone:"green"}},
 {cells:["Business Credit","Business Growth","Loan Officer","Branch Manager","Head of Credit"],status:{label:"Active",tone:"green"}},
 {cells:["High Value","Principal ≥ K100,000","Credit Analyst","Head of Credit","Director"],status:{label:"Draft",tone:"gray"}}
 ]}/>}
