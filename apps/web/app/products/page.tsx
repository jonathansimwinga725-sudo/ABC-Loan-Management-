import Link from "next/link"; import ModulePage from "../../components/ModulePage"; import {Plus} from "lucide-react";
export default function Page(){return <ModulePage eyebrow="PRODUCT CONFIGURATION" title="Loan products" description="Configure pricing, terms, repayment rules, collateral and approval requirements." action={<Link className="primary" href="/products/new"><Plus size={17}/> New product</Link>} metrics={[{value:"6",label:"Active products"},{value:"12–42%",label:"Interest range"},{value:"4",label:"Require approval workflow"}]} columns={["Product","Interest","Method","Term","Repayment","Status"]} rows={[
 {cells:["Salary Advance","24% p.a.","Flat","1–3 months","Monthly"],status:{label:"Active",tone:"green"}},
 {cells:["Business Growth","28% p.a.","Reducing","3–18 months","Monthly"],status:{label:"Active",tone:"green"}},
 {cells:["Emergency Loan","18% p.a.","Flat","2–8 weeks","Weekly"],status:{label:"Active",tone:"green"}},
 {cells:["Student Loan","12% p.a.","Reducing","6–24 months","Monthly"],status:{label:"Draft",tone:"gray"}}
 ]}/>}
