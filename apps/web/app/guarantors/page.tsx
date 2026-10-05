import ModulePage from "../../components/ModulePage";
export default function Page(){return <ModulePage eyebrow="CREDIT SUPPORT" title="Guarantors" description="Track guarantors linked to borrower applications and active facilities." metrics={[{value:"63",label:"Active guarantors"},{value:"71",label:"Guaranteed loans"},{value:"K 684,000",label:"Covered exposure"}]} columns={["Guarantor","Borrower","Loan","Relationship","Status"]} rows={[
 {cells:["Mary Mwila","Chanda Mwila","LN-002184","Sister"],status:{label:"Active",tone:"green"}},
 {cells:["Joseph Tembo","Grace Tembo","LN-002183","Employer"],status:{label:"Active",tone:"green"}},
 {cells:["Paul Chileshe","Kelvin Phiri","LN-002175","Colleague"],status:{label:"Pending verification",tone:"amber"}}
 ]}/>}
