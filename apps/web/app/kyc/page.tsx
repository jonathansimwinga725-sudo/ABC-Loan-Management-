import ModulePage from "../../components/ModulePage";
export default function Page(){return <ModulePage eyebrow="CUSTOMER DUE DILIGENCE" title="KYC & Documents" description="Review identity and supporting documents before credit decisions are completed." metrics={[{value:"5",label:"Awaiting review"},{value:"92%",label:"Verified customers"},{value:"2",label:"Expiring documents"}]} columns={["Customer","Document","Submitted","Reviewer","Decision"]} rows={[
 {cells:["Chanda Mwila","National Registration Card","Today 09:18","Unassigned"],status:{label:"Review",tone:"amber"}},
 {cells:["Mwamba Trading","PACRA certificate","Yesterday","M. Tembo"],status:{label:"Verified",tone:"green"}},
 {cells:["Natasha Banda","Payslip · September","03 Oct","J. Phiri"],status:{label:"Verified",tone:"green"}},
 {cells:["Lusekelo Stores","Tax registration","02 Oct","Unassigned"],status:{label:"Review",tone:"amber"}}
 ]}/>}
