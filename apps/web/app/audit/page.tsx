import ModulePage from "../../components/ModulePage";
export default function Page(){return <ModulePage eyebrow="GOVERNANCE" title="Audit logs" description="Trace sensitive actions by actor, time, entity and outcome across the platform." metrics={[{value:"4,812",label:"Events this month"},{value:"0",label:"Unresolved integrity alerts"},{value:"100%",label:"Actions attributed"}]} columns={["Event","Actor","Entity","Time","Result"]} rows={[
 {cells:["LOAN_APPROVED","M. Tembo","APP-2047","Today 15:21"],status:{label:"Success",tone:"green"}},
 {cells:["PAYMENT_RECORDED","J. Phiri","PAY-88341","Today 09:42"],status:{label:"Success",tone:"green"}},
 {cells:["KYC_VERIFIED","M. Tembo","BRW-10020","Yesterday 16:05"],status:{label:"Success",tone:"green"}},
 {cells:["PRODUCT_EDIT_REQUEST","Jonathan","Business Growth","Yesterday 14:32"],status:{label:"Pending approval",tone:"amber"}}
 ]}/>}
