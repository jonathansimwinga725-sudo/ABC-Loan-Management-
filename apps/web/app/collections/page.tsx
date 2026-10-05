import ModulePage from "../../components/ModulePage";
export default function Page(){return <ModulePage eyebrow="SERVICING & RECOVERY" title="Collections" description="Prioritise delinquent accounts, promises to pay, hardship and recovery actions." metrics={[{value:"18",label:"Accounts overdue"},{value:"K 42,760",label:"Total overdue"},{value:"6",label:"Promises to pay"}]} columns={["Borrower","Loan","Days past due","Overdue","Next action","Status"]} rows={[
 {cells:["Lusekelo Stores","LN-002179","37 days","K 12,000","Call today"],status:{label:"Escalated",tone:"red"}},
 {cells:["Peter Zulu","LN-002161","18 days","K 5,600","PTP · 08 Oct"],status:{label:"Promise to pay",tone:"blue"}},
 {cells:["Ruth Sakala","LN-002156","9 days","K 2,850","SMS reminder"],status:{label:"Open",tone:"amber"}},
 {cells:["Moses Banda","LN-002148","4 days","K 1,200","Call tomorrow"],status:{label:"Open",tone:"amber"}}
 ]}/>}
