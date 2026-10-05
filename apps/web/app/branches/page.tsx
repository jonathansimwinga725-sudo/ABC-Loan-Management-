import ModulePage from "../../components/ModulePage";
export default function Page(){return <ModulePage eyebrow="ORGANISATION" title="Branches" description="Manage operating locations, staff assignment and branch-level portfolio visibility." metrics={[{value:"3",label:"Active branches"},{value:"21",label:"Assigned staff"},{value:"K 1.28m",label:"Total portfolio"}]} columns={["Branch","Code","Town","Manager","Portfolio","Status"]} rows={[
 {cells:["Lusaka Central","LUS-01","Lusaka","M. Tembo","K 684,000"],status:{label:"Active",tone:"green"}},
 {cells:["Kitwe","KIT-01","Kitwe","C. Mwansa","K 418,500"],status:{label:"Active",tone:"green"}},
 {cells:["Mpika","MPI-01","Mpika","J. Banda","K 182,000"],status:{label:"Active",tone:"green"}}
 ]}/>}
