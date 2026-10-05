import ModulePage from "../../components/ModulePage";
export default function Page(){return <ModulePage eyebrow="TRANSACTION MANAGEMENT" title="Transactions" description="A unified operational view of repayments, disbursements, reversals and adjustments." metrics={[{value:"1,284",label:"Transactions this month"},{value:"K 812,440",label:"Total movement"},{value:"3",label:"Pending reconciliation"}]} columns={["Reference","Type","Account","Channel","Amount","Status"]} rows={[
 {cells:["PAY-88341","Repayment","LN-002175","MTN MoMo","K 1,250"],status:{label:"Posted",tone:"green"}},
 {cells:["DIS-7716","Disbursement","LN-002184","Bank transfer","K 35,000"],status:{label:"Posted",tone:"green"}},
 {cells:["ADJ-0041","Adjustment","LN-002179","Internal","K 450"],status:{label:"Approval",tone:"amber"}},
 {cells:["PAY-88338","Repayment","LN-002184","Airtel Money","K 1,900"],status:{label:"Pending",tone:"blue"}}
 ]}/>}
