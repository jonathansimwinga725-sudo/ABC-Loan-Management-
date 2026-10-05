import ModulePage from "../../components/ModulePage";
export default function Page(){return <ModulePage eyebrow="SECURITY & CONTROL" title="Roles & permissions" description="Apply least-privilege access to credit, cash, accounting and administration functions." metrics={[{value:"7",label:"System roles"},{value:"21",label:"Role assignments"},{value:"0",label:"Privilege conflicts"}]} columns={["Role","Members","Loan decisions","Payments","Accounting","Status"]} rows={[
 {cells:["Organisation Owner","1","Full","Full","Full"],status:{label:"Active",tone:"green"}},
 {cells:["Manager","3","Approve","View","View"],status:{label:"Active",tone:"green"}},
 {cells:["Loan Officer","8","Submit","View","None"],status:{label:"Active",tone:"green"}},
 {cells:["Cashier","4","None","Record","View"],status:{label:"Active",tone:"green"}},
 {cells:["Auditor","1","View","View","View"],status:{label:"Active",tone:"green"}}
 ]}/>}
