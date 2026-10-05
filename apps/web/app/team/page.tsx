import ModulePage from "../../components/ModulePage";
export default function Page(){return <ModulePage eyebrow="ACCESS MANAGEMENT" title="Team members" description="Manage staff accounts, branch assignment, roles and operating status." metrics={[{value:"21",label:"Active team members"},{value:"7",label:"Roles in use"},{value:"3",label:"Branches covered"}]} columns={["Team member","Role","Branch","Last active","Status"]} rows={[
 {cells:["Jonathan Simwinga","Organisation Owner","All branches","Now"],status:{label:"Active",tone:"green"}},
 {cells:["Martha Tembo","Manager","Lusaka Central","12 min ago"],status:{label:"Active",tone:"green"}},
 {cells:["Chanda Mwansa","Loan Officer","Kitwe","34 min ago"],status:{label:"Active",tone:"green"}},
 {cells:["Joseph Banda","Collections","Mpika","Yesterday"],status:{label:"Active",tone:"green"}}
 ]}/>}
