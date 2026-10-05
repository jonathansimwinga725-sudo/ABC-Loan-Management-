import ModulePage from "../../components/ModulePage";
export default function Page(){return <ModulePage eyebrow="FUNDING OPERATIONS" title="Disbursements" description="Control approved loan funding and track the movement of funds to borrowers." metrics={[{value:"K 186,500",label:"Ready to disburse"},{value:"9",label:"Approved loans"},{value:"K 524,000",label:"Disbursed this month"}]} columns={["Reference","Borrower","Loan","Channel","Amount","Status"]} rows={[
 {cells:["DIS-7718","Natasha Banda","LN-002190","MTN MoMo","K 8,500"],status:{label:"Ready",tone:"blue"}},
 {cells:["DIS-7717","Mwamba Trading","LN-002189","Bank transfer","K 72,000"],status:{label:"Authorisation",tone:"amber"}},
 {cells:["DIS-7716","Chanda Mwila","LN-002184","Bank transfer","K 35,000"],status:{label:"Completed",tone:"green"}}
 ]}/>}
